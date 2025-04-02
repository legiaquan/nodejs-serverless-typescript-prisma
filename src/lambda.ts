import serverless from 'serverless-http';

import { app } from './app';
import { logger } from './utils/logger';

// Log unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ err: reason, promise }, 'Unhandled Rejection');
});

// Tùy chỉnh serverless-http để truyền AWS request ID vào Express request
const serverlessOptions = {
  request: (request: any, event: any, context: any) => {
    // Gắn AWS context vào request để middleware có thể truy cập
    request.context = context;
    return request;
  },
};

// Wrap express app with serverless
export const handler = serverless(app, serverlessOptions);
