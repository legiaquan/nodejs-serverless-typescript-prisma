import type { Request, Response } from 'express';

import { ActivityLogService } from '../services/activity-log.service';
import { BadRequestError } from '../utils/error.response';
import { OkResponse } from '../utils/success.response';

export class ActivityLogController {
  private activityLogService: ActivityLogService;

  constructor() {
    this.activityLogService = new ActivityLogService();
  }

  /**
   * Get recent activity logs
   */
  getRecentLogs = async (req: Request, res: Response) => {
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 50;

    if (isNaN(limit) || limit <= 0 || limit > 1000) {
      throw new BadRequestError('Invalid limit value. Must be between 1 and 1000.');
    }

    const logs = await this.activityLogService.getRecentLogs(limit);

    new OkResponse({
      message: 'Recent activity logs retrieved successfully',
      metadata: {
        data: logs,
        count: logs.length,
        limit,
      },
    }).send(res);
  };

  /**
   * Get activity logs for a specific user
   */
  getUserLogs = async (req: Request, res: Response) => {
    const userId = Number.parseInt(req.params.userId, 10);

    if (isNaN(userId) || userId <= 0) {
      throw new BadRequestError('Invalid user ID');
    }

    const logs = await this.activityLogService.getUserLogs(userId);

    new OkResponse({
      message: 'User activity logs retrieved successfully',
      metadata: {
        data: logs,
        count: logs.length,
        userId,
      },
    }).send(res);
  };

  /**
   * Get activity logs for a specific entity
   */
  getEntityLogs = async (req: Request, res: Response) => {
    const entityType = req.params.entityType;
    const entityId = Number.parseInt(req.params.entityId, 10);

    if (!entityType) {
      throw new BadRequestError('Entity type is required');
    }

    if (isNaN(entityId) || entityId <= 0) {
      throw new BadRequestError('Invalid entity ID');
    }

    const logs = await this.activityLogService.getEntityLogs(entityType, entityId);

    new OkResponse({
      message: `${entityType} activity logs retrieved successfully`,
      metadata: {
        data: logs,
        count: logs.length,
        entityType,
        entityId,
      },
    }).send(res);
  };

  /**
   * Get activity logs with filtering
   */
  getLogs = async (req: Request, res: Response) => {
    const { entityType, entityId, action, userId, startDate, endDate, page, limit } = req.query;

    // Parse and validate query parameters
    const options: any = {};

    if (entityType) {
      options.entityType = entityType as string;
    }

    if (entityId) {
      const parsedEntityId = Number.parseInt(entityId as string, 10);
      if (isNaN(parsedEntityId) || parsedEntityId <= 0) {
        throw new BadRequestError('Invalid entity ID');
      }
      options.entityId = parsedEntityId;
    }

    if (action) {
      options.action = action as string;
    }

    if (userId) {
      const parsedUserId = Number.parseInt(userId as string, 10);
      if (isNaN(parsedUserId) || parsedUserId <= 0) {
        throw new BadRequestError('Invalid user ID');
      }
      options.userId = parsedUserId;
    }

    if (startDate) {
      const parsedStartDate = new Date(startDate as string);
      if (isNaN(parsedStartDate.getTime())) {
        throw new BadRequestError('Invalid start date');
      }
      options.startDate = parsedStartDate;
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate as string);
      if (isNaN(parsedEndDate.getTime())) {
        throw new BadRequestError('Invalid end date');
      }
      options.endDate = parsedEndDate;
    }

    if (page) {
      const parsedPage = Number.parseInt(page as string, 10);
      if (isNaN(parsedPage) || parsedPage <= 0) {
        throw new BadRequestError('Invalid page number');
      }
      options.page = parsedPage;
    }

    if (limit) {
      const parsedLimit = Number.parseInt(limit as string, 10);
      if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 1000) {
        throw new BadRequestError('Invalid limit value. Must be between 1 and 1000.');
      }
      options.limit = parsedLimit;
    }

    const { logs, total } = await this.activityLogService.getLogs(options);

    new OkResponse({
      message: 'Activity logs retrieved successfully',
      metadata: {
        data: logs,
        count: logs.length,
        total,
        page: options.page || 1,
        limit: options.limit || 50,
        filters: {
          entityType: options.entityType,
          entityId: options.entityId,
          action: options.action,
          userId: options.userId,
          startDate: options.startDate,
          endDate: options.endDate,
        },
      },
    }).send(res);
  };
}
