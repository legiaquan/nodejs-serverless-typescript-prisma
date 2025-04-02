import { Router } from 'express';

import { Permission } from '../constants/permissions';
import { ActivityLogController } from '../controllers/activity-log.controller';
import { authenticate, requirePermission } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/global-error-handler';

const router = Router();
const activityLogController = new ActivityLogController();

/**
 * @swagger
 * tags:
 *   name: Activity Logs
 *   description: Activity log management
 */

/**
 * @swagger
 * /logs/recent:
 *   get:
 *     summary: Get recent activity logs
 *     description: Retrieve recent activity logs. Requires authentication and VIEW_USERS permission.
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 50
 *         description: Maximum number of logs to return
 *     responses:
 *       200:
 *         description: Recent activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Recent activity logs retrieved successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ActivityLog'
 *                     count:
 *                       type: integer
 *                       example: 50
 *                     limit:
 *                       type: integer
 *                       example: 50
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/recent',
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  asyncHandler(activityLogController.getRecentLogs)
);

/**
 * @swagger
 * /logs/user/{userId}:
 *   get:
 *     summary: Get user activity logs
 *     description: Retrieve activity logs for a specific user. Requires authentication and VIEW_USERS permission.
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activity logs
 *       400:
 *         description: Bad request - invalid user ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/user/:userId',
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  asyncHandler(activityLogController.getUserLogs)
);

/**
 * @swagger
 * /logs/entity/{entityType}/{entityId}:
 *   get:
 *     summary: Get entity activity logs
 *     description: Retrieve activity logs for a specific entity. Requires authentication and VIEW_USERS permission.
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entityType
 *         schema:
 *           type: string
 *         required: true
 *         description: Entity type (e.g., 'product', 'user')
 *       - in: path
 *         name: entityId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Entity ID
 *     responses:
 *       200:
 *         description: Entity activity logs
 *       400:
 *         description: Bad request - invalid entity type or ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/entity/:entityType/:entityId',
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  asyncHandler(activityLogController.getEntityLogs)
);

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get activity logs with filtering
 *     description: Retrieve activity logs with various filters. Requires authentication and VIEW_USERS permission.
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *         description: Filter by entity type
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: integer
 *         description: Filter by entity ID
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action type
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by end date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Filtered activity logs
 *       400:
 *         description: Bad request - invalid filter parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/',
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  asyncHandler(activityLogController.getLogs)
);

export default router;
