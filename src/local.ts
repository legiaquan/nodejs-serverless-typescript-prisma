import dotenv from "dotenv"

import { app } from "./app"
import { testConnection } from "./lib/prisma"
import { logger } from "./utils/logger"

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3000

// Start the server with improved error handling for Node.js 22
const startServer = async () => {
  try {
    // Test database connection
    await testConnection()

    // Create server with improved keep-alive settings for Node.js 22
    const server = app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`)
      logger.info(`Environment: ${process.env.NODE_ENV}`)
      logger.info(`Node.js version: ${process.version}`)
    })

    // Improved error handling for Node.js 22
    server.on("error", (error: Error) => {
      logger.fatal({ err: error }, "Server error")
      process.exit(1)
    })

    // Graceful shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received, shutting down gracefully")
      server.close(() => {
        logger.info("Server closed")
        process.exit(0)
      })
    })
  } catch (error) {
    logger.fatal({ err: error }, "Failed to start server")
    process.exit(1)
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
startServer()

