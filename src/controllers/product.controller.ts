import type { Request, Response } from 'express';

import type { IdParamDTO } from '../dtos/params/id-param.dto';
import type { CreateProductDTO } from '../dtos/product/create-product.dto';
import type { UpdateProductDTO } from '../dtos/product/update-product.dto';
import type { PriceRangeDTO } from '../dtos/query/price-range.dto';
import type { ProductFilterDTO } from '../dtos/query/product-filter.dto';
import type { SearchDTO } from '../dtos/query/search.dto';
import { ProductService } from '../services/product.service';
import { fromUTC } from '../utils/date.utils';
import { BadRequestError, NotFoundError } from '../utils/error.response';
import { CreatedResponse,OkResponse } from '../utils/success.response';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  getAllProducts = async (req: Request, res: Response) => {
    // Use the query parameters as filter
    const filter = req.query as unknown as ProductFilterDTO;

    const result = await this.productService.getAllProducts(filter);

    new OkResponse({
      message: 'Products retrieved successfully',
      metadata: {
        data: result.data,
        total: result.total,
        pagination: result.pagination,
      },
    }).send(res);
  };

  getProductById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await this.productService.getProductById(Number(id));

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Lấy timezone từ request header hoặc sử dụng default
    const timezone = (req.headers['x-timezone'] as string) || 'UTC';

    // Chuyển đổi các trường datetime sang timezone của client
    const formattedProduct = {
      ...product,
      createdAt: fromUTC(product.createdAt, timezone),
      updatedAt: fromUTC(product.updatedAt, timezone),
    };

    new OkResponse({
      message: 'Product retrieved successfully',
      metadata: { data: formattedProduct },
    }).send(res);
  };

  createProduct = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not authenticated');
    }

    const productData = req.body as CreateProductDTO;

    // Add the current user as the creator
    const newProduct = await this.productService.createProduct({
      ...productData,
      createdBy: req.user.id,
    });

    new CreatedResponse({
      message: 'Product created successfully',
      metadata: { data: newProduct },
    }).send(res);
  };

  updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IdParamDTO;
    const productData = req.body as UpdateProductDTO;

    const updatedProduct = await this.productService.updateProduct(id, productData);

    if (!updatedProduct) {
      throw new NotFoundError('Product not found');
    }

    new OkResponse({
      message: 'Product updated successfully',
      metadata: { data: updatedProduct },
    }).send(res);
  };

  deleteProduct = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not authenticated');
    }

    const { id } = req.params as unknown as IdParamDTO;

    const result = await this.productService.deleteProduct(id, req.user.id);

    if (!result) {
      throw new NotFoundError('Product not found');
    }

    new OkResponse({
      message: 'Product deleted successfully',
      metadata: { success: true },
    }).send(res);
  };

  searchProducts = async (req: Request, res: Response) => {
    const { query, page, limit } = req.query as unknown as SearchDTO;

    const products = await this.productService.searchProducts(query);

    new OkResponse({
      message: 'Products search completed',
      metadata: {
        data: products,
        count: products.length,
        query,
        pagination: { page, limit },
      },
    }).send(res);
  };

  getProductsByPriceRange = async (req: Request, res: Response) => {
    const { minPrice, maxPrice, page, limit } = req.query as unknown as PriceRangeDTO;

    const products = await this.productService.getProductsByPriceRange(minPrice, maxPrice);

    new OkResponse({
      message: 'Products in price range retrieved successfully',
      metadata: {
        data: products,
        count: products.length,
        priceRange: { min: minPrice, max: maxPrice },
        pagination: { page, limit },
      },
    }).send(res);
  };

  getLowStockProducts = async (req: Request, res: Response) => {
    const threshold = req.query.threshold ? Number.parseInt(req.query.threshold as string, 10) : 10;

    if (Number.isNaN(threshold)) {
      throw new BadRequestError('Invalid threshold value');
    }

    const products = await this.productService.getLowStockProducts(threshold);

    new OkResponse({
      message: 'Low stock products retrieved successfully',
      metadata: {
        data: products,
        count: products.length,
        threshold,
      },
    }).send(res);
  };

  bulkCreateProducts = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new BadRequestError('User not authenticated');
    }

    const productsData = req.body.products as CreateProductDTO[];

    if (!Array.isArray(productsData) || productsData.length === 0) {
      throw new BadRequestError('Invalid products data');
    }

    // Add the current user as the creator for all products
    const products = await this.productService.bulkCreateProducts(
      productsData.map(product => ({
        ...product,
        createdBy: req.user!.id,
      }))
    );

    new CreatedResponse({
      message: 'Products created successfully',
      metadata: {
        data: products,
        count: products.length,
      },
    }).send(res);
  };

  getProductActivityLogs = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IdParamDTO;

    const logs = await this.productService.getProductActivityLogs(id);

    new OkResponse({
      message: 'Product activity logs retrieved successfully',
      metadata: {
        data: logs,
        count: logs.length,
        productId: id,
      },
    }).send(res);
  };
}
