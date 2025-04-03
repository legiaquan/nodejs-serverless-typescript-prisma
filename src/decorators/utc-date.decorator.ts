import { Transform } from 'class-transformer';

import { toUTC } from '../utils/date.util';

/**
 * Decorator to transform a date to UTC
 */
export function UTCDate() {
  return Transform(({ value }: { value: Date | string | number | null | undefined }) => {
    if (!value) return value;
    return toUTC(value);
  });
}
