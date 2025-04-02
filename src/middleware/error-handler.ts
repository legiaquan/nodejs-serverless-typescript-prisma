import type { NextFunction, Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { logger } from '../utils/logger';
import { ErrorResponse } from '../utils/error.response';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message: string = ReasonPhrases.INTERNAL_SERVER_ERROR;
  let stack: string | undefined;
  let errorDetails: Record<string, any> = {};

  // Handle custom ErrorResponse instances
  if (err instanceof ErrorResponse) {
    statusCode = err.status;
    message = err.message;
  }
  // Handle Prisma errors
  else if (err instanceof PrismaClientKnownRequestError) {
    statusCode = StatusCodes.BAD_REQUEST;

    // Handle specific Prisma error codes
    switch (err.code) {
      case 'P2002': // Unique constraint violation
        message = 'Duplicate entry for unique field';
        errorDetails = {
          fields: (err.meta?.target as string[]) || [],
          code: err.code,
        };
        break;
      case 'P2025': // Record not found
        statusCode = StatusCodes.NOT_FOUND;
        message = 'Record not found';
        errorDetails = { code: err.code };
        break;
      default:
        message = `Database error: ${err.message}`;
        errorDetails = { code: err.code };
    }
  }
  // Handle validation errors (e.g., from express-validator)
  else if (err.name === 'ValidationError' || err.name === 'ValidatorError') {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation error';
    errorDetails = { details: err.message };
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = 'Authentication error';
    errorDetails = { details: err.message };
  }
  // Handle other errors
  else {
    message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV !== 'production') {
    stack = err.stack;
  }

  // Log the error
  logger.error(
    {
      url: req.url,
      method: req.method,
      statusCode,
      message,
      stack,
      requestId: req.requestId,
      ...errorDetails,
    },
    `Error: ${statusCode} - ${message}`
  );

  // Send response
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    requestId: req.requestId,
    ...(process.env.NODE_ENV !== 'production' && stack ? { stack } : {}),
    ...(Object.keys(errorDetails).length > 0 ? { details: errorDetails } : {}),
  });
};
