'use server';

import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/data/supabase/server';
import { getCurrentUser } from '@/data/auth';
import { withErrorHandling } from '../base';

/**
 * Uploads an image to Supabase Storage and returns the public URL
 */
const uploadImageAction = async (formData: FormData): Promise<{ url: string }> => {
  // Authenticate user
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('You must be logged in to upload images');
  }

  // Get the file from the formData
  const file = formData.get('file') as File;
  if (!file) {
    throw new Error('No file provided');
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error('File size exceeds the 5MB limit');
  }

  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;

  try {
    // Create a Supabase client
    const supabase = createClient();

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('listing-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: publicUrlData } = supabase.storage
      .from('listing-images')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error uploading image: ${error.message}`);
    }
    throw new Error('An unknown error occurred during image upload');
  }
};

export const uploadImage = withErrorHandling(uploadImageAction);
