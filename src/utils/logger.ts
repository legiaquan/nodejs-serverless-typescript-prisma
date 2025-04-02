import pino from "pino"

// Xác định cấu hình Pino dựa trên môi trường
const pinoConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || "info",
  base: {
    service: "api-service",
    nodeVersion: process.version,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
  },
  transport:
    process.env.NODE_ENV !== "production"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
}

// Tạo logger instance với cấu hình tối ưu cho Node.js 22
export const logger = pino(pinoConfig)

// Thiết lập xử lý lỗi không bắt được
if (process.env.NODE_ENV === "production") {
  process.on("uncaughtException", (error: Error) => {
    logger.fatal({ err: error }, "Uncaught Exception! 💥 Shutting down...")
    process.exit(1)
  })

  process.on("unhandledRejection", (reason: Error) => {
    logger.fatal({ err: reason }, "Unhandled Rejection! 💥")
    process.exit(1)
  })
}

// Hàm trợ giúp để log các thông tin request
export const logRequest = (req: any, info?: Record<string, any>) => {
  logger.info(
    {
      method: req.method,
      url: req.url,
      path: req.path,
      params: req.params,
      query: req.query,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      ...info,
    },
    `Request: ${req.method} ${req.url}`,
  )
}

// Hàm trợ giúp để log các thông tin response
export const logResponse = (req: any, res: any, responseTime: number, info?: Record<string, any>) => {
  const logLevel = res.statusCode >= 400 ? "warn" : "info"

  logger[logLevel](
    {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get("content-length") || 0,
      contentType: res.get("content-type"),
      ...info,
    },
    `Response: ${res.statusCode} ${req.method} ${req.url} - ${responseTime}ms`,
  )
}

