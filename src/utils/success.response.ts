import type { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import type { SuccessResponseType } from '../interfaces/response.interface';

interface ResponseData {
  status: 'success';
  message: string;
  requestId?: string;
  metadata: Record<string, unknown>;
}

export class SuccessResponse {
  public message: string;
  public statusCode: number;
  public metadata: Record<string, unknown>;

  constructor({
    message = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
    metadata = {},
  }: Partial<SuccessResponseType> = {}) {
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res: Response): void {
    // Lấy request ID từ request object (nếu có)
    const requestId = (res.req as { requestId?: string })?.requestId;

    const responseData: ResponseData = {
      status: 'success',
      message: this.message,
      metadata: this.metadata,
    };

    if (requestId) {
      responseData.requestId = requestId;
    }

    res.status(this.statusCode).json(responseData);
  }
}

export class CreatedResponse extends SuccessResponse {
  constructor({
    message = ReasonPhrases.CREATED,
    statusCode = StatusCodes.CREATED,
    metadata = {},
  }: Partial<SuccessResponseType> = {}) {
    super({ message, statusCode, metadata });
  }
}

export class OkResponse extends SuccessResponse {
  constructor({
    message = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
    metadata = {},
  }: Partial<SuccessResponseType> = {}) {
    super({ message, statusCode, metadata });
  }
}
