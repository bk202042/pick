import { defineConfig } from '@playwright/test';

// Reference the actual config from the tests directory
export default defineConfig({
  // Import the test configuration from the tests directory
  extends: './tests/config/playwright.config.ts',

  // Add any root-level overrides here
  testDir: './tests/specs',

  // Ensure we don't interfere with the Next.js build
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
