import type { Prisma, User, PrismaClient } from '@prisma/client';

import { BaseRepository } from './base.repository';
import prisma from '../lib/prisma';

export class UserRepository extends BaseRepository<
  User,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput
> {
  declare protected model: PrismaClient['user'];

  constructor() {
    super(prisma.user, 'User');
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findUnique({
      where: { email },
    });
  }

  /**
   * Find users by role
   */
  async findByRole(role: string): Promise<User[]> {
    return await this.model.findMany({
      where: { role },
    });
  }

  /**
   * Search users by name or email
   */
  async search(query: string): Promise<User[]> {
    return await this.model.findMany({
      where: {
        OR: [{ name: { contains: query } }, { email: { contains: query } }],
      },
    });
  }
}
