/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityLog:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Log ID
 *           example: 1
 *         entityType:
 *           type: string
 *           description: Type of entity being logged
 *           example: product
 *         entityId:
 *           type: integer
 *           description: ID of the entity being logged
 *           example: 5
 *         action:
 *           type: string
 *           description: Action performed
 *           example: create
 *         userId:
 *           type: integer
 *           description: ID of the user who performed the action
 *           example: 2
 *         changes:
 *           type: object
 *           description: Changes made (before/after)
 *         metadata:
 *           type: object
 *           description: Additional metadata
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the log was created
 *         user:
 *           $ref: '#/components/schemas/User'
 */

// This file is only for Swagger documentation purposes
// No actual code is needed here

