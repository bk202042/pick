'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/data/supabase/server';
import { getCurrentUser } from '@/data/auth';
import { z } from 'zod';
import { withErrorHandling, validateData } from '../base';

// Schema for removing a saved listing
const removeSavedListingSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Removes a saved listing for a user
 * This function is wrapped with error handling
 */
const removeSavedListingAction = async (data: { id: string }): Promise<{ id: string }> => {
  // Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to remove a saved listing');
  }

  // Validate data
  const result = await validateData(removeSavedListingSchema, data);
  if (!result.success) {
    throw new Error('Invalid data: ' + JSON.stringify(result.fieldErrors));
  }

  const supabase = createClient();

  // Check if saved listing exists and belongs to the user
  const { data: savedListing, error: findError } = await supabase
    .from('saved_listings')
    .select('id')
    .eq('id', result.data.id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (findError) {
    throw new Error(`Error finding saved listing: ${findError.message}`);
  }

  if (!savedListing) {
    throw new Error('Saved listing not found or you do not have permission to delete it');
  }

  // Delete the saved listing
  const { error: deleteError } = await supabase
    .from('saved_listings')
    .delete()
    .eq('id', result.data.id)
    .eq('user_id', user.id);

  if (deleteError) {
    throw new Error(`Failed to remove saved listing: ${deleteError.message}`);
  }

  // Revalidate the paths to update the UI
  revalidatePath('/account/saved');

  return { id: result.data.id };
};

// Export with error handling wrapper
export const removeSavedListing = withErrorHandling(removeSavedListingAction);
