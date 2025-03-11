-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  neighborhood TEXT,
  price INTEGER NOT NULL CHECK (price > 0),
  property_type TEXT NOT NULL,
  bedrooms INTEGER CHECK (bedrooms > 0),
  bathrooms NUMERIC(3,1) CHECK (bathrooms > 0),
  square_footage INTEGER CHECK (square_footage > 0),
  parking BOOLEAN DEFAULT false,
  parking_fee INTEGER DEFAULT 0,
  pet_friendly BOOLEAN DEFAULT false,
  pet_deposit INTEGER DEFAULT 0,
  utilities TEXT[] DEFAULT '{}',
  utilities_cost INTEGER DEFAULT 0,
  security_deposit INTEGER,
  minimum_lease INTEGER,
  available_date DATE,
  application_fee INTEGER,
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  nearby_transportation TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  image_urls TEXT[] DEFAULT '{}',
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  property_manager TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Apply the timestamp trigger to listings
CREATE TRIGGER set_timestamp_listings
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Approved listings are viewable by everyone
CREATE POLICY "Approved listings are viewable by everyone"
ON listings
FOR SELECT
USING (approved = true);

-- Agents can view their own unapproved listings
CREATE POLICY "Agents can view own listings"
ON listings
FOR SELECT
USING (auth.uid() = user_id);

-- Agents can insert their own listings
CREATE POLICY "Agents can create listings"
ON listings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Agents can update their own listings
CREATE POLICY "Agents can update own listings"
ON listings
FOR UPDATE
USING (auth.uid() = user_id);

-- Agents can delete their own listings
CREATE POLICY "Agents can delete own listings"
ON listings
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all listings
CREATE POLICY "Admins can view all listings"
ON listings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Admins can update all listings
CREATE POLICY "Admins can update all listings"
ON listings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Add indexes for performance
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_property_type ON listings(property_type);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_bedrooms ON listings(bedrooms);
CREATE INDEX idx_listings_approved ON listings(approved);
CREATE INDEX idx_listings_featured ON listings(featured);
CREATE INDEX idx_listings_city_state ON listings(city, state);
