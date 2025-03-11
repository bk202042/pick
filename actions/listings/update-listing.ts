'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/data/supabase/server';
import { getCurrentUser } from '@/data/auth';
import { updateListingSchema } from '../schemas';
import { withErrorHandling, validateData } from '../base';
import { Database } from '@/types/database.types';

// Types for better type safety
type Listing = Database['public']['Tables']['listings']['Update'];

/**
 * Updates an existing listing
 * This function is wrapped with error handling
 */
const updateListingAction = async (id: string, formData: FormData): Promise<Listing> => {
  // Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to update a listing');
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

  // Only allow admins or the owner to update
  const isAdmin = profile?.role === 'admin';
  if (!isAdmin && existingListing.user_id !== user.id) {
    throw new Error('You do not have permission to update this listing');
  }

  // Parse form data - similar to create listing
  const formDataObj: Record<string, any> = {};
  formData.forEach((value, key) => {
    // Skip empty values for optional fields
    if (value === '') return;

    // Handle array fields
    if (key.endsWith('[]')) {
      const realKey = key.slice(0, -2);
      if (!formDataObj[realKey]) {
        formDataObj[realKey] = [];
      }
      formDataObj[realKey].push(value);
      return;
    }

    // Handle numeric fields
    if (
      [
        'price',
        'bedrooms',
        'bathrooms',
        'square_footage',
        'parking_fee',
        'pet_deposit',
        'utilities_cost',
        'security_deposit',
        'minimum_lease',
        'application_fee',
        'latitude',
        'longitude'
      ].includes(key) && value !== ''
    ) {
      formDataObj[key] = Number(value);
      return;
    }

    // Handle boolean fields
    if (['parking', 'pet_friendly', 'approved', 'featured'].includes(key)) {
      formDataObj[key] = value === 'true' || value === 'on';
      return;
    }

    formDataObj[key] = value;
  });

  // Validate data
  const result = await validateData(updateListingSchema, formDataObj);
  if (!result.success) {
    throw new Error('Invalid data: ' + JSON.stringify(result.fieldErrors));
  }

  // Remove approval status if user is not admin
  if (!isAdmin && 'approved' in result.data) {
    delete result.data.approved;
  }
  if (!isAdmin && 'featured' in result.data) {
    delete result.data.featured;
  }

  // Update listing
  const { data, error } = await supabase
    .from('listings')
    .update(result.data)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update listing: ${error.message}`);
  }

  // Revalidate the paths to update the UI
  revalidatePath('/listings');
  revalidatePath(`/listings/${id}`);
  revalidatePath('/agent/listings');
  revalidatePath('/admin/listings');

  return data;
};

// Export with error handling wrapper
export const updateListing = withErrorHandling(updateListingAction);

