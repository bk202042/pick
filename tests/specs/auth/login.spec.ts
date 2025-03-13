import { test, expect } from '@playwright/test';
import { generateTestData } from '../../utils/test-data';

test.describe('Authentication - Login', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Verify login form elements are present
    await expect(page.getByRole('heading', { name: 'Login to Your Account' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Fill and submit login form
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Verify successful login redirect and welcome message
    await page.waitForURL('**/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Log in' }).click();

    // Verify error message
    await expect(page.getByText('Invalid email or password')).toBeVisible();
    // Ensure we're still on the login page
    await expect(page.url()).toContain('/login');
  });

  test('should validate required fields', async ({ page }) => {
    // Submit empty form
    await page.getByRole('button', { name: 'Log in' }).click();

    // Verify validation messages
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should allow password visibility toggle', async ({ page }) => {
    // Check if password field is initially of type password
    await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password');

    // Click on show password icon/button
    await page.getByRole('button', { name: 'Show password' }).click();

    // Verify password is now visible
    await expect(page.getByLabel('Password')).toHaveAttribute('type', 'text');

    // Toggle back to hidden
    await page.getByRole('button', { name: 'Hide password' }).click();
    await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await page.waitForURL('**/forgot-password');
    await expect(page.getByRole('heading', { name: 'Reset Your Password' })).toBeVisible();
  });
});
