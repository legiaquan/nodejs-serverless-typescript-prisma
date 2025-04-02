import type { Request, Response } from "express"
import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { version } from "../../package.json"

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node.js Serverless API Documentation",
      version,
      description: "API documentation for Node.js Serverless application",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "/api",
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/dtos/**/*.ts", "./src/controllers/*.ts"],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)

/**
 * Setup Swagger documentation
 * @param app Express application
 */
export function setupSwagger(app: any): void {
  // Swagger UI setup
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Swagger JSON endpoint
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json")
    res.send(swaggerSpec)
  })

  console.log(`Swagger documentation available at /api-docs`)
}

