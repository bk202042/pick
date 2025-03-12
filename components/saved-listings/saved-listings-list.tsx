'use client';

import React from 'react';
import { SaveButton } from './save-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { priceFormatter } from '@/lib/formatters';

interface SavedListingsListProps {
  savedListings: Array<{
    id: string;
    listing: {
      id: string;
      title: string;
      price: number;
      address: string;
      city: string;
      state: string;
      bedrooms: number | null;
      bathrooms: number | null;
      square_footage: number | null;
      property_type: string;
      image_urls: string[] | null;
    };
    notes: string | null;
  }>;
}

export function SavedListingsList({ savedListings }: SavedListingsListProps) {
  if (!savedListings.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No Saved Listings</h3>
        <p className="text-muted-foreground">You haven't saved any properties yet.</p>
        <Link
          href="/listings"
          className="inline-block mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Browse Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedListings.map((saved) => (
        <Card key={saved.id} className="overflow-hidden">
          <div className="aspect-video relative overflow-hidden">
            {saved.listing.image_urls && saved.listing.image_urls.length > 0 ? (
              <Image
                src={saved.listing.image_urls[0]}
                alt={saved.listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            <div className="absolute top-2 right-2">
              <SaveButton
                listingId={saved.listing.id}
                isSaved={true}
                savedId={saved.id}
                variant="secondary"
              />
            </div>
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-xl">
              <Link href={`/listings/${saved.listing.id}`} className="hover:underline">
                {saved.listing.title}
              </Link>
            </CardTitle>
            <p className="text-lg font-bold text-primary">
              {priceFormatter.format(saved.listing.price)}
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground mb-2">
              {saved.listing.address}, {saved.listing.city}, {saved.listing.state}
            </p>
            <div className="flex items-center gap-4 text-sm">
              {saved.listing.bedrooms && (
                <span>
                  <strong>{saved.listing.bedrooms}</strong>{' '}
                  {saved.listing.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              )}
              {saved.listing.bathrooms && (
                <span>
                  <strong>{saved.listing.bathrooms}</strong>{' '}
                  {saved.listing.bathrooms === 1 ? 'Bath' : 'Baths'}
                </span>
              )}
              {saved.listing.square_footage && (
                <span>
                  <strong>{saved.listing.square_footage.toLocaleString()}</strong> sqft
                </span>
              )}
            </div>
            {saved.notes && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm font-semibold">Your Notes:</p>
                <p className="text-sm">{saved.notes}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link
              href={`/listings/${saved.listing.id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              View Details
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
