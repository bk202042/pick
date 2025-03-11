'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/data/supabase/server';
import { getCurrentUser } from '@/data/auth';
import { withErrorHandling } from '../base';

/**
 * Deletes a listing by ID
 * This function is wrapped with error handling
 */
const deleteListingAction = async (id: string): Promise<{ id: string }> => {
  // Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to delete a listing');
  }

  const supabase = createClient();

  // Check listing exists and user permissions
  const { data: existingListing, error: fetchError } = await supabase
    .from('listings')
    .select('user_id')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(`Listing not found: ${fetchError.message}`);
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Only allow admins or the owner to delete
  const isAdmin = profile?.role === 'admin';
  if (!isAdmin && existingListing.user_id !== user.id) {
    throw new Error('You do not have permission to delete this listing');
  }

  // Delete listing
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete listing: ${error.message}`);
  }

  // Revalidate the paths to update the UI
  revalidatePath('/listings');
  revalidatePath('/agent/listings');
  revalidatePath('/admin/listings');

  return { id };
};

// Export with error handling wrapper
export const deleteListing = withErrorHandling(deleteListingAction);
