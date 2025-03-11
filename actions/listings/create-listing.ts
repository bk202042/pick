'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/data/supabase/server';
import { getCurrentUser } from '@/data/auth';
import { createListingSchema } from '../schemas';
import { withErrorHandling, validateData } from '../base';
import { Database } from '@/types/database.types';

// Types for better type safety
type Listing = Database['public']['Tables']['listings']['Insert'];

/**
 * Creates a new listing
 * This function is wrapped with error handling
 */
const createListingAction = async (formData: FormData): Promise<Listing> => {
  // Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to create a listing');
  }

  // Check if user has agent or admin role
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'agent' && profile.role !== 'admin')) {
    throw new Error('Only agents and admins can create listings');
  }

  // Parse form data
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
    if (['parking', 'pet_friendly'].includes(key)) {
      formDataObj[key] = value === 'true' || value === 'on';
      return;
    }

    formDataObj[key] = value;
  });

  // Validate data
  const result = await validateData(createListingSchema, formDataObj);
  if (!result.success) {
    throw new Error('Invalid data: ' + JSON.stringify(result.fieldErrors));
  }

  // Insert listing
  const { data, error } = await supabase
    .from('listings')
    .insert({
      ...result.data,
      user_id: user.id,
      // Set approved automatically for admins
      approved: profile.role === 'admin',
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create listing: ${error.message}`);
  }

  // Revalidate the paths to update the UI
  revalidatePath('/listings');
  revalidatePath('/agent/listings');

  return data;
};

// Export with error handling wrapper
export const createListing = withErrorHandling(createListingAction);
