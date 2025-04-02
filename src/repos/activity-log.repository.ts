import type { ActivityLog, Prisma } from '@prisma/client';

import prisma from '../lib/prisma';
import { BaseRepository } from './base.repository';

export class ActivityLogRepository extends BaseRepository<
  ActivityLog,
  Prisma.ActivityLogCreateInput,
  Prisma.ActivityLogUpdateInput
> {
  constructor() {
    super(prisma.activityLog, 'ActivityLog');
  }

  /**
   * Get activity logs for a specific entity
   */
  async getLogsForEntity(entityType: string, entityId: number): Promise<ActivityLog[]> {
    try {
      return await this.model.findMany({
        where: {
          entityType,
          entityId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get activity logs by user
   */
  async getLogsByUser(userId: number): Promise<ActivityLog[]> {
    try {
      return await this.model.findMany({
        where: {
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get activity logs by action type
   */
  async getLogsByAction(action: string): Promise<ActivityLog[]> {
    try {
      return await this.model.findMany({
        where: {
          action,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get recent activity logs
   */
  async getRecentLogs(limit = 50): Promise<ActivityLog[]> {
    try {
      return await this.model.findMany({
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
