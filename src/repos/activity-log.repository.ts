import type { ActivityLog, Prisma } from '@prisma/client';

import { BaseRepository } from './base.repository';
import prisma from '../lib/prisma';

export class ActivityLogRepository extends BaseRepository<
  ActivityLog,
  Prisma.ActivityLogCreateInput,
  Prisma.ActivityLogUpdateInput
> {
  constructor() {
    super(prisma.activityLog, 'ActivityLog');
  }

  /**
   * Create activity log with entityId support
   */
  async createLog(data: {
    entityType: string;
    entityId: number;
    action: string;
    userId: number;
    changes?: Prisma.JsonObject;
    metadata?: Prisma.JsonObject;
  }): Promise<ActivityLog> {
    const { entityType, entityId, action, userId, changes, metadata } = data;

    // Create input with correct Prisma structure
    const createData: Prisma.ActivityLogCreateInput = {
      entityType,
      action,
      user: {
        connect: { id: userId },
      },
      changes,
      metadata,
    };

    // Add the correct relation based on entity type
    if (entityType === 'product') {
      createData.product = {
        connect: { id: entityId },
      };
    } else if (entityType === 'user') {
      createData.userEntity = {
        connect: { id: entityId },
      };
    }

    return await this.model.create({ data: createData });
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
