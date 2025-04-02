import type { PaginationInfo, PaginationParams } from "../interfaces/pagination.interface"

/**
 * Tạo thông tin phân trang dựa trên trang hiện tại, giới hạn và tổng số mục
 * @param page Trang hiện tại (bắt đầu từ 1)
 * @param limit Số mục trên mỗi trang
 * @param totalItems Tổng số mục
 * @returns Thông tin phân trang
 */
export function createPaginationInfo(page: number, limit: number, totalItems: number): PaginationInfo {
  // Đảm bảo các giá trị hợp lệ
  const validPage = Math.max(1, page)
  const validLimit = Math.max(1, limit)

  // Tính toán thông tin phân trang
  const totalPages = Math.ceil(totalItems / validLimit)
  const hasNext = validPage < totalPages
  const hasPrevious = validPage > 1
  const nextPage = hasNext ? validPage + 1 : null
  const previousPage = hasPrevious ? validPage - 1 : null
  const startIndex = (validPage - 1) * validLimit
  const endIndex = Math.min(startIndex + validLimit - 1, totalItems - 1)
  const isFirstPage = validPage === 1
  const isLastPage = validPage >= totalPages

  return {
    page: validPage,
    limit: validLimit,
    totalItems,
    totalPages,
    hasNext,
    hasPrevious,
    nextPage,
    previousPage,
    startIndex,
    endIndex,
    isFirstPage,
    isLastPage,
  }
}

/**
 * Tạo thông tin phân trang từ một đối tượng có thuộc tính page và limit
 * @param filter Đối tượng có thuộc tính page và limit
 * @param totalItems Tổng số mục
 * @returns Thông tin phân trang
 */
export function createPaginationFromFilter(filter: PaginationParams, totalItems: number): PaginationInfo {
  const page = filter.page || 1
  const limit = filter.limit || 10
  return createPaginationInfo(page, limit, totalItems)
}

