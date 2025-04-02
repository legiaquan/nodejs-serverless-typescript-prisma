import 'reflect-metadata'; // Required for class-validator and class-transformer

import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';

import { setupSwagger } from './config/swagger.config';
import { testConnection } from './lib/prisma';
import { errorHandler } from './middleware/error-handler';
import {
  errorConverter,
  notFoundHandler,
  setupGlobalErrorHandlers,
} from './middleware/global-error-handler';
import { defaultRateLimiter } from './middleware/rate-limit.middleware';
import { requestIdMiddleware } from './middleware/request-id.middleware';
import { requestLogger } from './middleware/request-logger';
import { router } from './routes';
import { OkResponse } from './utils/success.response';

// Initialize express app
const app = express();

// Apply middleware with improved security settings for Node.js 22
app.use(
  helmet({
    // Enhanced security headers for Node.js 22
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
      },
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-site' },
    originAgentCluster: true,
  })
);

// CORS with improved settings for Node.js 22
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86_400, // 24 hours
  })
);

// Improved JSON parsing with higher limits for Node.js 22
app.use(
  express.json({
    limit: '1mb',
    strict: true,
  })
);

// Improved URL-encoded parsing for Node.js 22
app.use(
  express.urlencoded({
    extended: true,
    limit: '1mb',
  })
);

// Add request ID middleware before other middleware
app.use(requestIdMiddleware);

// Request logging middleware
app.use(requestLogger);

// Apply default rate limiter to all routes
app.use(defaultRateLimiter);

// Health check endpoint with improved diagnostics
app.get('/health', async (req: Request, res: Response) => {
  const startTime = performance.now(); // Using Node.js 22's performance API
  const databaseStatus = await testConnection();
  const responseTime = performance.now() - startTime;

  new OkResponse({
    message: 'Service is healthy',
    metadata: {
      timestamp: new Date().toISOString(),
      database: databaseStatus ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      responseTime: `${responseTime.toFixed(2)}ms`,
      requestId: req.requestId,
    },
  }).send(res);
});

// API routes
app.use('/api', router);

// Setup Swagger documentation (only in development)
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// Handle 404 routes
app.use(notFoundHandler);

// Convert errors to standard format
app.use(errorConverter);

// Error handling middleware
app.use(errorHandler);

// Setup global error handlers for uncaught exceptions
setupGlobalErrorHandlers(app);

export { app };
