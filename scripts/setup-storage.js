// Script to set up Supabase Storage buckets
// Run with 'node scripts/setup-storage.js'

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase client with admin key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupStorage() {
  try {
    console.log('Setting up Supabase Storage buckets...');

    // Create listing-images bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      throw new Error(`Failed to list buckets: ${bucketsError.message}`);
    }

    const listingImagesBucket = buckets.find(bucket => bucket.name === 'listing-images');

    if (!listingImagesBucket) {
      console.log('Creating listing-images bucket...');
      const { error: createError } = await supabase.storage.createBucket('listing-images', {
        public: true, // Files will be publicly accessible
        fileSizeLimit: 5 * 1024 * 1024, // 5MB file size limit
      });

      if (createError) {
        throw new Error(`Failed to create listing-images bucket: ${createError.message}`);
      }

      console.log('listing-images bucket created successfully.');
    } else {
      console.log('listing-images bucket already exists.');
    }

    // Set up bucket policies
    console.log('Setting up storage policies...');

    // Allow authenticated users to upload files to their own folder
    const { error: policyError } = await supabase.storage.from('listing-images').createPolicy(
      'authenticated can upload',
      {
        name: 'authenticated can upload',
        definition: {
          role: 'authenticated',
          permission: 'INSERT',
          check: "(auth.uid()::text = storage.foldername(name))",
        },
      }
    );

    if (policyError) {
      console.warn(`Warning: Failed to create upload policy: ${policyError.message}`);
    } else {
      console.log('Upload policy created successfully.');
    }

    // Allow authenticated users to delete their own files
    const { error: deleteError } = await supabase.storage.from('listing-images').createPolicy(
      'authenticated can delete own',
      {
        name: 'authenticated can delete own',
        definition: {
          role: 'authenticated',
          permission: 'DELETE',
          check: "(auth.uid()::text = storage.foldername(name))",
        },
      }
    );

    if (deleteError) {
      console.warn(`Warning: Failed to create delete policy: ${deleteError.message}`);
    } else {
      console.log('Delete policy created successfully.');
    }

    console.log('Storage setup completed successfully.');
  } catch (error) {
    console.error('Error setting up storage:', error.message);
    process.exit(1);
  }
}

setupStorage();
