-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  condition_type TEXT NOT NULL CHECK (condition_type IN ('distance', 'duration')),
  condition_value NUMERIC NOT NULL,
  condition_unit TEXT NOT NULL CHECK (condition_unit IN ('km', 'min')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  winner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Challenge participants table
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined')),
  progress NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(challenge_id, user_id)
);

-- Challenge workouts table
CREATE TABLE IF NOT EXISTS challenge_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES challenge_participants(id) ON DELETE CASCADE, 
  activity_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('km', 'min')),
  verified BOOLEAN NOT NULL DEFAULT false,
  map_route TEXT,
  location TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies for challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view challenges they created or are invited to" ON challenges
  FOR SELECT
  USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM challenge_participants 
      WHERE challenge_id = challenges.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create challenges" ON challenges
  FOR INSERT
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update challenges they created" ON challenges
  FOR UPDATE
  USING (created_by = auth.uid());

-- Create RLS policies for participants
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view challenge participants" ON challenge_participants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM challenges 
      WHERE id = challenge_participants.challenge_id 
      AND (created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM challenge_participants cp 
          WHERE cp.challenge_id = challenge_participants.challenge_id 
          AND cp.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can accept/decline challenge invitations" ON challenge_participants
  FOR UPDATE
  USING (user_id = auth.uid());

-- Create RLS policies for workouts
ALTER TABLE challenge_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view challenge workouts" ON challenge_workouts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM challenge_participants 
      WHERE id = challenge_workouts.participant_id
      AND EXISTS (
        SELECT 1 FROM challenges 
        WHERE id = challenge_participants.challenge_id 
        AND (created_by = auth.uid() OR
          EXISTS (
            SELECT 1 FROM challenge_participants cp 
            WHERE cp.challenge_id = challenge_participants.challenge_id 
            AND cp.user_id = auth.uid()
          )
        )
      )
    )
  );

CREATE POLICY "Users can log their own workouts" ON challenge_workouts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM challenge_participants 
      WHERE id = challenge_workouts.participant_id AND user_id = auth.uid()
    )
  );

-- Function to update challenge status and check for winners
CREATE OR REPLACE FUNCTION update_challenge_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update participant progress
  UPDATE challenge_participants
  SET progress = (
    SELECT COALESCE(SUM(value), 0)
    FROM challenge_workouts
    WHERE participant_id = NEW.participant_id AND verified = true
  )
  WHERE id = NEW.participant_id;
  
  -- Check if the participant has completed the challenge
  WITH challenge_data AS (
    SELECT 
      c.id,
      c.condition_value,
      c.status,
      cp.progress,
      cp.user_id
    FROM challenges c
    JOIN challenge_participants cp ON cp.challenge_id = c.id
    WHERE cp.id = NEW.participant_id
  )
  UPDATE challenges
  SET 
    status = CASE 
      WHEN data.status = 'active' AND data.progress >= data.condition_value THEN 'completed'
      ELSE data.status
    END,
    winner_id = CASE 
      WHEN data.status = 'active' AND data.progress >= data.condition_value THEN data.user_id
      ELSE winner_id
    END
  FROM challenge_data data
  WHERE challenges.id = data.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_challenge_progress
AFTER INSERT OR UPDATE ON challenge_workouts
FOR EACH ROW
EXECUTE FUNCTION update_challenge_progress();

-- Function to activate challenges when start date is reached
CREATE OR REPLACE FUNCTION activate_pending_challenges()
RETURNS void AS $$
BEGIN
  UPDATE challenges
  SET status = 'active'
  WHERE status = 'pending' AND start_date <= now();
END;
$$ LANGUAGE plpgsql;

-- Function to end challenges when end date is reached
CREATE OR REPLACE FUNCTION complete_expired_challenges()
RETURNS void AS $$
BEGIN
  UPDATE challenges
  SET status = 'completed'
  WHERE status = 'active' AND end_date <= now();
END;
$$ LANGUAGE plpgsql; 