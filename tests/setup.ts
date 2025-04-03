import path from 'path';

import { afterAll, beforeAll } from '@jest/globals';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Global setup for tests
beforeAll(() => {
  // Any global setup needed before all tests
  console.log('Test environment setup complete');
  console.log(`Using database: ${process.env.DATABASE_URL}`);
});

// Global teardown for tests
afterAll(() => {
  // Any global cleanup needed after all tests
  console.log('Test environment teardown complete');
});
