import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

export const useWorkoutAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's an active session
    const getUser = async () => {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      setLoading(false);
    };

    // Initial check
    getUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Function to get the user ID (or a fallback for demo purposes)
  const getUserId = () => {
    // If authenticated, return the real user ID
    if (user?.id) {
      return user.id;
    }
    
    // For demo/development purposes, return a placeholder ID
    // In production, you'd want to require authentication
    return '00000000-0000-0000-0000-000000000000';
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    getUserId,
  };
};

export default useWorkoutAuth; 