/**
 * Interface cho response thành công
 */
export interface SuccessResponseType {
  message: string;
  statusCode: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
}

/**
 * Interface cho response lỗi
 */
export interface ErrorResponseType {
  message: string;
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>;
}
