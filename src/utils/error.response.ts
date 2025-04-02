import { ReasonPhrases, StatusCodes } from "http-status-codes"

export class ErrorResponse extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    Object.setPrototypeOf(this, new.target.prototype) // Đảm bảo instanceof hoạt động chính xác
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.CONFLICT, statusCode: number = StatusCodes.CONFLICT) {
    super(message, statusCode)
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.BAD_REQUEST, statusCode: number = StatusCodes.BAD_REQUEST) {
    super(message, statusCode)
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.UNAUTHORIZED, statusCode: number = StatusCodes.UNAUTHORIZED) {
    super(message, statusCode)
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.NOT_FOUND, statusCode: number = StatusCodes.NOT_FOUND) {
    super(message, statusCode)
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.FORBIDDEN, statusCode: number = StatusCodes.FORBIDDEN) {
    super(message, statusCode)
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode)
  }
}

export class TooManyRequestsError extends ErrorResponse {
  constructor(message: string = ReasonPhrases.TOO_MANY_REQUESTS, statusCode: number = StatusCodes.TOO_MANY_REQUESTS) {
    super(message, statusCode)
  }
}

