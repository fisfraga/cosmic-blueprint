import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Returns true if Supabase credentials are configured in the environment.
 * When false, auth features are hidden and the app runs in local-only mode.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

let _supabase: SupabaseClient | null = null;

/**
 * Get the Supabase client instance.
 * Returns null if Supabase is not configured — callers must guard with isSupabaseConfigured().
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!_supabase) {
    _supabase = createClient(supabaseUrl!, supabaseAnonKey!);
  }

  return _supabase;
}

export type { SupabaseClient };
