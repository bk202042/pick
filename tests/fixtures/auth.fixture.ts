import { test as base } from '@playwright/test';
import { UserRole } from '../utils/roles';

// Extend basic test with authentication fixtures
export const test = base.extend({
  // Regular authenticated user
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL('**/dashboard');

    // The page is now authenticated
    await use(page);

    // Optional: Clean up (e.g., logout)
    await page.goto('/logout');
  },

  // Admin user
  adminPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Password').fill('adminPassword123');
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL('**/admin-dashboard');

    await use(page);

    // Clean up
    await page.goto('/logout');
  },

  // Generic role-based auth that accepts a role parameter
  pageWithRole: async ({ page }, use, testInfo) => {
    const role = testInfo.project.metadata.role as UserRole || UserRole.USER;

    // Credentials based on role
    const credentials = {
      [UserRole.USER]: { email: 'user@example.com', password: 'password123', redirect: '/dashboard' },
      [UserRole.ADMIN]: { email: 'admin@example.com', password: 'adminPassword123', redirect: '/admin-dashboard' },
      [UserRole.EDITOR]: { email: 'editor@example.com', password: 'editorPassword123', redirect: '/editor' },
    };

    const { email, password, redirect } = credentials[role];

    // Login with appropriate credentials
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForURL(`**${redirect}`);

    await use(page);

    // Clean up
    await page.goto('/logout');
  }
});
