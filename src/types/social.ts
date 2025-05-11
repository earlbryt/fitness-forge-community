export interface Post {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user?: User;
  image_url?: string;
  likes_count: number;
  comments_count: number;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  user?: User;
}

export interface User {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  avatar_url?: string;
  verified?: boolean;
  fullName?: string;
  initials?: string;
}

// WorkoutType definition removed as it's no longer needed

export interface NewPostData {
  content: string;
  image_url?: string;
}

export interface NewCommentData {
  post_id: string;
  content: string;
}

export type ChallengeStatus = 'pending' | 'active' | 'completed' | 'declined';

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  challenge_type: 'distance' | 'completion';
  target_distance?: number;
  distance_unit?: 'km' | 'mi';
  start_date: string;
  end_date: string;
  created_at: string;
  creator_id: string;
  opponent_id: string;
  status: ChallengeStatus;
  winner_id?: string;
  creator: User;
  opponent: User;
}

export interface NewChallengeData {
  title: string;
  description?: string;
  challenge_type: 'distance' | 'completion';
  target_distance?: number;
  distance_unit?: 'km' | 'mi';
  start_date: string;
  end_date: string;
  opponent_id: string;
}
