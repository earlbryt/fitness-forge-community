
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{
    error: any | null;
    success: boolean;
    message?: string;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    success: boolean;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signUp = async (email: string, password: string, username?: string) => {
    try {
      console.log('Starting signup process for:', email, 'with full name:', username);
      
      // First, sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            full_name: username || email.split('@')[0],
          },
        },
      });

      console.log('Signup response:', { data, error });
      
      if (error) {
        console.error('Supabase signup error:', error);
        return { 
          error, 
          success: false,
          message: error.message
        };
      }
      
      // Check if user already exists
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        console.warn('User already exists but may not be confirmed');
        return { 
          error: null, 
          success: false,
          message: 'This email is already registered. Please try signing in instead.'
        };
      }
      
      // Since email confirmation is disabled, proceed with session
      if (data?.session) {
        // User is automatically logged in
        console.log('User signed up and logged in successfully with ID:', data.user?.id);
        
        // Create or update the profile with full name and username
        if (data.user) {
          try {
            // Explicitly create a new profile record with name data
            const profilePayload = {
              id: data.user.id,
              username: username || email.split('@')[0],
              full_name: username || email.split('@')[0],
              email: email,
              updated_at: new Date().toISOString()
            };
            
            console.log('Creating profile with data:', profilePayload);
            
            const { data: profileResult, error: profileError } = await supabase
              .from('profiles')
              .upsert(profilePayload, { onConflict: 'id' })
              .select();
            
            if (profileError) {
              console.error('Error creating profile:', profileError);
            } else {
              console.log('Profile created/updated successfully:', profileResult);
            }
            
            // Double-check that the profile was created
            const { data: checkData, error: checkError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            if (checkError) {
              console.error('Error verifying profile:', checkError);
            } else {
              console.log('Profile verification:', checkData);
            }
          } catch (profileErr) {
            console.error('Error during profile creation:', profileErr);
          }
        }
        
        navigate('/app');
        return { error: null, success: true };
      } else {
        // For some reason there's no session, but account was created
        console.log('User account created but no session returned');
        return { 
          error: null, 
          success: true,
          message: 'Your account has been created. Please log in.'
        };
      }
    } catch (error) {
      console.error('Unexpected error during signup:', error);
      return { 
        error, 
        success: false,
        message: 'An unexpected error occurred. Please try again later.'
      };
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Signin response:', { data: !!data, error });
      
      if (error) {
        console.error('Supabase signin error:', error);
        return { error, success: false };
      }

      // Redirect to dashboard after successful sign in
      navigate('/app');
      return { error: null, success: true };
    } catch (error) {
      console.error('Unexpected error during signin:', error);
      return { error, success: false };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
