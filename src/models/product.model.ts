import type { Product } from '@prisma/client';

import type { Loggable } from '../interfaces/loggable.interface';
import { EntityType } from '../services/activity-log.service';

/**
 * Product model that implements Loggable interface
 */
export class ProductModel implements Loggable {
  private product: Product;

  constructor(product: Product) {
    this.product = product;
  }

  /**
   * Get the entity type for activity logging
   */
  getEntityType(): string {
    return EntityType.PRODUCT;
  }

  /**
   * Get the entity ID for activity logging
   */
  getEntityId(): number {
    return this.product.id;
  }

  /**
   * Sanitize the product for logging
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sanitizeForLog(): Record<string, any> {
    const { id, name, description, price, stock, createdBy, createdAt, updatedAt } = this.product;
    return {
      id,
      name,
      description,
      price: Number.parseFloat(price.toString()),
      stock,
      createdBy,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }

  /**
   * Get the underlying product
   */
  getProduct(): Product {
    return this.product;
  }
}
