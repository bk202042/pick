import Link from 'next/link';
import { getFeaturedListings } from '@/data/listings';
import { ListingGrid } from '@/components/listings/listing-grid';

export default async function HomePage() {
  const featuredListings = await getFeaturedListings(3);

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Find Your Perfect Home
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Browse our selection of premium properties for rent in your area.
              We make finding your next home simple and enjoyable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/listings"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                href="/contact"
                className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium py-3 px-6 rounded-md border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Properties
            </h2>
            <Link
              href="/listings"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              View All
            </Link>
          </div>

          <ListingGrid listings={featuredListings} />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to find your new home?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Our team of experts is ready to help you find the perfect property. Get in touch today!
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 font-medium py-3 px-8 rounded-md hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
