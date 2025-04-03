import type { NextFunction, Request, Response } from 'express';
import type { Application } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ErrorResponse } from '../utils/error.response';
import { logger } from '../utils/logger';

// Custom error type that may include statusCode
interface HttpError extends Error {
  statusCode?: number;
}

/**
 * Async handler to catch errors in async route handlers
 * This eliminates the need for try/catch blocks in controllers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler for uncaught exceptions
 */
export const setupGlobalErrorHandlers = (app: Application): void => {
  // Handle 404 routes - uses a string pattern that will be processed by path-to-regexp internally
  // The middleware runs after all routes are registered, so it only catches unmatched routes
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Skip if this is a Swagger/API docs route
    if (req.path.includes('/api-docs') || req.path.includes('/postman-collection')) {
      return next();
    }

    const err = new ErrorResponse(`Route ${req.originalUrl} not found`, StatusCodes.NOT_FOUND);
    next(err);
  });

  // Global handlers for uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.fatal({ err: error }, 'Uncaught Exception');
    process.exit(1);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: Error) => {
    logger.fatal({ err: reason, stack: reason.stack }, 'UNHANDLED REJECTION! 💥');

    // In production, we might want to gracefully shut down
    // But for development, we'll just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

  // Handle SIGTERM
  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    process.exit(0);
  });
};

/**
 * Middleware to handle not found routes
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorResponse(`Route ${req.originalUrl} not found`, StatusCodes.NOT_FOUND);
  next(err);
};

/**
 * Middleware to convert all errors to ErrorResponse
 */
export const errorConverter = (
  err: Error | ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  if (!(error instanceof ErrorResponse)) {
    const httpError = error as HttpError;
    const statusCode = httpError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Something went wrong';
    error = new ErrorResponse(message, statusCode);
  }

  next(error);
};
