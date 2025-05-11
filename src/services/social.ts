
import { supabase } from '@/lib/supabase';
import { User, Post, Comment, NewPostData, NewCommentData } from '@/types/social';

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      return null;
    }
    
    if (!user) return null;
    
    // Create default user with minimal data
    const defaultUser: User = {
      id: user.id,
      email: user.email,
      fullName: user.email?.split('@')[0] || 'Anonymous',
      initials: (user.email?.substring(0, 2) || 'AN').toUpperCase()
    };
    
    try {
      // Check if profiles table exists
      const { error: tableCheckError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (tableCheckError) {
        console.log('Profiles table may not exist yet:', tableCheckError);
        return defaultUser;
      }
      
      // Get profile information
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        // If no profile or error, create one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email
          })
          .single();
          
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
        
        return defaultUser;
      }
      
      if (!data) {
        return defaultUser;
      }
      
      return {
        id: user.id,
        email: user.email,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar_url: data.avatar_url,
        username: data.username || user.email?.split('@')[0],
        verified: data.verified || false,
        fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Anonymous',
        initials: data.first_name && data.last_name 
          ? `${data.first_name[0]}${data.last_name[0]}`.toUpperCase()
          : (user.email?.substring(0, 2) || 'AN').toUpperCase()
      };
    } catch (profileError) {
      console.error('Error in profile fetch:', profileError);
      return defaultUser;
    }
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
};

// Create a new post
export const createPost = async (postData: NewPostData): Promise<Post | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content: postData.content,
      image_url: postData.image_url,
      workout_type: postData.workout_type
    })
    .select('*')
    .single();
  
  if (error || !data) {
    console.error('Error creating post:', error);
    return null;
  }
  
  return data as Post;
};

// Get feed posts
export const getFeedPosts = async (): Promise<Post[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  try {
    // Get posts with user information
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Check if current user liked the posts
    const { data: likedPosts, error: likesError } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);
    
    if (likesError) {
      console.error('Error fetching liked posts:', likesError);
    }
    
    const likedPostIds = likedPosts?.map(like => like.post_id) || [];
    
    // Get user profiles separately
    const userIds = [...new Set(data.map(post => post.user_id))];
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }
    
    const profilesMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }
    
    // Format posts
    return data.map(post => {
      const profileData = profilesMap.get(post.user_id);
      
      // Create user object
      const postUser: User = {
        id: post.user_id,
        email: profileData?.email,
        first_name: profileData?.first_name,
        last_name: profileData?.last_name,
        avatar_url: profileData?.avatar_url,
        username: profileData?.username || 'user',
        verified: profileData?.verified || false,
        fullName: profileData ? 
          `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous' : 
          'Anonymous',
        initials: profileData && profileData.first_name && profileData.last_name
          ? `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase()
          : 'AN'
      };
      
      return {
        ...post,
        user: postUser,
        isLiked: likedPostIds.includes(post.id)
      };
    });
  } catch (error) {
    console.error('Unexpected error in getFeedPosts:', error);
    return [];
  }
};

// Get followed users' posts
export const getFollowingPosts = async (): Promise<Post[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  try {
    // Check if the follows table exists
    const { error: tableCheckError } = await supabase
      .from('follows')
      .select('id')
      .limit(1);
    
    // If follows table doesn't exist or has an error, return empty array
    if (tableCheckError) {
      console.log('Follows table may not exist yet:', tableCheckError);
      return [];
    }
    
    // First, get the list of users that the current user follows
    const { data: followingData, error: followingError } = await supabase
      .from('follows')
      .select('followed_id')
      .eq('follower_id', user.id);
    
    if (followingError) {
      console.error('Error fetching following data:', followingError);
      return [];
    }
    
    if (!followingData || followingData.length === 0) {
      return [];
    }
    
    const followingIds = followingData.map(follow => follow.followed_id);
    
    // Get posts from followed users
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .in('user_id', followingIds)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching following posts:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Check if current user liked the posts
    const { data: likedPosts, error: likesError } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);
    
    if (likesError) {
      console.error('Error fetching liked posts:', likesError);
    }
    
    const likedPostIds = likedPosts?.map(like => like.post_id) || [];
    
    // Get user profiles separately
    const userIds = [...new Set(data.map(post => post.user_id))];
    
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
    }
    
    const profilesMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }
    
    // Format posts
    return data.map(post => {
      const profileData = profilesMap.get(post.user_id);
      
      // Create user object
      const postUser: User = {
        id: post.user_id,
        email: profileData?.email,
        first_name: profileData?.first_name,
        last_name: profileData?.last_name,
        avatar_url: profileData?.avatar_url,
        username: profileData?.username || 'user',
        verified: profileData?.verified || false,
        fullName: profileData ? 
          `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous' : 
          'Anonymous',
        initials: profileData && profileData.first_name && profileData.last_name
          ? `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase()
          : 'AN'
      };
      
      return {
        ...post,
        user: postUser,
        isLiked: likedPostIds.includes(post.id)
      };
    });
  } catch (error) {
    console.error('Unexpected error in getFollowingPosts:', error);
    return [];
  }
};

// Get user's friends
export const getUserFriends = async (userId: string): Promise<User[]> => {
  try {
    // Get all user's connections
    const { data: connections, error } = await supabase
      .from('follows')
      .select('followed_id')
      .eq('follower_id', userId);
      
    if (error) {
      console.error('Error fetching friends:', error);
      return [];
    }
    
    if (!connections || connections.length === 0) {
      return [];
    }
    
    const friendIds = connections.map(conn => conn.followed_id);
    
    // Get user profiles for these connections
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', friendIds);
      
    if (profilesError) {
      console.error('Error fetching friend profiles:', profilesError);
      return [];
    }
    
    // Format friend data
    return (profiles || []).map(profile => ({
      id: profile.id,
      email: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      avatar_url: profile.avatar_url,
      username: profile.username,
      verified: profile.verified || false,
      fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username || 'Anonymous',
      initials: profile.first_name && profile.last_name 
        ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
        : (profile.username?.[0] || 'A').toUpperCase()
    }));
  } catch (error) {
    console.error('Error fetching friends:', error);
    return [];
  }
};

// Get friend requests sent to a user
export const getFriendRequests = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('friend_requests')
      .select(`
        *,
        from_user:from_user_id(id, first_name, last_name, avatar_url, username, verified)
      `)
      .eq('to_user_id', userId)
      .eq('status', 'pending');
      
    if (error) {
      console.error('Error fetching friend requests:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    return [];
  }
};

// Send a friend request
export const sendFriendRequest = async (toUserId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    const { error } = await supabase
      .from('friend_requests')
      .insert({
        from_user_id: user.id,
        to_user_id: toUserId,
        status: 'pending'
      });
      
    return !error;
  } catch (error) {
    console.error('Error sending friend request:', error);
    return false;
  }
};

// Accept a friend request
export const acceptFriendRequest = async (requestId: string, fromUserId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // First, update the request status
    const { error: updateError } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);
      
    if (updateError) {
      console.error('Error accepting friend request:', updateError);
      return false;
    }
    
    // Then create mutual follow relationships
    const { error: followError } = await supabase
      .from('follows')
      .insert([
        {
          follower_id: user.id,
          followed_id: fromUserId
        },
        {
          follower_id: fromUserId,
          followed_id: user.id
        }
      ]);
      
    if (followError) {
      console.error('Error creating follow relationship:', followError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    return false;
  }
};

// Reject a friend request
export const rejectFriendRequest = async (requestId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);
      
    return !error;
  } catch (error) {
    console.error('Error rejecting friend request:', error);
    return false;
  }
};

// Like a post
export const likePost = async (postId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { error } = await supabase
    .from('post_likes')
    .insert({
      post_id: postId,
      user_id: user.id
    });
  
  return !error;
};

// Unlike a post
export const unlikePost = async (postId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { error } = await supabase
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);
  
  return !error;
};

// Add a comment
export const addComment = async (commentData: NewCommentData): Promise<Comment | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: commentData.post_id,
      user_id: user.id,
      content: commentData.content
    })
    .select('*')
    .single();
  
  if (error || !data) {
    console.error('Error adding comment:', error);
    return null;
  }
  
  return data as Comment;
};

// Get comments for a post
export const getPostComments = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('post_comments')
    .select(`
      *,
      profiles:user_id (*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  if (error || !data) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  // Format comments with user info
  return data.map(comment => {
    const profileData = comment.profiles as any;
    
    // Create user object
    const commentUser: User = {
      id: profileData.id,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      avatar_url: profileData.avatar_url,
      username: profileData.username || profileData.email?.split('@')[0],
      verified: profileData.verified || false,
      fullName: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Anonymous',
      initials: profileData.first_name && profileData.last_name 
        ? `${profileData.first_name[0]}${profileData.last_name[0]}`.toUpperCase()
        : (profileData.email?.substring(0, 2) || 'AN').toUpperCase()
    };
    
    delete comment.profiles;
    
    return {
      ...comment,
      user: commentUser
    };
  });
};

// Upload image for post
export const uploadPostImage = async (file: File): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Generate a unique file path
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${timestamp}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

    // Upload directly to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('post-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading to Storage:', error);
      return null;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('post-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadPostImage:', error);
    return null;
  }
};
