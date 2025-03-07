**Real Estate Listing Website Development Checklist**

**Project Setup and Core Infrastructure**

* [X] **Set up `.env` file:** Copy `.env.example` to `.env.local` and fill in the required Supabase and other environment variables (Supabase URL, Anon Key/Service Role Key, etc.).
* [ ] **Install dependencies:** Run `npm install` or `yarn install` to install project dependencies.
* [ ] **Initialize Supabase project:** Create a Supabase project and configure the database schema (see Data Model in PRD).
* [ ] **Configure middleware.ts:** Review and configure the `middleware.ts` file for authentication and authorization (if applicable).  This may be related to protecting certain routes.
* [ ] **Set up Tailwind CSS:** Ensure Tailwind CSS is properly configured and working (check `tailwind.config.ts` and `postcss.config.js`).
* [ ] **Setup Typescript:** Ensure Typescript is set up.

**Data Access Layer (DAL) Implementation**

* [ ] **Create `data` directory:** Create a `data` directory at the root of the project.
* [ ] **Move Supabase client:** Move the existing Supabase client initialization code from `utils/supabase/client.ts` to `data/supabase-client.ts`.
* [ ] **Add `server-only`:** Add `import 'server-only';` to `data/supabase-client.ts`.
* [ ] **Implement `getCurrentUser()`:** Create `data/auth.ts` and implement the `getCurrentUser()` function using `cookies()` and Supabase Auth.
* [ ] **Implement `isAdmin()`:** Create `data/auth.ts` and implement the `isAdmin()` function, check if user roles has Admin role.
* [ ] **Create Listing DAL Module:** Create `data/listings.ts` and implement CRUD operations for listings (getListings, getListingById, createListing, updateListing, deleteListing).  Remember authorization checks and DTOs.
* [ ] **Create User DAL Module:** Create `data/users.ts` and implement CRUD operations for users (getUserById, createUser, updateUser, deleteUser).  Remember authorization checks and DTOs (Admin only for most operations).
* [ ] **Implement DTOs:** Create DTO interfaces/classes for `User`, and `Listing` in `data/auth.ts`, `data/listings.ts`, and `data/user.ts`
* [ ] **Enforce `server-only`:** Add `import 'server-only';` to all files in the `data` directory.

**Server Actions Implementation**

* [ ] **Create `actions` directory:** Create an `actions` directory at the root of the project, if it doesn't exist.
* [ ] **Implement Listing Server Actions:** Create Server Actions in `actions/` for creating, updating, and deleting listings (create-listing.ts, update-listing.ts, delete-listing.ts).
* [ ] **Implement User Server Actions:** Create Server Actions in `actions/` for creating, updating, and deleting users (create-user.ts, update-user.ts, delete-user.ts).  These should *only* be accessible to admins.
* [ ] **Implement form validation:** Integrate Zod into Server Actions for robust form validation.
* [ ] **Authorization Checks:** Every Server Action validates authentication with `getCurrentUser()`.
* [ ] **Authorization Checks:** Every Server Action validates if the user is authorized to execute the code.

**Component Development**

* [ ] **Implement Public Components:**
    * [ ] Property Listing Browsing:
        * [ ] Implement search and filtering.
        * [ ] Integrate map view (using Leaflet or similar).
        * [ ] Display property images and descriptions.
        * [ ] Implement contact agent form.
    * [ ] Agent Directory:
        * [ ] Display a searchable directory of agents.
        * [ ] Show agent profiles with contact information.
    * [ ] Implement informational pages ("About Us", "Contact Us", etc.).
* [ ] **Implement User Components (Authentication Required):**
    * [ ] User Registration and Login:
        * [ ] Use Supabase Auth for account creation and login (reuse existing components in `app/(auth-pages)/`).
    * [ ] Saved Listings:
        * [ ] Implement functionality to save favorite listings.
    * [ ] Profile Management:
        * [ ] Allow users to update their profile information.
* [ ] **Implement Agent Components (Agent Role Required):**
    * [ ] Listing Management:
        * [ ] Implement a form for creating new listings (use `react-hook-form` and `zod`).
        * [ ] Implement a form for editing existing listings.
        * [ ] Implement functionality to upload property images (Supabase Storage).
    * [ ] Lead Management:
        * [ ] Display a list of leads for each listing.
        * [ ] Allow agents to respond to inquiries.
* [ ] **Implement Admin Components (Admin Role Required):**
    * [ ] User Management:
        * [ ] Display a list of users.
        * [ ] Implement forms for creating, editing, and deleting user accounts.
        * [ ] Allow assigning roles (user, agent, admin).
    * [ ] Listing Approval:
        * [ ] Display a list of pending listings.
        * [ ] Allow admins to approve or reject listings.
    * [ ] Content Management:
        * [ ] Implement a way to manage informational pages.

**Authentication and Authorization**

* [ ] **Integrate Supabase Auth:** Utilize Supabase Auth for user authentication (sign-up, sign-in, password reset).
* [ ] **Implement Role-Based Access Control (RBAC):** Enforce RBAC to restrict access to features based on user roles (user, agent, admin).  This is primarily done in the DAL.
* [ ] **Protect Routes:** Use middleware or route handlers to protect routes that require authentication or specific roles.

**API Endpoints**

* [ ] **Remove or refactor existing API endpoints:** Refactor the `app/actions.ts` file and remove or refactor existing API endpoints to rely on the DAL and Server Actions.

**Testing**

* [ ] **Unit Tests:** Write unit tests for DAL functions to ensure they are working correctly and enforcing security policies.
* [ ] **End-to-End (E2E) Tests:** Implement E2E tests to verify the functionality of the application as a whole.

**Deployment**

* [ ] **Deploy to Vercel:** Deploy the application to Vercel (or another hosting provider).
* [ ] **Configure Environment Variables:** Configure environment variables in the deployment environment.

**Security Considerations**

* [ ] **Data Validation:** Implement robust data validation in Server Actions using Zod.
* [ ] **Data Sanitization:** Sanitize user input to prevent XSS attacks.
* [ ] **Rate Limiting:** Implement rate limiting to prevent abuse of API endpoints.
* [ ] **Secrets Management:** Ensure secrets are stored securely and not exposed in the codebase.
* [ ] **Regular Security Audits:** Plan for regular security audits of the codebase.

This checklist provides a structured approach to building your real estate listing website.  Remember to prioritize tasks and break them down into smaller, manageable chunks. Good luck!

