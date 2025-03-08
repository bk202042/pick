# **Product Requirements Document: Real Estate Listing Website**

## 1. Project Overview

* **Project Name:** Real Estate Listing Website
* **Goal:** To create a user-friendly platform for browsing and managing real estate listings, providing comprehensive property information and facilitating connections between buyers, sellers, and agents.
* **Target Audience:**
    * Potential homebuyers and renters
    * Real estate agents and brokers
    * Administrators managing the platform
* **Key Technologies:**
    * Next.js (React framework)
    * TypeScript (Language)
    * Tailwind CSS (Styling)
    * Supabase (Database and Authentication)
    * Data Access Layer (DAL) for secure and consistent data handling
* **Success Metrics:**
    * Number of active listings
    * User engagement (page views, time on site)
    * Lead generation (contact form submissions)
    * User registration and retention rates


## 2. Features

* **Public Features (Accessible to all visitors):**
    * **Property Listing Browsing:**
        * Search and filtering based on location, price, property type, number of bedrooms/bathrooms, etc.
        * Interactive map view of listings
        * High-quality property images and descriptions
        * Property details page with comprehensive information
        * Contact agent form
    * **Agent Directory:**
        * Searchable directory of real estate agents
        * Agent profiles with contact information and listings
    * **Informational Pages:**
        * "About Us," "Contact Us," "Terms of Service," "Privacy Policy" pages
* **User Features (Requires Authentication):**
    * **User Registration and Login:**
        * Secure account creation and login via Supabase Auth.
    * **Saved Listings:**
        * Ability to save favorite listings for later viewing.
    * **Profile Management:**
        * Update profile information (name, email, password).
* **Agent Features (Requires Agent Role):**
    * **Listing Management:**
        * Create, edit, and delete property listings.
        * Upload property images.
        * Mark listings as "active," "pending," or "sold."
    * **Lead Management:**
        * View and respond to inquiries from potential buyers/renters.
        * Track lead status.
* **Admin Features (Requires Admin Role):**
    * **User Management:**
        * Create, edit, and delete user accounts.
        * Assign roles (user, agent, admin).
    * **Listing Approval:**
        * Review and approve/reject new property listings.
    * **Content Management:**
        * Manage informational pages.


## 3. Requirements for Each Feature

### 3.1. Property Listing Browsing

* **Dependencies:**
    * `@supabase/supabase-js` (Supabase client)
    * `next/router` (for navigation)
    * `leaflet` (for map integration)
* **Variable Names:**
    * `listings: ListingDTO[]` (array of listing data transfer objects)
    * `searchParams: { location?: string; priceMin?: string; priceMax?: string; ... }` (URL search parameters)
* **API Calls (DAL Functions):**
    * `data/listings.ts`:
        * `getListings(filters: ListingFilters): Promise<ListingDTO[]>`
        * `getListingById(id: string): Promise<ListingDTO | null>`
* **Data Model (See Section 4):**  Use the `ListingDTO` interface/class.
* **Authorization:**
    * `getListings()`: Returns only "approved" listings to public users.
    * `getListingById()`: Returns the listing if it's approved or if the user is the agent who created it or an admin.
* **Implementation Notes:**
    * Implement efficient filtering logic in the `getListings()` DAL function, using Supabase's query capabilities.
    * Use server-side rendering (SSR) or static site generation (SSG) for optimal performance.


### 3.2. User Registration and Login

* **Dependencies:**
    * `@supabase/supabase-js` (Supabase client)
    * Supabase Auth UI Library (if using)
* **Variable Names:**
    * `email: string`
    * `password: string`
* **API Calls (Supabase Auth):**
    * `supabase.auth.signUp({ email, password, options: { redirectTo: '...' } })`
    * `supabase.auth.signInWithPassword({ email, password })`
* **Authorization:**  Supabase Auth handles user authentication.
* **Implementation Notes:**
    * Use Supabase's built-in authentication methods (email/password, social providers).
    * Implement secure password handling practices.
    * Redirect users to appropriate pages after login/registration.


### 3.3. Listing Management (Agent Feature)

* **Dependencies:**
    * `@supabase/supabase-js` (Supabase client)
    * `react-hook-form` (for form handling)
    * `zod` (for form validation)
* **Variable Names:**
    * `formData: FormData` (form data from the listing creation/edit form)
* **API Calls (DAL Functions + Server Actions):**
    * `actions/create-listing.ts` (Server Action):
        * `createListing(formData: FormData): Promise<void>`
    * `actions/update-listing.ts` (Server Action):
        * `updateListing(id: string, formData: FormData): Promise<void>`
    * `actions/delete-listing.ts` (Server Action):
        * `deleteListing(id: string): Promise<void>`
* **Data Model (See Section 4):** Use the `Listing` interface/class for form data.  The DAL converts this to a `ListingDTO` for reading.
* **Authorization:**
    * Server Actions:
        * Verify the user is an agent and owns the listing.
        * Validate the form data using Zod before inserting into the database.
* **Implementation Notes:**
    * Implement robust form validation to prevent invalid data from being submitted.
    * Use Server Actions for all database write operations.
    * Provide clear error messages to the user.
    * Consider using a rich text editor for listing descriptions.
    * Implement image upload functionality using Supabase Storage.


### 3.4 `getCurrentUser()` Function and `isAdmin` Check

* **Purpose:** To get the current logged-in user and check if the user has `Admin` role
* **Location:** `data/auth.ts`
* **Dependecies:**
    * `Supabase Client`
    * `next/cookies`
    * `react/cache`
* **Flow:**
    * The `getCurrentUser()` function is a cached function, meaning that it uses React's `cache` API. This prevents it from running on every request, and caches the logged-in user to the server
    * It uses `cookies` to get the `access_token` from the `httpOnly` cookies, sent back from Supabase
    * It uses the `access_token` to query Supabase's `/auth/user` API and returns the data
    * `isAdmin()` checks the roles of the user and returns `true` if Admin, `false` if not
* **Example Usage**

```ts
// data/auth.ts
import { cache } from 'react';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const getCurrentUser = cache(async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('supabase-auth-token');
  if (!token) return null;
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) {
      console.log('Error fetching user:', error);
      return null;
    }
    return user;
  } catch (error) {
    console.log('Error parsing token:', error);
    return null;
  }
});

export const isAdmin = async () => {
  const user = await getCurrentUser();
  if (user?.app_metadata?.roles?.includes('admin')) return true;
  return false;
};
```


## 4. Data Model

* **Database:** Supabase PostgreSQL
* **Tables:**
    * `users` (Supabase Auth manages this, but we extend it with a `profiles` table):
        * `id: UUID (Primary Key)`
        * `email: VARCHAR`
        * `created_at: TIMESTAMP`
    * `profiles`:
        * `id: UUID (Primary Key, Foreign Key to users.id)`
        * `full_name: VARCHAR`
        * `avatar_url: VARCHAR`
    * `listings`:
        * `id: UUID (Primary Key, auto-generated)`
        * `user_id: UUID (Foreign Key to users.id, Agent who created the listing)`
        * `title: VARCHAR`
        * `description: TEXT`
        * `address: VARCHAR`
        * `price: INTEGER`
        * `property_type: VARCHAR` (e.g., "House," "Apartment," "Condo")
        * `bedrooms: INTEGER`
        * `bathrooms: INTEGER`
        * `square_footage: INTEGER`
        * `image_urls: TEXT[]` (array of URLs to property images)
        * `approved: BOOLEAN` (Indicates if the listing has been approved by an admin)
        * `created_at: TIMESTAMP`
        * `updated_at: TIMESTAMP`
* **Data Transfer Objects (DTOs):**
    * `UserDTO`:

```typescript
interface UserDTO {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  // No sensitive fields like password hashes or tokens!
}
```

    * `ListingDTO`:

```typescript
interface ListingDTO {
  id: string;
  title: string;
  description: string;
  address: string;
  price: number;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  image_urls: string[];
  // Agent ID intentionally excluded.  Authorization happens in DAL.
}
```

* **ER Diagram:**  (Provide a visual ER diagram as a separate image or attachment)


## 5. API Endpoints

* **All API interaction should ideally be handled through DAL + Server Actions**
* If you still need explicit API endpoints define:
    * `/api/listings`:
        * `GET`: Retrieve a list of listings (with optional filters).
        * `POST`: Create a new listing (Agent role required, use Server Action).
    * `/api/listings/:id`:
        * `GET`: Retrieve a specific listing by ID.
        * `PUT`: Update a listing (Agent role required, use Server Action).
        * `DELETE`: Delete a listing (Agent role required, use Server Action).
    * `/api/users`:
        * `GET`: Retrieve a list of users (Admin role required).
        * `POST`: Create a new user (Admin role required).
    * `/api/users/:id`:
        * `GET`: Retrieve a specific user by ID (Admin role required).
        * `PUT`: Update a user (Admin role required).
        * `DELETE`: Delete a user (Admin role required).


## 6. Security Considerations

* **Authentication:** Use Supabase Auth for secure user authentication.
* **Authorization:** Implement role-based access control (RBAC) to restrict access to sensitive data and functionality.  Enforce this within the DAL.
* **Data Validation:** Validate all user input to prevent injection attacks and data corruption.  Use Zod for server-side validation in Server Actions.
* **Data Sanitization:** Sanitize user input to prevent XSS attacks.
* **Rate Limiting:** Implement rate limiting to prevent abuse of API endpoints.
* **Regular Security Audits:** Conduct regular security audits of the codebase.
* **Secrets Management:** Never commit secrets (API keys, database credentials) to the repository. Use environment variables.


## 7. Future Considerations

* **Integration with third-party services:**
    * Mapping services (Google Maps, Mapbox)
    * Payment gateways (Stripe, PayPal)
* **Advanced search features:**
    * Keyword search
    * Radius search
* **User reviews and ratings:**
    * Allow users to rate and review agents and properties.
* **AI-powered features:**
    * Automated property descriptions
    * Personalized recommendations

This PRD provides a comprehensive overview of the real estate listing website project. By following these guidelines, the engineering team can build a secure, scalable, and user-friendly platform that meets the needs of buyers, sellers, and agents. Remember to communicate clearly and ask questions if anything is unclear. The DAL approach is critical for the security and maintainability of this application.


