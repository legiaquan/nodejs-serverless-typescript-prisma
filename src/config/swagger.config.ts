import type { Application, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { version } from '../../package.json';

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Serverless API Documentation',
      version,
      description: 'API documentation for Node.js Serverless application',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      // Postman-specific metadata
      'x-postman-collection': {
        name: 'Node.js Serverless API',
        description: 'Complete API documentation for Node.js Serverless application',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'API Server',
      },
      // Add base URL for local development - helps with Postman testing
      {
        url: 'http://localhost:3000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      // Ensure consistent response schema definitions
      responses: {
        UnauthorizedError: {
          description: 'Authentication credentials were missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  message: { type: 'string', example: 'Unauthorized - invalid or missing token' },
                  statusCode: { type: 'number', example: 401 },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/dtos/**/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Setup Swagger documentation
 * @param app Express application
 */
export function setupSwagger(app: Application): void {
  // Swagger UI setup with improved options for better visualization
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true, // Enable API explorer
      customCss: '.swagger-ui .topbar { display: none }', // Remove Swagger UI top bar
      swaggerOptions: {
        persistAuthorization: true, // Remember authorization data
        docExpansion: 'list', // Show operations as collapsed by default
        filter: true, // Enable filtering
      },
    })
  );

  // Swagger JSON endpoint with CORS headers for Postman import
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.send(swaggerSpec);
  });

  // Add a specific Postman collection endpoint
  app.get('/postman-collection', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="api-collection.json"');
    res.send(swaggerSpec);
  });

  console.log(`Swagger documentation available at /api-docs`);
  console.log(`Postman collection available at /postman-collection`);
}
