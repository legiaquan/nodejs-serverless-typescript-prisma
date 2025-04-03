import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { User } from '@prisma/client';

import prisma from '../../src/lib/prisma';
import { UserService } from '../../src/services/user.service';
import { mockDate, resetDate } from '../utils/date-mock';

// Mock the Prisma client
jest.mock('../../src/lib/prisma', () => ({
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
    mockDate();
  });

  afterEach(() => {
    resetDate();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: 'User 1',
          email: 'user1@example.com',
          password: 'password1',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: 'User 2',
          email: 'user2@example.com',
          password: 'password2',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const mockFindMany = jest.spyOn(prisma.user, 'findMany');
      mockFindMany.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(mockFindMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const mockUser: User = {
        id: 1,
        name: 'User 1',
        email: 'user1@example.com',
        password: 'password1',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockFindUnique = jest.spyOn(prisma.user, 'findUnique');
      mockFindUnique.mockResolvedValue(mockUser);

      const result = await userService.getUserById(1);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const mockFindUnique = jest.spyOn(prisma.user, 'findUnique');
      mockFindUnique.mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });
});
