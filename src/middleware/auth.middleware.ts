import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { asyncHandler } from './global-error-handler';
import { hasPermission, Permission } from '../constants/permissions';
import { AuthFailureError, ForbiddenError } from '../utils/error.response';
import { logger } from '../utils/logger';

// Extend Express Request interface using module augmentation
import 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }
}

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw new AuthFailureError('Access token is required');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

    // Attach user to request object
    req.user = decoded;
    next();
  } catch (error) {
    logger.error({ err: error }, 'JWT verification failed');
    throw new AuthFailureError('Invalid or expired token');
  }
};

/**
 * Middleware to check if user has required permission
 * @param requiredPermission Permission required to access the resource
 */
export const requirePermission = (requiredPermission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthFailureError('User not authenticated');
    }

    const { role } = req.user;

    if (!hasPermission(role, requiredPermission)) {
      logger.warn(
        {
          user: req.user.email,
          role,
          requiredPermission,
        },
        'Permission denied'
      );
      throw new ForbiddenError(`You don't have permission to perform this action`);
    }

    next();
  };
};

/**
 * Middleware to check if user has required permission AND is the owner of the resource
 * @param requiredPermission Permission required to access the resource
 * @param getResourceOwnerId Function to get the owner ID of the resource
 */
export const requirePermissionAndOwnership = (
  requiredPermission: Permission,
  getResourceOwnerId: (req: Request) => Promise<number | null>
) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AuthFailureError('User not authenticated');
    }

    const { role, id: userId } = req.user;

    // Admin with MANAGE_ALL permission can bypass ownership check
    if (role === 'admin' && hasPermission(role, Permission.MANAGE_ALL)) {
      return next();
    }

    // Check if user has the required permission
    if (!hasPermission(role, requiredPermission)) {
      logger.warn(
        {
          user: req.user.email,
          role,
          requiredPermission,
        },
        'Permission denied'
      );
      throw new ForbiddenError(`You don't have permission to perform this action`);
    }

    // Get the owner ID of the resource
    const ownerId = await getResourceOwnerId(req);

    // If no owner ID found, resource doesn't exist
    if (ownerId === null) {
      return next(); // Let the controller handle the 404 error
    }

    // Check if the user is the owner
    if (userId !== ownerId) {
      logger.warn(
        {
          userId,
          ownerId,
          resource: req.originalUrl,
        },
        'Ownership check failed'
      );
      throw new ForbiddenError('You can only modify resources that you own');
    }

    next();
  });
};
