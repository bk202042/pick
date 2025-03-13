import { test, expect, devices } from '@playwright/test';

// Critical pages to test for responsive design
const criticalPages = [
  { path: '/', name: 'Home Page' },
  { path: '/products', name: 'Products Page' },
  { path: '/product/sample-product', name: 'Product Detail Page' },
  { path: '/cart', name: 'Shopping Cart' },
  { path: '/checkout', name: 'Checkout Page' },
];

// Device configurations to test
const deviceConfigurations = [
  { name: 'Mobile', viewport: { width: 375, height: 667 } },
  { name: 'Tablet', viewport: { width: 768, height: 1024 } },
  { name: 'Desktop', viewport: { width: 1280, height: 800 } },
  { name: 'Large Desktop', viewport: { width: 1920, height: 1080 } },
];

// Specific device emulation
const specificDevices = [
  { name: 'iPhone 13', config: devices['iPhone 13'] },
  { name: 'Pixel 5', config: devices['Pixel 5'] },
  { name: 'iPad Pro', config: devices['iPad Pro 11'] },
];

test.describe('Responsive Design Tests', () => {
  // Test across standard viewport sizes
  test.describe('Viewport-based testing', () => {
    for (const device of deviceConfigurations) {
      test.describe(`${device.name} viewport tests`, () => {
        test.use({ viewport: device.viewport });

        for (const page of criticalPages) {
          test(`${page.name} should render correctly on ${device.name}`, async ({ page: pageContext }) => {
            // Navigate to the page
            await pageContext.goto(page.path);

            // Allow time for any animations or lazy-loaded content
            await pageContext.waitForLoadState('networkidle');

            // Take screenshot for visual comparison
            await expect(pageContext).toHaveScreenshot(`${page.name.toLowerCase().replace(/ /g, '-')}-${device.name.toLowerCase()}.png`);

            // For mobile viewport, check if mobile menu is available and functional
            if (device.name === 'Mobile') {
              // Check if mobile menu button exists
              const mobileMenuButton = pageContext.getByRole('button', { name: /menu/i });
              if (await mobileMenuButton.isVisible()) {
                await mobileMenuButton.click();
                // Verify mobile menu appears
                await expect(pageContext.getByTestId('mobile-menu')).toBeVisible();
                // Take screenshot of open menu
                await expect(pageContext).toHaveScreenshot(`${page.name.toLowerCase().replace(/ /g, '-')}-${device.name.toLowerCase()}-menu-open.png`);
              }
            }
          });
        }
      });
    }
  });

  // Test with specific device emulation
  test.describe('Device emulation testing', () => {
    for (const device of specificDevices) {
      test.describe(`${device.name} emulation tests`, () => {
        test.use({ ...device.config });

        for (const page of criticalPages) {
          test(`${page.name} should render correctly on ${device.name}`, async ({ page: pageContext }) => {
            // Navigate to the page
            await pageContext.goto(page.path);

            // Wait for the page to be fully loaded
            await pageContext.waitForLoadState('networkidle');

            // Take screenshot for visual comparison
            await expect(pageContext).toHaveScreenshot(`${page.name.toLowerCase().replace(/ /g, '-')}-${device.name.toLowerCase().replace(/ /g, '-')}.png`);

            // Check for specific device features (orientation, etc.)
            if (device.name.includes('iPhone') || device.name.includes('Pixel')) {
              // Test landscape orientation
              await pageContext.evaluate(() => {
                Object.defineProperty(window, 'orientation', { value: 90 });
                window.dispatchEvent(new Event('orientationchange'));
              });

              // Allow time for orientation change to apply
              await pageContext.waitForTimeout(500);

              // Take landscape screenshot
              await expect(pageContext).toHaveScreenshot(`${page.name.toLowerCase().replace(/ /g, '-')}-${device.name.toLowerCase().replace(/ /g, '-')}-landscape.png`);
            }
          });
        }
      });
    }
  });

  // Critical UI component tests across viewports
  test.describe('Component responsive tests', () => {
    for (const device of deviceConfigurations) {
      test(`Navigation component should adapt to ${device.name} viewport`, async ({ page }) => {
        // Set viewport size
        await page.setViewportSize(device.viewport);

        // Go to home page
        await page.goto('/');

        // Check navigation rendering
        if (device.viewport.width < 768) {
          // On mobile, navigation should be hidden behind a hamburger menu
          await expect(page.getByTestId('desktop-nav')).not.toBeVisible();
          await expect(page.getByTestId('mobile-nav-toggle')).toBeVisible();
        } else {
          // On desktop, navigation should be visible
          await expect(page.getByTestId('desktop-nav')).toBeVisible();
          await expect(page.getByTestId('mobile-nav-toggle')).not.toBeVisible();
        }
      });
    }
  });
});
