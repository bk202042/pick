'use server';

import { createClient } from '@/data/supabase/server';
import { getCurrentUser } from '@/data/auth';
import { withErrorHandling } from '../base';
import { z } from 'zod';
import { validateData } from '../base';

// Schema for image URL validation
const deleteImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
});

/**
 * Deletes an image from Supabase Storage
 */
const deleteImageAction = async (data: { imageUrl: string }): Promise<{ success: true }> => {
  // Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to delete images');
  }

  // Validate image URL
  const result = await validateData(deleteImageSchema, data);
  if (!result.success) {
    throw new Error('Invalid image URL');
  }

  // Extract the path from the URL
  const url = new URL(result.data.imageUrl);
  const pathParts = url.pathname.split('/');

  // The path should be in the format: /storage/v1/object/public/listing-images/userId/fileName
  // We need to extract the userId/fileName part
  const pathIndex = pathParts.findIndex(part => part === 'listing-images');
  if (pathIndex === -1 || pathIndex >= pathParts.length - 2) {
    throw new Error('Invalid image URL format');
  }

  const storagePath = pathParts.slice(pathIndex + 1).join('/');

  // Ensure the user owns this image (check if the path starts with their user ID)
  const userId = storagePath.split('/')[0];
  if (userId !== user.id && user.role !== 'admin') {
    throw new Error('You do not have permission to delete this image');
  }

  try {
    // Create a Supabase client
    const supabase = createClient();

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage
      .from('listing-images')
      .remove([storagePath]);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error deleting image: ${error.message}`);
    }
    throw new Error('An unknown error occurred during image deletion');
  }
};

export const deleteImage = withErrorHandling(deleteImageAction);
