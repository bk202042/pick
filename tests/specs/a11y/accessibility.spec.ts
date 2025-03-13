import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Critical pages to test for accessibility
const criticalPages = [
  { path: '/', name: 'Home Page' },
  { path: '/products', name: 'Products Page' },
  { path: '/login', name: 'Login Page' },
  { path: '/register', name: 'Registration Page' },
  { path: '/cart', name: 'Shopping Cart' },
  { path: '/checkout', name: 'Checkout Page' },
];

test.describe('Accessibility Tests', () => {
  // Test each critical page
  for (const page of criticalPages) {
    test(`${page.name} should not have any automatically detectable accessibility issues`, async ({ page: pageContext }) => {
      // Navigate to the page
      await pageContext.goto(page.path);

      // Wait for the page to be fully loaded
      await pageContext.waitForLoadState('networkidle');

      // Run accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page: pageContext })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Format the violations for easier debugging
      const formattedViolations = accessibilityScanResults.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(node => ({
          html: node.html,
          failureSummary: node.failureSummary,
        })),
      }));

      // Attach violations to test results for debugging
      if (formattedViolations.length > 0) {
        test.info().attach('accessibility-violations', {
          body: JSON.stringify(formattedViolations, null, 2),
          contentType: 'application/json'
        });
      }

      // Assert no violations
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  // Test specific UI components for accessibility
  test('Form inputs should have proper labels and ARIA attributes', async ({ page }) => {
    // Go to a page with forms
    await page.goto('/login');

    // Check if inputs have proper labels
    const inputs = await page.locator('input:not([type="hidden"])').all();

    for (const input of inputs) {
      // Each input should either have a label or aria-label
      const inputId = await input.getAttribute('id');
      const hasLabel = inputId ? await page.locator(`label[for="${inputId}"]`).count() > 0 : false;
      const hasAriaLabel = await input.getAttribute('aria-label') !== null;
      const hasAriaLabelledBy = await input.getAttribute('aria-labelledby') !== null;

      expect(hasLabel || hasAriaLabel || hasAriaLabelledBy).toBeTruthy();
    }
  });

  test('Interactive elements should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab through the page and ensure focus indicators are visible
    await page.keyboard.press('Tab');

    // Get the focused element
    const focusedElement = await page.evaluate(() => {
      const activeElement = document.activeElement;
      return {
        tagName: activeElement?.tagName,
        hasVisibleFocusStyles: window.getComputedStyle(activeElement).outlineStyle !== 'none' ||
                              window.getComputedStyle(activeElement).boxShadow !== 'none'
      };
    });

    // Ensure focus styles are visible
    expect(focusedElement.hasVisibleFocusStyles).toBeTruthy();

    // Check if we can tab to main navigation items
    let navigationItemFound = false;
    for (let i = 0; i < 10; i++) { // Try up to 10 tabs
      await page.keyboard.press('Tab');
      const isNavItem = await page.evaluate(() => {
        const activeElement = document.activeElement;
        return activeElement?.closest('nav') !== null;
      });

      if (isNavItem) {
        navigationItemFound = true;
        break;
      }
    }

    expect(navigationItemFound).toBeTruthy();
  });

  test('Images should have alt text', async ({ page }) => {
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]');

    // Check all images for alt text
    const images = await page.locator('img').all();

    for (const image of images) {
      const alt = await image.getAttribute('alt');
      const role = await image.getAttribute('role');

      // Image should either have alt text or role="presentation"
      expect(alt !== null || role === 'presentation').toBeTruthy();

      // If it has alt text and isn't decorative, it shouldn't be empty
      if (alt !== null && role !== 'presentation') {
        expect(alt.trim()).not.toBe('');
      }
    }
  });

  test('Color contrast should meet WCAG standards', async ({ page }) => {
    await page.goto('/');

    // Run axe test specifically for color contrast
    const contrastResults = await new AxeBuilder({ page })
      .withTags(['color-contrast'])
      .analyze();

    // Format any contrast issues
    const contrastIssues = contrastResults.violations
      .filter(v => v.id === 'color-contrast')
      .map(violation => ({
        description: violation.description,
        elements: violation.nodes.map(node => node.html),
      }));

    if (contrastIssues.length > 0) {
      test.info().attach('contrast-issues', {
        body: JSON.stringify(contrastIssues, null, 2),
        contentType: 'application/json'
      });
    }

    expect(contrastIssues).toEqual([]);
  });
});
