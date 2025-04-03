import type { PaginationParams } from './pagination.interface';

/**
 * Interface cơ bản cho service
 */
export interface BaseServiceInterface<T, CreateInput, UpdateInput> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll(params?: PaginationParams): Promise<{ data: T[]; total: number; pagination: any }>;
  getById(id: number): Promise<T | null>;
  create(data: CreateInput): Promise<T>;
  update(id: number, data: UpdateInput): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}
