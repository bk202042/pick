'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RentalListing } from '@/types/listings';
import { formatCurrency } from '@/lib/utils';

interface ListingCardProps {
  listing: RentalListing;
}

export function ListingCard({ listing }: ListingCardProps) {
  // Default placeholder image
  const placeholderImage = 'https://placehold.co/600x400/e2e8f0/475569?text=Property+Image';

  return (
    <div className="group rounded-lg border border-gray-200 overflow-hidden transition-shadow hover:shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/listings/${listing.id}`} className="flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden">
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {/* Placeholder for when we have actual listing images */}
            <Image
              src={placeholderImage}
              alt={listing.address.streetAddress}
              className="object-cover"
              fill
              priority={false}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-900 px-2 py-1 text-xs rounded-md">
            {listing.propertyType}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="text-lg font-semibold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {listing.address.streetAddress}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {listing.address.city}, {listing.address.state} {listing.address.zipCode}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(listing.pricing.monthlyRent)}
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span>
            </p>
          </div>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-auto">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>{listing.details.bedrooms} bd</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              <span>{listing.details.bathrooms} ba</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
              <span>{listing.details.squareFeet} sqft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
