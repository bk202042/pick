### **Next.js + Supabase Real Estate Platform Checklist**

**1. Project Foundation**
- [ ] **Environment Configuration**
  - [ ] Create `.env.local` with:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=
    SUPABASE_SERVICE_ROLE_KEY=  # Server-only
    NEXTAUTH_SECRET=
    ```
  - [ ] Add `.env.local` to `.gitignore`

- [ ] **Directory Structure**
  - [ ] Create standardized structure:
    ```
    src/
    ├── components/
    ├── app/
    ├── data/            # DAL modules
    │   ├── supabase/
    │   ├── dtos/
    │   └── auth.ts
    ├── types/
    ├── actions/
    ├── lib/
    └── styles/
    ```

**2. Data Layer (Supabase)**
- [ ] **Supabase Client**
  - [ ] Move client to `data/supabase/client.ts` with:
    ```typescript
    import { createClient } from '@supabase/supabase-js';
    import 'server-only';

    export const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    ```

- [ ] **Database Security**
  - [ ] Enable Row Level Security (RLS) on all tables
  - [ ] Create RLS policies for listings:
    ```sql
    -- users can only edit their own listings
    CREATE POLICY "User listing access"
    ON listings FOR ALL
    USING (user_id = auth.uid());
    ```

- [ ] **Data Access Modules**
  - [ ] Implement `data/listings.ts` with:
    - Type-safe filtering
    - DTO transformation
    - Authorization checks
  - [ ] Add input sanitization using `isomorphic-dompurify`

**3. Authentication & Authorization**
- [ ] **Auth Implementation**
  - [ ] Create `data/auth.ts` with:
    ```typescript
    export const getCurrentUser = cache(async () => {
      const accessToken = cookies().get('sb-access-token')?.value;
      if (!accessToken) return null;
      const { data } = await supabase.auth.getUser(accessToken);
      return data.user;
    });
    ```
  - [ ] Implement role-based checks (user/agent/admin)

- [ ] **Middleware**
  - [ ] Configure `middleware.ts` for route protection:
    ```typescript
    export async function middleware(request: NextRequest) {
      const user = await getCurrentUser();
      if (!user && request.nextUrl.pathname.startsWith('/agent')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    ```

**4. Server Actions**
- [ ] **Secure Actions**
  - [ ] Create `actions/listing.actions.ts` with:
    - Zod validation
    - Rate limiting (5 req/min)
    - Authorization checks
  - [ ] Example action:
    ```typescript
    export async function createListingAction(formData: FormData) {
      await limiter.check(5, 'CREATE_LISTING');
      const user = await getCurrentUser();
      if (!user) throw new Error('Unauthorized');
      // ...validation and creation
    }
    ```

**5. Components**
- [ ] **Listing Components**
  - [ ] Create `ListingCard` with:
    - Error boundaries
    - Loading states
    - Conditional edit/delete buttons
  - [ ] Integrate map view with `@react-google-maps/api`

- [ ] **Forms**
  - [ ] Use `react-hook-form` + Zod for validation
  - [ ] Implement file uploads to Supabase Storage

**6. Security**
- [ ] **Input Sanitization**
  - [ ] Sanitize all user inputs in DAL
  - [ ] Validate file uploads (size/type)

- [ ] **Rate Limiting**
  - [ ] Add `lib/rate-limit.ts` with:
    ```typescript
    import rateLimit from 'express-rate-limit';

    export const listingLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 5,
      message: 'Too many requests',
    });
    ```

**7. Testing**
- [ ] **Unit Tests**
  - [ ] Test DAL functions with mocked Supabase
  - [ ] Validate authorization checks

- [ ] **E2E Tests**
  - [ ] Create Cypress tests for:
    - User registration
    - Listing creation
    - Admin approval flow

**8. Deployment**
- [ ] **Production Prep**
  - [ ] Set `NEXTAUTH_SECRET` in production
  - [ ] Enable Vercel Edge Network for API routes
  - [ ] Configure daily backups

- [ ] **Monitoring**
  - [ ] Set up Sentry for error tracking
  - [ ] Enable Supabase Analytics

**9. Future Enhancements**
- [ ] **Search**
  - [ ] Add PostgreSQL `pg_trgm` for fuzzy search
- [ ] **Caching**
  - [ ] Implement Redis for frequent queries
- [ ] **Realtime**
  - [ ] Use Supabase Realtime for updates

---

This checklist integrates:
1. Modern Next.js 14 patterns (Server Actions, App Router)
2. Enhanced security (RLS, input sanitization, rate limiting)
3. Clear separation of concerns (DAL, DTOs, components)
4. Scalability considerations (caching, monitoring)
5. Future-ready architecture (realtime capabilities, search)



