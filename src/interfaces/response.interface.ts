/**
 * Interface cho response thành công
 */
export interface SuccessResponseType {
  message: string
  statusCode: number
  metadata: Record<string, any>
}

/**
 * Interface cho response lỗi
 */
export interface ErrorResponseType {
  message: string
  status: number
  details?: Record<string, any>
}

