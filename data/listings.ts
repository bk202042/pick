import 'server-only';
import { notFound } from 'next/navigation';
import { createClient } from './supabase/server';
import { RentalListing, RentalListingsData } from '@/types/listings';
import dummyData from './rental-listings-dummy-data.json';

/**
 * Retrieves all property listings
 * In development, returns dummy data
 * In production, would fetch from Supabase
 */
export async function getListings({
  limit = 10,
  offset = 0,
  filter = {},
}: {
  limit?: number;
  offset?: number;
  filter?: Record<string, any>;
} = {}): Promise<RentalListing[]> {
  // For now, use the dummy data
  const data = dummyData as RentalListingsData;

  // Apply basic filtering if needed
  let filteredListings = [...data.rentalListings];

  if (filter.minBedrooms) {
    filteredListings = filteredListings.filter(
      listing => listing.details.bedrooms >= filter.minBedrooms
    );
  }

  if (filter.maxPrice) {
    filteredListings = filteredListings.filter(
      listing => listing.pricing.monthlyRent <= filter.maxPrice
    );
  }

  if (filter.propertyType) {
    filteredListings = filteredListings.filter(
      listing => listing.propertyType === filter.propertyType
    );
  }

  // Apply pagination
  return filteredListings.slice(offset, offset + limit);
}

/**
 * Retrieves a single property listing by ID
 * In development, returns dummy data
 * In production, would fetch from Supabase
 */
export async function getListingById(id: string): Promise<RentalListing> {
  // For now, use the dummy data
  const data = dummyData as RentalListingsData;

  const listing = data.rentalListings.find(listing => listing.id === id);

  if (!listing) {
    notFound();
  }

  return listing;
}

/**
 * Retrieves featured property listings
 * In development, returns dummy data
 * In production, would fetch from Supabase with a featured flag
 */
export async function getFeaturedListings(limit = 3): Promise<RentalListing[]> {
  // For now, just return the first few listings from dummy data
  const data = dummyData as RentalListingsData;
  return data.rentalListings.slice(0, limit);
}

/**
 * Counts the total number of listings with optional filters
 */
export async function getListingCount(filter: Record<string, any> = {}): Promise<number> {
  // For now, return the count from dummy data
  const data = dummyData as RentalListingsData;
  return data.metadata.totalListings;
}

/**
 * Gets unique property types available in listings
 */
export async function getPropertyTypes(): Promise<string[]> {
  const data = dummyData as RentalListingsData;
  const propertyTypes = new Set<string>();

  data.rentalListings.forEach(listing => {
    propertyTypes.add(listing.propertyType);
  });

  return Array.from(propertyTypes);
}
