import type { ActivityLog, Prisma } from "@prisma/client"
import { ActivityLogRepository } from "../repos/activity-log.repository"
import { logger } from "../utils/logger"
import type { LogChanges, ActivityLogFilterOptions, ActivityLogListResult } from "../interfaces/activity-log.interface"
import { createPaginationFromFilter } from "../utils/pagination.utils"
import { toUTC } from "../utils/date.utils"

/**
 * Enum for entity types that can be logged
 * This can be extended as new entity types are added
 */
export enum EntityType {
  PRODUCT = "product",
  USER = "user",
  ORDER = "order",
  CATEGORY = "category",
  PAYMENT = "payment",
  // Add more entity types as needed
}

/**
 * Enum for action types that can be logged
 */
export enum ActionType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  VIEW = "view",
  LOGIN = "login",
  LOGOUT = "logout",
  EXPORT = "export",
  IMPORT = "import",
  // Add more action types as needed
}

export class ActivityLogService {
  private activityLogRepository: ActivityLogRepository

  constructor() {
    this.activityLogRepository = new ActivityLogRepository()
  }

  /**
   * Log an activity
   */
  async logActivity(
    entityType: string,
    entityId: number,
    action: string,
    userId: number,
    changes?: LogChanges,
    metadata?: Record<string, any>,
  ): Promise<ActivityLog> {
    try {
      // Add timestamp to metadata in UTC
      const enhancedMetadata = {
        ...metadata,
        timestamp: toUTC(new Date()).toISOString(),
      }

      return await this.activityLogRepository.create({
        entityType,
        entityId,
        action,
        userId,
        changes: changes ? (changes as Prisma.JsonObject) : undefined,
        metadata: enhancedMetadata ? (enhancedMetadata as Prisma.JsonObject) : undefined,
      })
    } catch (error) {
      logger.error(
        {
          err: error,
          entityType,
          entityId,
          action,
          userId,
        },
        "Error logging activity",
      )
      // Don't throw the error - we don't want to fail the main operation if logging fails
      // Instead, return a dummy object
      return {
        id: -1,
        entityType,
        entityId,
        action,
        userId,
        changes: changes as Prisma.JsonObject,
        metadata: metadata as Prisma.JsonObject,
        createdAt: new Date(),
      } as ActivityLog
    }
  }

  /**
   * Get activity logs for a specific entity
   */
  async getEntityLogs(entityType: string, entityId: number): Promise<ActivityLog[]> {
    try {
      return await this.activityLogRepository.getLogsForEntity(entityType, entityId)
    } catch (error) {
      logger.error({ err: error, entityType, entityId }, "Error getting entity logs")
      throw error
    }
  }

  /**
   * Get activity logs by user
   */
  async getUserLogs(userId: number): Promise<ActivityLog[]> {
    try {
      return await this.activityLogRepository.getLogsByUser(userId)
    } catch (error) {
      logger.error({ err: error, userId }, "Error getting user logs")
      throw error
    }
  }

  /**
   * Get activity logs by action type
   */
  async getLogsByAction(action: string): Promise<ActivityLog[]> {
    try {
      return await this.activityLogRepository.getLogsByAction(action)
    } catch (error) {
      logger.error({ err: error, action }, "Error getting logs by action")
      throw error
    }
  }

  /**
   * Get recent activity logs
   */
  async getRecentLogs(limit = 50): Promise<ActivityLog[]> {
    try {
      return await this.activityLogRepository.getRecentLogs(limit)
    } catch (error) {
      logger.error({ err: error, limit }, "Error getting recent logs")
      throw error
    }
  }

  /**
   * Get activity logs with filtering and pagination
   */
  async getLogs(options: ActivityLogFilterOptions & { page?: number; limit?: number }): Promise<ActivityLogListResult> {
    try {
      const { entityType, entityId, action, userId, startDate, endDate, page = 1, limit = 50 } = options

      // Build where clause
      const where: Prisma.ActivityLogWhereInput = {}

      if (entityType) {
        where.entityType = entityType
      }

      if (entityId) {
        where.entityId = entityId
      }

      if (action) {
        where.action = action
      }

      if (userId) {
        where.userId = userId
      }

      if (startDate || endDate) {
        where.createdAt = {}

        if (startDate) {
          where.createdAt.gte = startDate
        }

        if (endDate) {
          where.createdAt.lte = endDate
        }
      }

      // Get total count
      const total = await this.activityLogRepository.count(where)

      // Get logs with pagination
      const data = await this.activityLogRepository.findAll({
        where,
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
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      })

      // Generate pagination info
      const pagination = createPaginationFromFilter({ page, limit }, total)

      return { data, total, pagination }
    } catch (error) {
      logger.error({ err: error, options }, "Error getting logs with filtering")
      throw error
    }
  }
}

