import type { Product } from '@prisma/client';

/**
 * Interface cho thông tin phân trang
 */
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Interface cho kết quả trả về của danh sách sản phẩm có phân trang
 */
export interface ProductListResult {
  data: Product[];
  total: number;
  pagination: PaginationInfo;
}

/**
 * Interface cho bộ lọc sản phẩm nâng cao
 */
export interface ProductFilterOptions {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  minStock?: number;
  maxStock?: number;
  createdBy?: number;
  createdFrom?: Date;
  createdTo?: Date;
  updatedFrom?: Date;
  updatedTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
