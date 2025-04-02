import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

import { TooManyRequestsError } from '../utils/error.response';
import { logger } from '../utils/logger';

/**
 * Default rate limiter for general API endpoints
 * Limits to 600 requests per 5 minutes
 */
export const defaultRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 600, // 600 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again after 5 minutes',
  handler: (req: Request, res: Response) => {
    logger.warn({ ip: req.ip }, 'Rate limit exceeded');
    throw new TooManyRequestsError('Too many requests, please try again after 5 minutes');
  },
  keyGenerator: (req: Request) => {
    // Use IP address as the key
    return req.ip;
  },
  skip: (req: Request) => {
    // Skip rate limiting for health check endpoint
    return req.path === '/health';
  },
});

/**
 * Strict rate limiter for authentication endpoints
 * Limits to 10 requests per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again after 15 minutes',
  handler: (req: Request, res: Response) => {
    logger.warn(
      { ip: req.ip, email: req.body.email || 'unknown' },
      'Authentication rate limit exceeded'
    );
    throw new TooManyRequestsError(
      'Too many authentication attempts, please try again after 15 minutes'
    );
  },
  keyGenerator: (req: Request) => {
    // Use IP address as the key
    // For more security, you could combine IP with username/email
    const email = req.body.email || 'unknown';
    return `${req.ip}-${email}`;
  },
});
