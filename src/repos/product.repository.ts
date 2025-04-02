import type { Prisma, Product } from '@prisma/client';

import { type ProductFilterDTO, ProductSortField } from '../dtos/query/product-filter.dto';
import prisma from '../lib/prisma';
import { toUTC } from '../utils/date.utils';
import { BaseRepository } from './base.repository';

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
          mode: 'insensitive',
        };
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
          orderBy.id = filter.sortOrder;
          break;
        case ProductSortField.NAME:
          orderBy.name = filter.sortOrder;
          break;
        case ProductSortField.PRICE:
          orderBy.price = filter.sortOrder;
          break;
        case ProductSortField.STOCK:
          orderBy.stock = filter.sortOrder;
          break;
        case ProductSortField.UPDATED_AT:
          orderBy.updatedAt = filter.sortOrder;
          break;
        case ProductSortField.CREATED_AT:
        default:
          orderBy.createdAt = filter.sortOrder;
      }

      // Get total count for pagination
      const total = await this.model.count({ where });

      // Get data with pagination
      const data = await this.model.findMany({
        where,
        orderBy,
        skip: filter.skip,
        take: filter.limit,
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
          OR: [{ name: { contains: query } }, { description: { contains: query } }],
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
