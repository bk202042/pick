import { faker } from '@faker-js/faker';

// Create consistent but unique data for tests
export function generateTestData() {
  const userId = `user_${faker.string.alphanumeric(8)}`;

  return {
    user: {
      email: `${userId}@example.com`,
      password: `Pass_${faker.string.alphanumeric(8)}`,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    },
    product: {
      name: `Product ${faker.string.alphanumeric(5)}`,
      description: faker.commerce.productDescription(),
      price: faker.commerce.price(),
      category: faker.commerce.department(),
    },
    payment: {
      cardNumber: faker.finance.creditCardNumber(),
      expiryDate: `${faker.date.future().getMonth() + 1}/${faker.date.future().getFullYear().toString().slice(2)}`,
      cvv: faker.finance.creditCardCVV(),
    }
  };
}

// Create a user with a specific role
export function createTestUser(role: string) {
  const user = generateTestData().user;
  return {
    ...user,
    role,
  };
}

// Generate a unique order reference
export function generateOrderReference() {
  return `ORD-${Date.now()}-${faker.string.alphanumeric(6).toUpperCase()}`;
}
