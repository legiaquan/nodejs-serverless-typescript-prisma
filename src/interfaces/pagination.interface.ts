/**
 * Interface định nghĩa thông tin phân trang
 */
export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  nextPage: number | null;
  previousPage: number | null;
  startIndex: number;
  endIndex: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

/**
 * Interface cho các tham số phân trang
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}
