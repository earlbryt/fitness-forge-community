
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fallback to hardcoded values
// for development. In production, always use environment variables.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ghbuxqhlclzkhgydyoih.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYnV4cWhsY2x6a2hneWR5b2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4OTk0MzEsImV4cCI6MjA2MjQ3NTQzMX0.icjCjkiIhYufu_HXkfWlwV6YBy_eAR4_bYv2hCcEqB8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
