'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/data/supabase/server';
import { getCurrentUser } from '@/data/auth';
import { saveListingSchema } from '../schemas';
import { withErrorHandling, validateData } from '../base';
import { Database } from '@/types/database.types';

// Types for better type safety
type SavedListing = Database['public']['Tables']['saved_listings']['Insert'];

/**
 * Saves a listing for a user
 * This function is wrapped with error handling
 */
const saveListingAction = async (data: {
  listing_id: string;
  notes?: string | null;
}): Promise<SavedListing> => {
  // Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to save a listing');
  }

  // Validate data
  const result = await validateData(saveListingSchema, data);
  if (!result.success) {
    throw new Error('Invalid data: ' + JSON.stringify(result.fieldErrors));
  }

  const supabase = createClient();

  // Check if listing exists
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('id')
    .eq('id', result.data.listing_id)
    .single();

  if (listingError) {
    throw new Error(`Listing not found: ${listingError.message}`);
  }

  // Check if already saved
  const { data: existingSaved } = await supabase
    .from('saved_listings')
    .select('id')
    .eq('user_id', user.id)
    .eq('listing_id', result.data.listing_id)
    .maybeSingle();

  // If already saved, update notes
  if (existingSaved) {
    const { data: updated, error } = await supabase
      .from('saved_listings')
      .update({
        notes: result.data.notes,
      })
      .eq('id', existingSaved.id)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update saved listing: ${error.message}`);
    }

    revalidatePath('/account/saved');
    return updated;
  }

  // Save new listing
  const { data: savedListing, error } = await supabase
    .from('saved_listings')
    .insert({
      user_id: user.id,
      listing_id: result.data.listing_id,
      notes: result.data.notes,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to save listing: ${error.message}`);
  }

  // Revalidate the paths to update the UI
  revalidatePath('/account/saved');

  return savedListing;
};

// Export with error handling wrapper
export const saveListing = withErrorHandling(saveListingAction);

