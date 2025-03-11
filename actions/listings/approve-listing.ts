'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/data/supabase/server';
import { getCurrentUser } from '@/data/auth';
import { approveListingSchema } from '../schemas';
import { withErrorHandling, validateData } from '../base';
import { Database } from '@/types/database.types';

// Types for better type safety
type Listing = Database['public']['Tables']['listings']['Update'];

/**
 * Approves or features a listing (admin only)
 * This function is wrapped with error handling
 */
const approveListingAction = async (data: {
  id: string;
  approved: boolean;
  featured?: boolean;
}): Promise<Listing> => {
  // Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to approve listings');
  }

  const supabase = createClient();

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Only allow admins to approve listings
  if (!profile || profile.role !== 'admin') {
    throw new Error('Only admins can approve listings');
  }

  // Validate data
  const result = await validateData(approveListingSchema, data);
  if (!result.success) {
    throw new Error('Invalid data: ' + JSON.stringify(result.fieldErrors));
  }

  // Update listing
  const { data: listing, error } = await supabase
    .from('listings')
    .update({
      approved: result.data.approved,
      featured: result.data.featured ?? false,
    })
    .eq('id', result.data.id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update listing: ${error.message}`);
  }

  // Revalidate the paths to update the UI
  revalidatePath('/listings');
  revalidatePath(`/listings/${result.data.id}`);
  revalidatePath('/admin/listings');

  return listing;
};

// Export with error handling wrapper
export const approveListing = withErrorHandling(approveListingAction);

