import { toUTC } from './date.utils';

/**
 * Truncate date đến đơn vị cụ thể (tương tự PostgreSQL date_trunc)
 * @param unit Đơn vị truncate ('year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second')
 * @param date Date cần truncate
 * @returns Date đã được truncate
 */
export function dateTrunc(
  unit: 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second',
  date: Date
): Date {
  // Đảm bảo date là UTC
  const utcDate = toUTC(date);

  switch (unit) {
    case 'year':
      return new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1, 0, 0, 0, 0));

    case 'quarter':
      const quarter = Math.floor(utcDate.getUTCMonth() / 3);
      return new Date(Date.UTC(utcDate.getUTCFullYear(), quarter * 3, 1, 0, 0, 0, 0));

    case 'month':
      return new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), 1, 0, 0, 0, 0));

    case 'week':
      // Lấy ngày đầu tiên của tuần (Chủ nhật = 0)
      const dayOfWeek = utcDate.getUTCDay();
      const diff = utcDate.getUTCDate() - dayOfWeek;
      return new Date(Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), diff, 0, 0, 0, 0));

    case 'day':
      return new Date(
        Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(), 0, 0, 0, 0)
      );

    case 'hour':
      return new Date(
        Date.UTC(
          utcDate.getUTCFullYear(),
          utcDate.getUTCMonth(),
          utcDate.getUTCDate(),
          utcDate.getUTCHours(),
          0,
          0,
          0
        )
      );

    case 'minute':
      return new Date(
        Date.UTC(
          utcDate.getUTCFullYear(),
          utcDate.getUTCMonth(),
          utcDate.getUTCDate(),
          utcDate.getUTCHours(),
          utcDate.getUTCMinutes(),
          0,
          0
        )
      );

    case 'second':
      return new Date(
        Date.UTC(
          utcDate.getUTCFullYear(),
          utcDate.getUTCMonth(),
          utcDate.getUTCDate(),
          utcDate.getUTCHours(),
          utcDate.getUTCMinutes(),
          utcDate.getUTCSeconds(),
          0
        )
      );

    default:
      return utcDate;
  }
}
