import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import type { SuccessResponseType } from '../interfaces/response.interface';

export class SuccessResponse {
  public message: string;
  public statusCode: number;
  public metadata: Record<string, any>;

  constructor({
    message = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
    metadata = {},
  }: Partial<SuccessResponseType> = {}) {
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res: any): void {
    // Lấy request ID từ request object (nếu có)
    const requestId = res.req?.requestId;

    res.status(this.statusCode).json({
      status: 'success',
      message: this.message,
      requestId: requestId,
      metadata: this.metadata,
    });
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
