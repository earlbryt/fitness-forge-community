import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fallback to hardcoded values
// for development. In production, always use environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ozgemfiolaxpkygvqeil.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96Z2VtZmlvbGF4cGt5Z3ZxZWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NzM0NjcsImV4cCI6MjA2MjI0OTQ2N30.9hsCKtq9piIC2R4oiKmRuxkLoBj1szaFAimNsJ45_ho';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 