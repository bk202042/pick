import { RentalListing } from '@/types/listings';
import { ListingCard } from './listing-card';

interface ListingGridProps {
  listings: RentalListing[];
  emptyMessage?: string;
}

export function ListingGrid({ listings, emptyMessage = 'No listings found' }: ListingGridProps) {
  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
