
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// A generic hook to fetch data from Supabase
export function useSupabaseQuery<T>(
  tableName: string, 
  options?: {
    columns?: string;
    filter?: Record<string, any>;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
  }
) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Start building the query
        let query = supabase
          .from(tableName)
          .select(options?.columns || '*');
        
        // Apply filters if provided
        if (options?.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        // Apply order if provided
        if (options?.orderBy) {
          const { column, ascending = true } = options.orderBy;
          query = query.order(column, { ascending });
        }
        
        // Apply limit if provided
        if (options?.limit) {
          query = query.limit(options.limit);
        }
        
        const { data: responseData, error: responseError } = await query;
        
        if (responseError) throw responseError;
        
        setData(responseData as T[]);
      } catch (error) {
        setError(error as Error);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, JSON.stringify(options)]);

  return { data, error, loading };
}

// Hook for user authentication state
export function useSupabaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
