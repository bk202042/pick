import { test, expect } from '@playwright/test';
import { generateTestData, generateOrderReference } from '../../utils/test-data';

// This test simulates a complete user journey from registration to checkout
test.describe('End-to-end user journey', () => {
  const testData = generateTestData();

  test('new user should be able to register, browse products, and complete checkout', async ({ page }) => {
    // 1. User Registration
    await test.step('Register new user', async () => {
      await page.goto('/register');

      // Fill registration form
      await page.getByLabel('First Name').fill(testData.user.firstName);
      await page.getByLabel('Last Name').fill(testData.user.lastName);
      await page.getByLabel('Email').fill(testData.user.email);
      await page.getByLabel('Password').fill(testData.user.password);
      await page.getByLabel('Confirm Password').fill(testData.user.password);
      await page.getByRole('checkbox', { name: 'I agree to the terms and conditions' }).check();

      // Submit form
      await page.getByRole('button', { name: 'Create Account' }).click();

      // Verify successful registration
      await page.waitForURL('**/welcome');
      await expect(page.getByRole('heading', { name: 'Welcome to our store!' })).toBeVisible();
    });

    // 2. Browse Products
    await test.step('Browse product catalog', async () => {
      // Navigate to products page
      await page.getByRole('link', { name: 'Shop Now' }).click();
      await page.waitForURL('**/products');

      // Verify products are loaded
      await expect(page.getByTestId('product-list')).toBeVisible();
      await expect(page.getByTestId('product-card')).toHaveCount({ min: 1 });

      // Use product filtering
      await page.getByLabel('Category').selectOption(testData.product.category);
      await page.getByRole('button', { name: 'Apply Filters' }).click();

      // Wait for filtered results
      await page.waitForResponse(response =>
        response.url().includes('/api/products') &&
        response.status() === 200
      );

      // Select a product
      await page.getByTestId('product-card').first().click();
      await page.waitForURL('**/products/**');
    });

    // 3. Add to Cart
    await test.step('Add product to cart', async () => {
      // Verify we're on product detail page
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // Select product options if available
      const hasOptions = await page.getByLabel('Size').isVisible();
      if (hasOptions) {
        await page.getByLabel('Size').selectOption('Medium');
        await page.getByLabel('Color').selectOption('Blue');
      }

      // Update quantity
      await page.getByLabel('Quantity').clear();
      await page.getByLabel('Quantity').fill('2');

      // Add to cart
      await page.getByRole('button', { name: 'Add to Cart' }).click();

      // Verify cart notification/modal
      await expect(page.getByText('Item added to your cart')).toBeVisible();

      // Go to cart
      await page.getByRole('link', { name: 'View Cart' }).click();
      await page.waitForURL('**/cart');

      // Verify item is in cart
      await expect(page.getByTestId('cart-items')).toBeVisible();
      await expect(page.getByTestId('cart-item')).toHaveCount(1);
      await expect(page.getByTestId('item-quantity')).toContainText('2');
    });

    // 4. Checkout
    await test.step('Complete checkout process', async () => {
      // Proceed to checkout
      await page.getByRole('button', { name: 'Checkout' }).click();
      await page.waitForURL('**/checkout');

      // Fill shipping info
      await page.getByLabel('Address Line 1').fill('123 Test Street');
      await page.getByLabel('City').fill('Test City');
      await page.getByLabel('State/Province').fill('Test State');
      await page.getByLabel('Zip/Postal Code').fill('12345');
      await page.getByLabel('Country').selectOption('United States');
      await page.getByLabel('Phone').fill('555-123-4567');

      // Continue to payment
      await page.getByRole('button', { name: 'Continue to Payment' }).click();

      // Fill payment details
      await page.waitForSelector('[data-testid="payment-form"]');

      // Use credit card iframe if present (common for payment forms)
      const hasCardIframe = await page.frameLocator('iframe[name="card-frame"]').isVisible();

      if (hasCardIframe) {
        const cardFrame = page.frameLocator('iframe[name="card-frame"]');
        await cardFrame.locator('[placeholder="Card number"]').fill(testData.payment.cardNumber);
        await cardFrame.locator('[placeholder="MM / YY"]').fill(testData.payment.expiryDate);
        await cardFrame.locator('[placeholder="CVC"]').fill(testData.payment.cvv);
      } else {
        // Direct form input
        await page.getByLabel('Card Number').fill(testData.payment.cardNumber);
        await page.getByLabel('Expiry Date').fill(testData.payment.expiryDate);
        await page.getByLabel('CVC').fill(testData.payment.cvv);
      }

      await page.getByLabel('Name on Card').fill(`${testData.user.firstName} ${testData.user.lastName}`);

      // Complete order
      await page.getByRole('button', { name: 'Place Order' }).click();

      // Verify order confirmation
      await page.waitForURL('**/order-confirmation');
      await expect(page.getByRole('heading', { name: 'Thank You for Your Order!' })).toBeVisible();
      await expect(page.getByText('Order Number:')).toBeVisible();

      // Verify order is in the account history
      await page.getByRole('link', { name: 'My Account' }).click();
      await page.getByRole('link', { name: 'Order History' }).click();
      await expect(page.getByTestId('order-item')).toHaveCount({ min: 1 });
    });
  });
});
