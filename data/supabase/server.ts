import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import 'server-only';

/**
 * Cookie options for Supabase authentication
 */
export const cookieOptions = {
  name: 'sb-auth',
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
} as const;

/**
 * Creates a Supabase client for use in server contexts
 * This client is used in server components and API routes
 * @returns A typed Supabase client with server-side capabilities
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

/**
 * Typed Supabase client
 * Provides type safety for database operations
 */
export type SupabaseClient = ReturnType<typeof createClient>;
