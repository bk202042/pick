import { z } from 'zod';

// Profile schema
export const profileSchema = z.object({
  full_name: z.string().min(1, 'Full name is required').max(255),
  avatar_url: z.string().url().nullable().optional(),
  role: z.enum(['user', 'agent', 'admin']).default('user'),
});

// Listing schema for creation
export const createListingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(255),
  description: z.string().min(10, 'Description must be at least 10 characters').optional().nullable(),
  address: z.string().min(5, 'Address is required').max(255),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(50),
  zip_code: z.string().min(1, 'ZIP code is required').max(20),
  neighborhood: z.string().max(100).optional().nullable(),
  price: z.number().positive('Price must be positive'),
  property_type: z.string().min(1, 'Property type is required'),
  bedrooms: z.number().int().positive('Bedrooms must be positive').optional().nullable(),
  bathrooms: z.number().positive('Bathrooms must be positive').optional().nullable(),
  square_footage: z.number().int().positive('Square footage must be positive').optional().nullable(),
  parking: z.boolean().default(false),
  parking_fee: z.number().int().nonnegative('Parking fee cannot be negative').default(0),
  pet_friendly: z.boolean().default(false),
  pet_deposit: z.number().int().nonnegative('Pet deposit cannot be negative').default(0),
  utilities: z.array(z.string()).default([]),
  utilities_cost: z.number().int().nonnegative('Utilities cost cannot be negative').default(0),
  security_deposit: z.number().int().positive('Security deposit must be positive').optional().nullable(),
  minimum_lease: z.number().int().positive('Minimum lease must be positive').optional().nullable(),
  available_date: z.string().optional().nullable(),
  application_fee: z.number().int().nonnegative('Application fee cannot be negative').optional().nullable(),
  amenities: z.array(z.string()).default([]),
  image_urls: z.array(z.string().url('Invalid image URL')).default([]),
  property_manager: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  contact_email: z.string().email('Invalid email').optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  nearby_transportation: z.array(z.string()).default([]),
});

// Update listing schema - similar to create but all fields optional
export const updateListingSchema = createListingSchema.partial();

// Schema for listing approval
export const approveListingSchema = z.object({
  id: z.string().uuid('Invalid listing ID'),
  approved: z.boolean(),
  featured: z.boolean().optional(),
});

// Schema for saving a listing
export const saveListingSchema = z.object({
  listing_id: z.string().uuid('Invalid listing ID'),
  notes: z.string().optional().nullable(),
});

// Schema for updating saved listing notes
export const updateSavedListingSchema = z.object({
  id: z.string().uuid('Invalid saved listing ID'),
  notes: z.string().optional().nullable(),
});

