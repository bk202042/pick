import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { type User } from '@supabase/supabase-js';
import { cache } from 'react';

/**
 * Fetches the current authenticated user
 * Cached to prevent duplicate requests in the same render cycle
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
});

/**
 * Checks if the current user has a specific role
 * @param role The role to check for
 * @returns Boolean indicating if the user has the specified role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // Fetch user profile to get role
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !data) return false;

  return data.role === role;
}

/**
 * Checks if the current user is an agent
 */
export async function isAgent(): Promise<boolean> {
  return hasRole('agent');
}

/**
 * Checks if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Requires authentication, redirects to login if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return user;
}

/**
 * Requires a specific role, redirects to unauthorized page if not authorized
 * @param role The required role
 */
export async function requireRole(role: string): Promise<User> {
  const user = await requireAuth();
  const hasRequiredRole = await hasRole(role);

  if (!hasRequiredRole) {
    redirect('/unauthorized');
  }

  return user;
}

/**
 * Signs out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/');
}
