-- Create saved_listings table
CREATE TABLE
IF NOT EXISTS saved_listings
(
  id UUID DEFAULT uuid_generate_v4
() PRIMARY KEY,
  user_id UUID REFERENCES auth.users
(id) NOT NULL,
  listing_id UUID REFERENCES listings
(id) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP
WITH TIME ZONE DEFAULT NOW
()
);

-- Create unique constraint to prevent duplicate saved listings
ALTER TABLE saved_listings ADD CONSTRAINT unique_user_listing UNIQUE (user_id, listing_id);

-- Enable Row Level Security
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own saved listings
CREATE POLICY "Users can view own saved listings"
ON saved_listings
FOR
SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saved listings
CREATE POLICY "Users can save listings"
ON saved_listings
FOR
INSERT
WITH CHECK (auth.uid() =
user_id);

-- Users can update their own saved listings (for notes)
CREATE POLICY "Users can update own saved listings"
ON saved_listings
FOR
UPDATE
USING (auth.uid()
= user_id);

-- Users can delete their own saved listings
CREATE POLICY "Users can delete own saved listings"
ON saved_listings
FOR
DELETE
USING (auth.uid
() = user_id);

-- Admins can view all saved listings
CREATE POLICY "Admins can view all saved listings"
ON saved_listings
FOR
SELECT
  USING (
  EXISTS (
    SELECT 1
  FROM profiles
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Add indexes for performance
CREATE INDEX idx_saved_listings_user_id ON saved_listings(user_id);
CREATE INDEX idx_saved_listings_listing_id ON saved_listings(listing_id);
