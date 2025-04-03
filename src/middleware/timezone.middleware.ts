import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware để xử lý timezone từ client
 */
export const timezoneMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Lấy timezone từ header, query param, hoặc sử dụng default
  const timezone = req.headers['x-timezone'] || req.query.timezone || 'UTC';

  // Validate timezone
  try {
    // Kiểm tra xem timezone có hợp lệ không
    Intl.DateTimeFormat('en-US', { timeZone: timezone as string });

    // Gắn timezone vào request object
    req.timezone = timezone as string;
  } catch {
    // Nếu timezone không hợp lệ, sử dụng UTC
    req.timezone = 'UTC';
  }

  next();
};
