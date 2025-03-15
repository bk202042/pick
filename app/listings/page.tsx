import { Suspense } from 'react';
import { getListings } from '@/data/listings';
import { ListingGrid } from '@/components/listings/listing-grid';

interface SearchParams {
  propertyType?: string;
  minBedrooms?: string;
  maxPrice?: string;
  page?: string;
}

export const metadata = {
  title: 'Property Listings',
  description: 'Browse our selection of properties for rent or sale',
};

export default async function ListingsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Property Listings</h1>

      <Suspense fallback={<p className="text-center py-8">Loading listings...</p>}>
        <ListingResults searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ListingResults({ searchParams }: { searchParams: SearchParams }) {
  // Convert search params to filter object
  const filter: Record<string, any> = {};

  if (searchParams.propertyType) {
    filter.propertyType = searchParams.propertyType;
  }

  if (searchParams.minBedrooms) {
    filter.minBedrooms = parseInt(searchParams.minBedrooms, 10);
  }

  if (searchParams.maxPrice) {
    filter.maxPrice = parseInt(searchParams.maxPrice, 10);
  }

  // Get page number for pagination
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  // Fetch listings with filter and pagination
  const listings = await getListings({
    limit,
    offset,
    filter,
  });

  return <ListingGrid listings={listings} />;
}
