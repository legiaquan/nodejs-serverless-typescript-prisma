import type { Prisma,Product } from '@prisma/client';

import { ProductFilterDTO } from '../dtos/query/product-filter.dto';
import type { ProductListResult } from '../interfaces/product.interface';
import { ProductModel } from '../models/product.model';
import { ProductRepository } from '../repos/product.repository';
import { BadRequestError } from '../utils/error.response';
import { logger } from '../utils/logger';
import { createPaginationFromFilter } from '../utils/pagination.utils';
import { ActionType } from './activity-log.service';
import { BaseService } from './base.service';

export class ProductService extends BaseService {
  private productRepository: ProductRepository;

  constructor() {
    super();
    this.productRepository = new ProductRepository();
  }

  /**
   * Get all products with filtering and pagination
   */
  async getAllProducts(filter?: ProductFilterDTO): Promise<ProductListResult> {
    try {
      // Use default filter if not provided
      const productFilter = filter || new ProductFilterDTO();

      // Get products with filtering and pagination
      const { data, total } = await this.productRepository.findWithFilters(productFilter);

      // Generate pagination info using the utility function
      const pagination = createPaginationFromFilter(productFilter, total);

      // Return data with pagination info
      return {
        data,
        total,
        pagination,
      };
    } catch (error) {
      logger.error({ err: error, filter }, 'Error getting products with filters');
      throw error;
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number, userId?: number): Promise<Product | null> {
    try {
      const product = await this.productRepository.findById(id, {
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

      // Log view activity if userId is provided and product exists
      if (product && userId) {
        const productModel = new ProductModel(product);
        await this.logActivity(
          productModel,
          ActionType.VIEW,
          userId,
          null,
          { ip: '127.0.0.1' } // You could pass the real IP from the request
        );
      }

      return product;
    } catch (error) {
      logger.error({ err: error, id }, `Error getting product with id ${id}`);
      throw error;
    }
  }

  /**
   * Create a new product
   */
  async createProduct(productData: Prisma.ProductCreateInput): Promise<Product> {
    try {
      // Validate product data
      if (productData.price < 0) {
        throw new BadRequestError('Product price cannot be negative');
      }

      if (productData.stock < 0) {
        throw new BadRequestError('Product stock cannot be negative');
      }

      // Create the product
      const newProduct = await this.productRepository.create(productData);

      // Log the activity
      const productModel = new ProductModel(newProduct);
      await this.logActivity(
        productModel,
        ActionType.CREATE,
        productData.createdBy as number,
        null
      );

      return newProduct;
    } catch (error) {
      logger.error({ err: error }, 'Error creating product');
      throw error;
    }
  }

  /**
   * Update a product
   */
  async updateProduct(id: number, productData: Prisma.ProductUpdateInput): Promise<Product | null> {
    try {
      // Check if product exists
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        return null;
      }

      // Validate product data
      if (productData.price !== undefined && (productData.price as number) < 0) {
        throw new BadRequestError('Product price cannot be negative');
      }

      if (productData.stock !== undefined && (productData.stock as number) < 0) {
        throw new BadRequestError('Product stock cannot be negative');
      }

      // Update the product
      const updatedProduct = await this.productRepository.update(id, productData);

      // Get the user ID from the request or from the existing product
      const userId = (productData.user as any)?.connect?.id || existingProduct.createdBy;

      // Log the activity with changes
      const beforeModel = new ProductModel(existingProduct);
      const afterModel = new ProductModel(updatedProduct);
      await this.logActivity(afterModel, ActionType.UPDATE, userId as number, beforeModel);

      return updatedProduct;
    } catch (error) {
      logger.error({ err: error, id }, `Error updating product with id ${id}`);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: number, userId: number): Promise<boolean> {
    try {
      // Check if product exists
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        return false;
      }

      // Log the activity before deleting
      const productModel = new ProductModel(existingProduct);
      await this.logActivity(null, ActionType.DELETE, userId, productModel);

      // Delete the product
      await this.productRepository.delete(id);
      return true;
    } catch (error) {
      logger.error({ err: error, id }, `Error deleting product with id ${id}`);
      throw error;
    }
  }

  /**
   * Search products
   */
  async searchProducts(query: string): Promise<Product[]> {
    try {
      return await this.productRepository.search(query);
    } catch (error) {
      logger.error({ err: error, query }, `Error searching products with query: ${query}`);
      throw error;
    }
  }

  /**
   * Get products by price range
   */
  async getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]> {
    try {
      if (minPrice < 0 || maxPrice < 0) {
        throw new BadRequestError('Price cannot be negative');
      }

      if (minPrice > maxPrice) {
        throw new BadRequestError('Minimum price cannot be greater than maximum price');
      }

      return await this.productRepository.findByPriceRange(minPrice, maxPrice);
    } catch (error) {
      logger.error(
        { err: error, minPrice, maxPrice },
        `Error getting products in price range: ${minPrice} - ${maxPrice}`
      );
      throw error;
    }
  }

  /**
   * Get products with low stock
   */
  async getLowStockProducts(threshold = 10): Promise<Product[]> {
    try {
      if (threshold < 0) {
        throw new BadRequestError('Threshold cannot be negative');
      }

      return await this.productRepository.findLowStock(threshold);
    } catch (error) {
      logger.error(
        { err: error, threshold },
        `Error getting low stock products with threshold: ${threshold}`
      );
      throw error;
    }
  }

  /**
   * Bulk create products
   */
  async bulkCreateProducts(productsData: Prisma.ProductCreateInput[]): Promise<Product[]> {
    try {
      // Validate all products
      for (const productData of productsData) {
        if (productData.price < 0) {
          throw new BadRequestError('Product price cannot be negative');
        }

        if (productData.stock < 0) {
          throw new BadRequestError('Product stock cannot be negative');
        }
      }

      // Use transaction to create all products
      return await this.productRepository.transaction(async tx => {
        const createdProducts: Product[] = [];

        for (const productData of productsData) {
          const product = await tx.product.create({
            data: productData,
          });
          createdProducts.push(product);

          // Log the activity for each created product
          await tx.activityLog.create({
            data: {
              entityType: 'product',
              entityId: product.id,
              action: ActionType.CREATE,
              userId: productData.createdBy as number,
              changes: {
                after: new ProductModel(product).sanitizeForLog(),
              } as Prisma.JsonObject,
            },
          });
        }

        return createdProducts;
      });
    } catch (error) {
      logger.error({ err: error }, 'Error bulk creating products');
      throw error;
    }
  }

  /**
   * Get product activity logs
   */
  async getProductActivityLogs(productId: number): Promise<any[]> {
    try {
      // Check if product exists
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new BadRequestError(`Product with ID ${productId} not found`);
      }

      // Get activity logs
      return await this.activityLogService.getEntityLogs('product', productId);
    } catch (error) {
      logger.error(
        { err: error, productId },
        `Error getting activity logs for product ${productId}`
      );
      throw error;
    }
  }
}
