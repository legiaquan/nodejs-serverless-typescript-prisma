import { Router } from 'express';

import { Permission } from '../constants/permissions';
import { UserController } from '../controllers/user.controller';
import { IdParamDTO } from '../dtos/params/id-param.dto';
import { RoleParamDTO } from '../dtos/params/role-param.dto';
import { SearchDTO } from '../dtos/query/search.dto';
import { CreateUserDTO } from '../dtos/user/create-user.dto';
import { UpdateUserDTO } from '../dtos/user/update-user.dto';
import { authenticate, requirePermission } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/global-error-handler';
import { validateBody, validateParams, validateQuery } from '../middleware/validation.middleware';

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users. Requires authentication and VIEW_USERS permission.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
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
 *                   example: Users retrieved successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     total:
 *                       type: number
 *                       example: 10
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationInfo'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/',
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  asyncHandler(userController.getAllUsers)
);

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search users
 *     description: Search users by name or email. Requires authentication and VIEW_USERS permission.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
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
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/search',
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  validateQuery(SearchDTO),
  asyncHandler(userController.searchUsers)
);

/**
 * @swagger
 * /users/role/{role}:
 *   get:
 *     summary: Get users by role
 *     description: Retrieve users with a specific role. Requires authentication and VIEW_USERS permission.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: role
 *         schema:
 *           type: string
 *         required: true
 *         description: User role
 *     responses:
 *       200:
 *         description: A list of users with the specified role
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get(
  '/role/:role',
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  validateParams(RoleParamDTO),
  asyncHandler(userController.getUsersByRole)
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user by their ID. Requires authentication and VIEW_USERS permission.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  authenticate,
  requirePermission(Permission.VIEW_USERS),
  validateParams(IdParamDTO),
  asyncHandler(userController.getUserById)
);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user. Requires authentication and CREATE_USER permission.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDTO'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  '/',
  authenticate,
  requirePermission(Permission.CREATE_USER),
  validateBody(CreateUserDTO),
  asyncHandler(userController.createUser)
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update an existing user. Requires authentication and UPDATE_USER permission.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDTO'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: User not found
 */
router.put(
  '/:id',
  authenticate,
  requirePermission(Permission.UPDATE_USER),
  validateParams(IdParamDTO),
  validateBody(UpdateUserDTO),
  asyncHandler(userController.updateUser)
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user. Requires authentication and DELETE_USER permission.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: User not found
 */
router.delete(
  '/:id',
  authenticate,
  requirePermission(Permission.DELETE_USER),
  validateParams(IdParamDTO),
  asyncHandler(userController.deleteUser)
);

export default router;
