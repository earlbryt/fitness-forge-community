// Activity Types
export type ActivityType = 'running' | 'cycling' | 'yoga' | 'weightlifting' | 'swimming' | 'walking' | 'hiking' | string;

// Categorizing activities
export const DYNAMIC_ACTIVITIES = ['running', 'cycling', 'swimming', 'walking', 'hiking'];
export const STATIC_ACTIVITIES = ['yoga', 'weightlifting', 'stretching', 'meditation'];

// Challenge Types
export type ChallengeStatus = 'pending' | 'active' | 'completed';
export type ParticipantStatus = 'invited' | 'accepted' | 'declined';

// Challenge Interface
export interface Challenge {
  id: string;
  title: string;
  activityType: ActivityType;
  condition: {
    type: 'distance' | 'duration';
    value: number;
    unit: 'km' | 'min';
  };
  startDate: Date;
  endDate: Date;
  createdBy: string; // User ID
  participants: ChallengeParticipant[];
  status: ChallengeStatus;
  winner?: string; // User ID of winner
}

// Challenge Participant Interface
export interface ChallengeParticipant {
  userId: string;
  displayName: string;
  status: ParticipantStatus;
  progress: number; // Current progress (in km or min)
  workouts: ChallengeWorkout[];
}

// Workout logged for a challenge
export interface ChallengeWorkout {
  id: string;
  date: Date;
  activityType: ActivityType;
  value: number; // Distance or duration
  unit: 'km' | 'min';
  verified: boolean;
  mapRoute?: string; // URL to map view for dynamic activities
  location?: string; // Location name for static activities
} 