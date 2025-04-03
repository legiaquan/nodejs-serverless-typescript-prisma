import type { Context, APIGatewayProxyEvent } from 'aws-lambda';
import type { Request } from 'express';
import serverless from 'serverless-http';

import { app } from './app';
import { logger } from './utils/logger';

// Tùy chỉnh serverless-http để truyền AWS request ID vào Express request
const serverlessOptions = {
  request: (request: Request, event: APIGatewayProxyEvent, context: Context) => {
    // Gắn AWS context vào request để middleware có thể truy cập
    if (!request.context) {
      request.context = {};
    }
    request.context.awsRequestId = context.awsRequestId;
    return request;
  },
};

// Log unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason, promise }, 'Unhandled Rejection at Promise');
});

// Khởi tạo serverless handler với custom options
export const handler = serverless(app, serverlessOptions);
