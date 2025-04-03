/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ClassConstructor } from 'class-transformer';
import type { NextFunction, Request, Response } from 'express';

import { asyncHandler } from './global-error-handler';
import { BaseDTO } from '../dtos/base.dto';

// Extend Request type
declare module 'express' {
  interface Request {
    validatedQuery?: any;
    validatedParams?: any;
    validatedBody?: any;
    getQuery<T>(): T;
    getParams<T>(): T;
  }
}

/**
 * Middleware to validate request body against a DTO
 */
export const validateBody = <T extends object>(dto: ClassConstructor<T>) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body = await BaseDTO.validateAndTransform(dto, req.body as Record<string, unknown>);
    next();
  });
};

/**
 * Middleware to validate request query parameters against a DTO
 * This middleware doesn't modify req.query directly (which would cause an error)
 * Instead, it creates a property on the req object called _validatedQuery
 */
export const validateQuery = <T extends object>(dto: ClassConstructor<T>) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Create a validated object but don't assign to req.query
    const validatedData = await BaseDTO.validateAndTransform(dto, req.query);

    // Attach the validated data to the request object using a property
    // This is safer than trying to modify req.query directly
    Object.defineProperty(req, '_validatedQuery', {
      value: validatedData,
      writable: true,
      enumerable: false,
    });

    // Continue to next middleware
    next();
  });
};

/**
 * Middleware to validate request parameters against a DTO
 * Similar to validateQuery, this doesn't modify req.params directly
 */
export const validateParams = <T extends object>(dto: ClassConstructor<T>) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Create a validated object but don't assign to req.params
    const validatedData = await BaseDTO.validateAndTransform(dto, req.params);

    // Attach the validated data to the request object using a property
    Object.defineProperty(req, '_validatedParams', {
      value: validatedData,
      writable: true,
      enumerable: false,
    });

    // Continue to next middleware
    next();
  });
};
