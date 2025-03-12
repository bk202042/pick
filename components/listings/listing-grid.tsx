import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

type Listing = {
  id: string;
  propertyType: string;
  address: {
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    neighborhood: string;
  };
  pricing: {
    monthlyRent: number;
  };
  details: {
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
  };
};

interface ListingGridProps {
  listings: Listing[];
}

export function ListingGrid({ listings }: ListingGridProps) {
  const placeholderImage = 'https://placehold.co/600x400/e2e8f0/475569?text=Property+Image';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Link
          href={`/listings/${listing.id}`}
          key={listing.id}
          className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="relative aspect-video">
            <Image
              src={placeholderImage}
              alt={listing.address.streetAddress}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {listing.address.streetAddress}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {listing.address.city}, {listing.address.state}
            </p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-3">
              {formatCurrency(listing.pricing.monthlyRent)}<span className="text-sm font-normal text-gray-600 dark:text-gray-400">/mo</span>
            </p>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <span>{listing.details.bedrooms} {listing.details.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              <span>{listing.details.bathrooms} {listing.details.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              <span>{listing.details.squareFeet.toLocaleString()} sqft</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
