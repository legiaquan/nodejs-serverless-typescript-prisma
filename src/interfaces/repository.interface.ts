/**
 * Interface cơ bản cho repository
 */
export interface BaseRepositoryInterface<T, CreateInput, UpdateInput> {
  findAll(options?: any): Promise<T[]>
  findById(id: number, options?: any): Promise<T | null>
  findOne(where: any, options?: any): Promise<T | null>
  create(data: CreateInput): Promise<T>
  update(id: number, data: UpdateInput): Promise<T>
  delete(id: number): Promise<T>
  count(where?: any): Promise<number>
  exists(where: any): Promise<boolean>
  transaction<R>(fn: (tx: any) => Promise<R>): Promise<R>
}

