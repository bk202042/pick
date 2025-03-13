import { test, expect } from '@playwright/test';

// Critical pages to test for performance
const criticalPages = [
  { path: '/', name: 'Home Page' },
  { path: '/products', name: 'Products Catalog' },
  { path: '/product/sample-product', name: 'Product Detail' },
];

// Performance thresholds in milliseconds
const performanceThresholds = {
  DOMContentLoaded: 800,  // Time until DOMContentLoaded event
  Load: 2000,            // Time until load event
  FirstPaint: 500,        // Time to first paint
  FirstContentfulPaint: 800, // Time to first contentful paint
  LargestContentfulPaint: 1500, // LCP threshold
  ResponseTime: 300,      // API response time threshold
};

test.describe('Performance Tests', () => {
  // Page load performance for critical pages
  test.describe('Page Load Performance', () => {
    for (const page of criticalPages) {
      test(`${page.name} should load within performance thresholds`, async ({ page: pageContext }) => {
        // Start tracing for detailed performance data
        await pageContext.context().tracing.start({ screenshots: true, snapshots: true });

        // Navigate to the page and capture performance metrics
        const navigationTimingJson = await pageContext.evaluate(() => {
          return new Promise(resolve => {
            window.addEventListener('load', () => {
              // Wait a bit to ensure all metrics are recorded
              setTimeout(() => {
                // Get standard navigation timing metrics
                const perfEntries = performance.getEntriesByType('navigation');
                const paintEntries = performance.getEntriesByType('paint');

                const navEntry = perfEntries[0];
                const metrics = {
                  // Navigation timings
                  navigationStart: 0,
                  domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.startTime,
                  load: navEntry.loadEventEnd - navEntry.startTime,

                  // Paint timings
                  firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime,
                  firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime,

                  // Resource timings - count and duration
                  resourceCount: performance.getEntriesByType('resource').length,
                  resourceDuration: performance.getEntriesByType('resource').reduce((sum, entry) => sum + entry.duration, 0),
                };

                resolve(metrics);
              }, 1000);
            });
          });
        }, { url: page.path });

        // Stop tracing and save
        await pageContext.context().tracing.stop({ path: `traces/${page.name.toLowerCase().replace(/ /g, '-')}-trace.zip` });

        // Output metrics to test report
        const metrics = JSON.parse(navigationTimingJson);
        test.info().attach('Performance Metrics', {
          body: JSON.stringify(metrics, null, 2),
          contentType: 'application/json'
        });

        // Assert on performance metrics
        expect(metrics.domContentLoaded).toBeLessThan(performanceThresholds.DOMContentLoaded);
        expect(metrics.load).toBeLessThan(performanceThresholds.Load);

        if (metrics.firstPaint) {
          expect(metrics.firstPaint).toBeLessThan(performanceThresholds.FirstPaint);
        }

        if (metrics.firstContentfulPaint) {
          expect(metrics.firstContentfulPaint).toBeLessThan(performanceThresholds.FirstContentfulPaint);
        }
      });
    }
  });

  // API response time tests
  test.describe('API Performance Tests', () => {
    test('API endpoints should respond within performance thresholds', async ({ page }) => {
      // Initialize array to collect API response times
      await page.evaluate(() => {
        window.__API_RESPONSE_TIMES = [];

        // Monitor all fetch and XHR requests
        const originalFetch = window.fetch;
        window.fetch = async function(input, init) {
          const startTime = performance.now();
          try {
            const response = await originalFetch(input, init);
            const endTime = performance.now();
            const url = typeof input === 'string' ? input : input.url;

            if (url.includes('/api/')) {
              window.__API_RESPONSE_TIMES.push({
                url,
                duration: endTime - startTime,
                status: response.status
              });
            }

            return response;
          } catch (error) {
            const endTime = performance.now();
            window.__API_RESPONSE_TIMES.push({
              url: typeof input === 'string' ? input : input.url,
              duration: endTime - startTime,
              error: error.message
            });
            throw error;
          }
        };

        // Also monitor XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
          this.__url = url;
          this.__startTime = performance.now();

          const originalOnLoad = this.onload;
          this.onload = function() {
            const endTime = performance.now();
            if (this.__url.includes('/api/')) {
              window.__API_RESPONSE_TIMES.push({
                url: this.__url,
                duration: endTime - this.__startTime,
                status: this.status
              });
            }

            if (originalOnLoad) {
              originalOnLoad.apply(this, arguments);
            }
          };

          return originalXHROpen.apply(this, arguments);
        };
      });

      // Navigate to products page which should trigger API calls
      await page.goto('/products');

      // Wait for product data to load
      await page.waitForSelector('[data-testid="product-card"]');

      // Retrieve API response times
      const apiResponseTimes = await page.evaluate(() => window.__API_RESPONSE_TIMES);

      test.info().attach('API Response Times', {
        body: JSON.stringify(apiResponseTimes, null, 2),
        contentType: 'application/json'
      });

      // Assert on API response times
      for (const apiCall of apiResponseTimes) {
        expect(apiCall.duration).toBeLessThan(
          performanceThresholds.ResponseTime,
          `API call to ${apiCall.url} took too long: ${apiCall.duration}ms`
        );
      }
    });
  });

  // Interactive performance tests
  test.describe('Interactive Performance Tests', () => {
    test('Product filter interactions should be responsive', async ({ page }) => {
      await page.goto('/products');

      // Measure time to apply filters
      const startTime = Date.now();

      // Apply a filter
      await page.getByLabel('Category').selectOption('electronics');
      await page.getByRole('button', { name: 'Apply Filters' }).click();

      // Wait for filtered results to load
      await page.waitForResponse(response =>
        response.url().includes('/api/products') &&
        response.status() === 200
      );

      const filterApplyTime = Date.now() - startTime;

      test.info().attach('Filter Apply Time', {
        body: JSON.stringify({ filterApplyTime }, null, 2),
        contentType: 'application/json'
      });

      // Assert that filtering is fast
      expect(filterApplyTime).toBeLessThan(1000);

      // Measure product card rendering speed
      await page.evaluate(() => {
        window.__PRODUCT_CARDS_RENDER_TIME = 0;

        // Track rendering of product cards
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.element && entry.element.closest('[data-testid="product-card"]')) {
              window.__PRODUCT_CARDS_RENDER_TIME = entry.startTime + entry.duration;
            }
          }
        });

        observer.observe({ type: 'element', buffered: true });
      });

      // Add another filter to trigger re-rendering
      await page.getByLabel('Price Range').selectOption('100-200');
      await page.getByRole('button', { name: 'Apply Filters' }).click();

      // Wait for new results
      await page.waitForResponse(response =>
        response.url().includes('/api/products') &&
        response.status() === 200
      );

      const renderTime = await page.evaluate(() => window.__PRODUCT_CARDS_RENDER_TIME);

      test.info().attach('Product Cards Render Time', {
        body: JSON.stringify({ renderTime }, null, 2),
        contentType: 'application/json'
      });

      // If render time was captured, assert on it
      if (renderTime) {
        expect(renderTime).toBeLessThan(500);
      }
    });

    test('Cart operations should be performant', async ({ page }) => {
      // Navigate to a product
      await page.goto('/product/sample-product');

      // Measure add to cart performance
      const addToCartStart = Date.now();
      await page.getByRole('button', { name: 'Add to Cart' }).click();

      // Wait for confirmation
      await page.waitForSelector('[data-testid="cart-notification"]');
      const addToCartTime = Date.now() - addToCartStart;

      // Go to cart
      await page.getByText('View Cart').click();
      await page.waitForURL('**/cart');

      // Measure cart update performance
      const updateQuantityStart = Date.now();
      await page.getByLabel('Quantity').clear();
      await page.getByLabel('Quantity').fill('3');
      await page.getByRole('button', { name: 'Update' }).click();

      // Wait for cart to update
      await page.waitForResponse(response =>
        response.url().includes('/api/cart') &&
        response.status() === 200
      );
      const updateQuantityTime = Date.now() - updateQuantityStart;

      // Attach performance data
      test.info().attach('Cart Operation Times', {
        body: JSON.stringify({
          addToCartTime,
          updateQuantityTime
        }, null, 2),
        contentType: 'application/json'
      });

      // Assert on performance
      expect(addToCartTime).toBeLessThan(500);
      expect(updateQuantityTime).toBeLessThan(800);
    });
  });
});
