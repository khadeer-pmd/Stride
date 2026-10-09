import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseUrl !== 'https://your-project-ref.supabase.co' &&
    supabaseAnonKey && 
    supabaseAnonKey !== 'your-supabase-anon-key-here'
  );
};

// Safe client creation - if not configured, use placeholder URL to prevent runtime throw on import
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-key'
);
