import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { logger } from '../utils/logger';
import { ErrorResponse } from '../utils/error.response';

/**
 * Async handler to catch errors in async route handlers
 * This eliminates the need for try/catch blocks in controllers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handler for uncaught exceptions
 */
export const setupGlobalErrorHandlers = (app: any): void => {
  // Handle 404 errors for routes that don't exist
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const err = new ErrorResponse(`Route ${req.originalUrl} not found`, StatusCodes.NOT_FOUND);
    next(err);
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.fatal({ err: error, stack: error.stack }, 'UNCAUGHT EXCEPTION! 💥 Shutting down...');

    // In production, we might want to gracefully shut down
    // But for development, we'll just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
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
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const err = new ErrorResponse(`Route ${req.originalUrl} not found`, StatusCodes.NOT_FOUND);
  next(err);
};

/**
 * Middleware to convert all errors to ErrorResponse
 */
export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction): void => {
  let error = err;

  if (!(error instanceof ErrorResponse)) {
    const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Something went wrong';
    error = new ErrorResponse(message, statusCode);
  }

  next(error);
};
