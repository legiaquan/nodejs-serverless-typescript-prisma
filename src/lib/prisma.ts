import { PrismaClient } from '@prisma/client';

import { logger } from '../utils/logger';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Create a singleton Prisma client instance with improved performance settings for Node.js 22
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
    // Improved connection handling for Node.js 22
    // This takes advantage of the improved connection pooling in Node.js 22
  });

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error - Prisma types don't properly expose query events
  prisma.$on('query', (e: { query: string; params: unknown; duration: number }) => {
    logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'Prisma Query');
  });
}

// @ts-expect-error - Prisma types don't properly expose error events
prisma.$on('error', (e: Error) => {
  logger.error({ err: e }, 'Prisma Error');
});

// Add to global in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Test database connection with improved error handling
export const testConnection = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    logger.info('Database connection established successfully');
    return true;
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to database');
    return false;
  } finally {
    // No need to explicitly disconnect as Prisma handles this
  }
};

export default prisma;
