# Supabase Storage Setup Instructions

This document provides instructions for setting up the necessary Supabase Storage buckets for the real estate platform.

## Setup Instructions

1. Navigate to your Supabase dashboard at https://app.supabase.com
2. Open your project
3. Go to "Storage" in the left sidebar
4. Create a new bucket named `listing-images` with the following settings:
   - Set "Public bucket" to ON
   - Set "Allow file size uploads up to" to 5MB
   - Click "Create bucket"

5. Set up the necessary bucket policies:

### Upload Policy
Create a policy for authenticated users to upload files:
- Policy name: `authenticated can upload`
- Allowed operation: `INSERT`
- For role: `authenticated`
- Policy definition: `(auth.uid()::text = storage.foldername(name))`

### Delete Policy
Create a policy for users to delete their own files:
- Policy name: `authenticated can delete own`
- Allowed operation: `DELETE`
- For role: `authenticated`
- Policy definition: `(auth.uid()::text = storage.foldername(name))`

### Read Policy
Create a policy for public access to read files:
- Policy name: `public can read`
- Allowed operation: `SELECT`
- For role: `anon`
- Policy definition: `true`

## Usage in Code

The image upload and delete functions are implemented in:
- `actions/listings/upload-image.ts` - For uploading images
- `actions/listings/delete-image.ts` - For deleting images

These functions handle:
- Authentication and authorization
- File validation (type and size)
- Generating unique filenames
- Organizing files by user ID

## Folder Structure

Images are stored with the following path structure:
`listing-images/{user_id}/{unique_filename}`

This structure ensures:
- Users can only access their own files
- Files have unique names to prevent collisions
- Easy organization and cleanup of files by user
