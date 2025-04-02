import type { NextFunction, Request, Response } from "express"
import crypto from "node:crypto"

// Định nghĩa interface để mở rộng Request
declare global {
  namespace Express {
    interface Request {
      requestId?: string
    }
  }
}

/**
 * Middleware để tạo và gắn request ID vào mỗi request
 * Sử dụng AWS request ID nếu có, nếu không thì tạo UUID mới
 */
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Kiểm tra xem có AWS request ID không (khi chạy trong môi trường serverless)
  // Lưu ý: context.awsRequestId được truyền qua từ serverless-http
  const awsRequestId = (req as any).context?.awsRequestId

  // Sử dụng AWS request ID nếu có, nếu không thì tạo UUID mới
  const requestId = awsRequestId || crypto.randomUUID()

  // Gắn request ID vào request object để sử dụng trong các middleware và controller
  req.requestId = requestId

  // Thêm request ID vào response headers
  res.setHeader("X-Request-ID", requestId)

  next()
}

