/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActivityLog } from '@prisma/client';

import type { PaginationInfo } from './pagination.interface';

/**
 * Interface cho kết quả trả về của danh sách activity log có phân trang
 */
export interface ActivityLogListResult {
  data: ActivityLog[];
  total: number;
  pagination: PaginationInfo;
}

/**
 * Interface cho bộ lọc activity log
 */
export interface ActivityLogFilterOptions {
  entityType?: string;
  entityId?: number;
  action?: string;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Interface cho thông tin thay đổi trong activity log
 */
export interface LogChanges {
  before?: Record<string, any>;
  after?: Record<string, any>;
}
