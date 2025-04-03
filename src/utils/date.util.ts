import { parseISO, format } from 'date-fns';

type DateInput = Date | number | string;

/**
 * Convert a date to UTC, removing any timezone offset
 */
export function toUTC(input: DateInput): Date {
  const date = input instanceof Date ? input : new Date(input);
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    )
  );
}

/**
 * Convert a UTC date to a specific timezone
 */
export function fromUTC(input: DateInput, timezone = 'UTC'): Date {
  const date = input instanceof Date ? input : new Date(input);
  return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
}

/**
 * Format a date to ISO string without timezone information
 */
export function formatDateWithoutTimezone(input: DateInput): string {
  const date = input instanceof Date ? input : new Date(input);
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * Get start of day in UTC for a given date
 */
export function startOfDayUTC(input: DateInput): Date {
  const date = input instanceof Date ? input : new Date(input);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0));
}

/**
 * Get end of day in UTC for a given date
 */
export function endOfDayUTC(input: DateInput): Date {
  const date = input instanceof Date ? input : new Date(input);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999));
}

/**
 * Get start of month in UTC for a given date
 */
export function startOfMonthUTC(input: DateInput): Date {
  const date = input instanceof Date ? input : new Date(input);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0));
}

/**
 * Get end of month in UTC for a given date
 */
export function endOfMonthUTC(input: DateInput): Date {
  const date = input instanceof Date ? input : new Date(input);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999));
}

/**
 * Format a date in a specific timezone
 */
export function formatInTimezone(input: DateInput, formatStr: string, timezone = 'UTC'): string {
  const date = input instanceof Date ? input : new Date(input);
  const zonedDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  return format(zonedDate, formatStr);
}

/**
 * Parse an ISO date string to Date object
 */
export function parseISODate(dateString: string): Date {
  return parseISO(dateString);
}
