import type { NextFunction, Request, Response } from "express"

import { logRequest, logResponse } from "../utils/logger"

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now()

  // Sử dụng request ID đã được gắn bởi requestIdMiddleware
  const requestId = req.requestId || "unknown"

  // Log request với structured logging
  logRequest(req, { requestId })

  // Log response when finished with improved timing
  res.on("finish", () => {
    const duration = Date.now() - start
    logResponse(req, res, duration, { requestId })
  })

  next()
}

