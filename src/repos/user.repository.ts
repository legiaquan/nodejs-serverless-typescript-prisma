import type { Prisma, User } from '@prisma/client';

import prisma from '../lib/prisma';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  constructor() {
    super(prisma.user, 'User');
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.model.findUnique({
        where: { email },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    try {
      return await this.model.findMany({
        where: { role },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Search users by name or email
   */
  async search(query: string): Promise<User[]> {
    try {
      return await this.model.findMany({
        where: {
          OR: [{ name: { contains: query } }, { email: { contains: query } }],
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
