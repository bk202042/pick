<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Supabase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Supabase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- supabase-ssr. A package to configure Supabase Auth to use cookies
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Supabase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-supabase.vercel.app](https://demo-nextjs-with-supabase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project which can be made [via the Supabase dashboard](https://database.new)

2. Create a Next.js app using the Supabase Starter template npx command

   ```bash
   npx create-next-app --example with-supabase with-supabase-app
   ```

   ```bash
   yarn create next-app --example with-supabase with-supabase-app
   ```

   ```bash
   pnpm create next-app --example with-supabase with-supabase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-supabase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)

# Playwright Test Suite

A comprehensive end-to-end testing framework for web applications built with Playwright.

## Features

- **End-to-End Testing**: Complete user journey testing from registration to checkout
- **Accessibility Testing**: Automated accessibility checks using axe-core
- **Visual Regression Testing**: Screenshot comparison across different viewports and devices
- **Performance Testing**: Measure and verify performance metrics for critical pages
- **Multi-Browser Testing**: Run tests across Chromium, Firefox, and WebKit engines
- **Mobile Emulation**: Test on emulated mobile devices
- **CI/CD Integration**: GitHub Actions workflows for continuous testing

## Project Structure

```
tests/
├── config/
│   └── playwright.config.ts        # Main configuration file
├── fixtures/
│   └── auth.fixture.ts             # Authentication fixtures
├── specs/
│   ├── auth/                       # Authentication tests
│   │   └── login.spec.ts
│   ├── core-flows/                 # End-to-end user journeys
│   │   └── user-journey.spec.ts
│   ├── visual/                     # Visual regression tests
│   │   └── responsive-design.spec.ts
│   ├── a11y/                       # Accessibility tests
│   │   └── accessibility.spec.ts
│   └── performance/                # Performance tests
│       └── load-performance.spec.ts
└── utils/                          # Test utilities
    ├── roles.ts
    └── test-data.ts
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

### Running Tests

Run all tests:

```bash
npm test
```

Run specific test groups:

```bash
# Run accessibility tests
npm run test:a11y

# Run end-to-end tests
npm run test:e2e

# Run visual regression tests
npm run test:visual

# Run performance tests
npm run test:perf
```

Run tests in UI mode:

```bash
npm run test:ui
```

Run tests in a specific browser:

```bash
npm run test:chrome
npm run test:firefox
npm run test:safari
```

Run tests on mobile viewports:

```bash
npm run test:mobile
```

### Updating Visual Snapshots

After making UI changes that affect the visual appearance:

```bash
npm run update:snapshots
```

## CI/CD Integration

The testing suite includes GitHub Actions workflows:

- Main test workflow runs on all pushes and PRs to main/develop branches
- Visual regression tests run on main branch and PRs targeting main
- Accessibility tests run on all branches
- Weekly scheduled regression tests

## Best Practices

This test suite follows these best practices:

1. **Role-based Locators**: Using semantic, accessibility-friendly locators
2. **Test Independence**: Each test is isolated and can run independently
3. **Realistic User Flows**: Tests simulate actual user behavior
4. **Performance Budgets**: Enforcing performance thresholds
5. **Screenshot Testing**: Visual regression with tolerance for minor differences
6. **Parallelization**: Tests can run in parallel for faster execution

## Contributing

1. Follow the existing test patterns and conventions
2. Add meaningful test descriptions
3. Use fixtures for common setup
4. Ensure tests are deterministic and not flaky

## License

MIT
