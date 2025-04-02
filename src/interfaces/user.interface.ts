import type { User } from "@prisma/client"
import type { PaginationInfo } from "./pagination.interface"

/**
 * Interface cho kết quả trả về của danh sách người dùng có phân trang
 */
export interface UserListResult {
  data: User[]
  total: number
  pagination: PaginationInfo
}

/**
 * Interface cho bộ lọc người dùng
 */
export interface UserFilterOptions {
  name?: string
  email?: string
  role?: string
  createdFrom?: Date
  createdTo?: Date
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

