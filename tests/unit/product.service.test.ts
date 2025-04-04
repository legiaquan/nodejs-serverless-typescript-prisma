import { afterEach, beforeEach, describe, it } from '@jest/globals';

import { mockDate, resetDate } from '../utils/date-mock';

describe('ProductService', () => {
  beforeEach(() => {
    // Mock date để tests có kết quả nhất quán
    mockDate(new Date('2023-01-01T00:00:00Z'));
  });

  afterEach(() => {
    // Reset date sau mỗi test
    resetDate();
  });

  it('should create product with correct UTC timestamp', async () => {
    // Test code...
  });
});
