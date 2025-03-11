import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in browser environments
 * This client is used in client components
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Typed Supabase client
 * Provides type safety for database operations
 */
export type SupabaseClient = ReturnType<typeof createClient>;
