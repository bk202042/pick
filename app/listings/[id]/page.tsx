import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getListingById, getFeaturedListings } from '@/data/listings';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ListingGrid } from '@/components/listings/listing-grid';

type ListingPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  try {
    const listing = await getListingById(params.id);

    return {
      title: `${listing.address.streetAddress} | Property Listing`,
      description: `${listing.details.bedrooms} bed, ${listing.details.bathrooms} bath property located at ${listing.address.streetAddress}, ${listing.address.city}, ${listing.address.state}`,
    };
  } catch (error) {
    return {
      title: 'Property Listing',
      description: 'View property details',
    };
  }
}

export default async function ListingDetailsPage({ params }: ListingPageProps) {
  try {
    const listing = await getListingById(params.id);
    const placeholderImage = 'https://placehold.co/1200x800/e2e8f0/475569?text=Property+Image';

    // Similar listings (featured listings for now)
    const similarListings = (await getFeaturedListings(3)).filter(l => l.id !== listing.id);

    return (
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{listing.address.streetAddress}</h1>
          <p className="text-gray-600 dark:text-gray-300">
            {listing.address.city}, {listing.address.state} {listing.address.zipCode} - {listing.address.neighborhood}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
              <Image
                src={placeholderImage}
                alt={listing.address.streetAddress}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-md flex items-center">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {listing.details.bedrooms} {listing.details.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                </span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-md flex items-center">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {listing.details.bathrooms} {listing.details.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                </span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-md flex items-center">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {listing.details.squareFeet} sqft
                </span>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-md flex items-center">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {listing.propertyType}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {`A beautiful ${listing.details.bedrooms} bedroom, ${listing.details.bathrooms} bathroom ${listing.propertyType.toLowerCase()}
                located in the heart of ${listing.address.neighborhood}, ${listing.address.city}. This property offers
                ${listing.details.squareFeet} square feet of living space and includes amenities such as
                ${listing.amenities.slice(0, 3).join(', ')}${listing.amenities.length > 3 ? ', and more' : ''}.`}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {listing.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md sticky top-10">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(listing.pricing.monthlyRent)}
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400">/month</span>
                </h3>
                {listing.pricing.utilities.length > 0 && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    +{formatCurrency(listing.pricing.utilitiesCost)} est. for {listing.pricing.utilities.join(', ')}
                  </p>
                )}
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Security deposit: {formatCurrency(listing.pricing.securityDeposit)}
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold mb-2">Lease Terms</h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>Available: {formatDate(listing.leaseTerms.availableDate)}</li>
                  <li>Minimum lease: {listing.leaseTerms.minimumLease} months</li>
                  <li>Application fee: {formatCurrency(listing.leaseTerms.applicationFee)}</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-2">Contact</h4>
                <div className="text-sm space-y-2">
                  <p className="font-medium">{listing.contactInfo.propertyManagement}</p>
                  <p>{listing.contactInfo.contactPhone}</p>
                  <p className="text-blue-600 dark:text-blue-400">{listing.contactInfo.contactEmail}</p>
                </div>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors">
                Contact Property
              </button>
            </div>
          </div>
        </div>

        {similarListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Properties</h2>
            <ListingGrid listings={similarListings} />
          </div>
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}
