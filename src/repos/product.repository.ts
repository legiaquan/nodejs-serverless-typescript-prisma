import { Prisma, type Product } from '@prisma/client';

import { BaseRepository } from './base.repository';
import {
  type ProductFilterDTO,
  ProductSortField,
  SortOrder,
} from '../dtos/query/product-filter.dto';
import prisma from '../lib/prisma';
import { toUTC } from '../utils/date.util';
import { logger } from '../utils/logger';

export class ProductRepository extends BaseRepository<
  Product,
  Prisma.ProductCreateInput,
  Prisma.ProductUpdateInput
> {
  constructor() {
    super(prisma.product, 'Product');
  }

  /**
   * Find products with advanced filtering and pagination
   */
  async findWithFilters(filter: ProductFilterDTO): Promise<{ data: Product[]; total: number }> {
    try {
      // Build where clause based on filters
      const where: Prisma.ProductWhereInput = {};

      // Date filters - đảm bảo sử dụng UTC dates
      if (filter.createdFrom || filter.createdTo) {
        where.createdAt = {};
        if (filter.createdFrom) {
          // Đảm bảo date là UTC
          where.createdAt.gte = toUTC(filter.createdFrom);
        }
        if (filter.createdTo) {
          // Đảm bảo date là UTC
          where.createdAt.lte = toUTC(filter.createdTo);
        }
      }

      if (filter.updatedFrom || filter.updatedTo) {
        where.updatedAt = {};
        if (filter.updatedFrom) {
          // Đảm bảo date là UTC
          where.updatedAt.gte = toUTC(filter.updatedFrom);
        }
        if (filter.updatedTo) {
          // Đảm bảo date là UTC
          where.updatedAt.lte = toUTC(filter.updatedTo);
        }
      }

      // Stock filters
      if (filter.minStock !== undefined || filter.maxStock !== undefined) {
        where.stock = {};
        if (filter.minStock !== undefined) {
          where.stock.gte = filter.minStock;
        }
        if (filter.maxStock !== undefined) {
          where.stock.lte = filter.maxStock;
        }
      }

      // Price filters
      if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
        where.price = {};
        if (filter.minPrice !== undefined) {
          where.price.gte = filter.minPrice;
        }
        if (filter.maxPrice !== undefined) {
          where.price.lte = filter.maxPrice;
        }
      }

      // Name filter (case insensitive)
      if (filter.name) {
        where.name = {
          contains: filter.name,
          mode: Prisma.QueryMode.insensitive,
        } as Prisma.StringFilter<'Product'>;
      }

      // Creator filter
      if (filter.createdBy) {
        where.createdBy = filter.createdBy;
      }

      // Build sort options
      const orderBy: Prisma.ProductOrderByWithRelationInput = {};

      // Map sort field to Prisma field
      switch (filter.sortBy) {
        case ProductSortField.ID:
          orderBy.id = filter.sortOrder || SortOrder.DESC;
          break;
        case ProductSortField.NAME:
          orderBy.name = filter.sortOrder || SortOrder.DESC;
          break;
        case ProductSortField.PRICE:
          orderBy.price = filter.sortOrder || SortOrder.DESC;
          break;
        case ProductSortField.STOCK:
          orderBy.stock = filter.sortOrder || SortOrder.DESC;
          break;
        case ProductSortField.UPDATED_AT:
          orderBy.updatedAt = filter.sortOrder || SortOrder.DESC;
          break;
        case ProductSortField.CREATED_AT:
        default:
          orderBy.createdAt = filter.sortOrder || SortOrder.DESC;
      }

      // Get total count for pagination
      const total = await this.model.count({ where });

      // Get data with pagination
      const data = await this.model.findMany({
        where,
        orderBy,
        skip: filter.skip,
        take: typeof filter.limit === 'string' ? parseInt(filter.limit, 10) : filter.limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return { data, total };
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          filter,
        },
        'Error finding products with filters'
      );
      throw error;
    }
  }

  /**
   * Find products by price range
   */
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    try {
      return await this.model.findMany({
        where: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      });
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          minPrice,
          maxPrice,
        },
        'Error finding products by price range'
      );
      throw error;
    }
  }

  /**
   * Find products with stock less than specified amount
   */
  async findLowStock(threshold: number): Promise<Product[]> {
    try {
      return await this.model.findMany({
        where: {
          stock: {
            lt: threshold,
          },
        },
      });
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          threshold,
        },
        'Error finding low stock products'
      );
      throw error;
    }
  }

  /**
   * Search products by name or description
   */
  async search(query: string): Promise<Product[]> {
    try {
      return await this.model.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              } as Prisma.StringFilter<'Product'>,
            },
            {
              description: {
                contains: query,
                mode: Prisma.QueryMode.insensitive,
              } as Prisma.StringFilter<'Product'>,
            },
          ],
        },
      });
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          query,
        },
        'Error searching products'
      );
      throw error;
    }
  }
}
