import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import 'server-only';

/**
 * Creates an admin Supabase client with service role privileges
 * IMPORTANT: This client bypasses RLS policies and should ONLY be used for admin operations
 * @returns A Supabase client with admin privileges
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Typed Admin Supabase client
 */
export type SupabaseAdminClient = ReturnType<typeof createAdminClient>;
