export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  workout_type?: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  
  // Added for UI purposes
  user?: User;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  
  // Added for UI purposes
  user?: User;
}

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  username?: string;
  verified?: boolean;
  
  // Helper properties
  fullName?: string;
  initials?: string;
}

export type WorkoutType = 
  | 'Running'
  | 'Strength Training'
  | 'Yoga'
  | 'Cycling'
  | 'Swimming'
  | 'Crossfit'
  | 'HIIT'
  | 'Other';

export interface NewPostData {
  content: string;
  image_url?: string;
  workout_type?: string;
}

export interface NewCommentData {
  post_id: string;
  content: string;
} 
