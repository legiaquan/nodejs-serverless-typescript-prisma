import { Router } from 'express';

import { Permission } from '../constants/permissions';
import { ProductController } from '../controllers/product.controller';
import { IdParamDTO } from '../dtos/params/id-param.dto';
import { CreateProductDTO } from '../dtos/product/create-product.dto';
import { UpdateProductDTO } from '../dtos/product/update-product.dto';
import { PriceRangeDTO } from '../dtos/query/price-range.dto';
import { ProductFilterDTO } from '../dtos/query/product-filter.dto';
import { SearchDTO } from '../dtos/query/search.dto';
import {
  authenticate,
  requirePermission,
  requirePermissionAndOwnership,
} from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/global-error-handler';
import { validateBody, validateParams, validateQuery } from '../middleware/validation.middleware';
import { ProductService } from '../services/product.service';

const router = Router();
const productController = new ProductController();
const productService = new ProductService();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: Product ID
 *           example: 1
 *         name:
 *           type: string
 *           description: Product name
 *           example: Smartphone
 *         description:
 *           type: string
 *           description: Product description
 *           example: A high-end smartphone with great features
 *         price:
 *           type: number
 *           format: decimal
 *           description: Product price
 *           example: 999.99
 *         stock:
 *           type: integer
 *           description: Available stock
 *           example: 50
 *         createdBy:
 *           type: integer
 *           description: ID of the user who created the product
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products with optional filtering
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: minStock
 *         schema:
 *           type: integer
 *         description: Minimum stock
 *       - in: query
 *         name: maxStock
 *         schema:
 *           type: integer
 *         description: Maximum stock
 *       - in: query
 *         name: createdFrom
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by creation date (from)
 *       - in: query
 *         name: createdTo
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter by creation date (to)
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Products retrieved successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     total:
 *                       type: number
 *                       example: 50
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationInfo'
 */
router.get('/', validateQuery(ProductFilterDTO), asyncHandler(productController.getAllProducts));

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     description: Search products by name or description
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search', validateQuery(SearchDTO), asyncHandler(productController.searchProducts));

/**
 * @swagger
 * /products/price-range:
 *   get:
 *     summary: Get products by price range
 *     description: Retrieve products within a specific price range
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *           default: 0
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Products within the specified price range
 *       400:
 *         description: Bad request - invalid price range
 */
router.get(
  '/price-range',
  validateQuery(PriceRangeDTO),
  asyncHandler(productController.getProductsByPriceRange)
);

/**
 * @swagger
 * /products/low-stock:
 *   get:
 *     summary: Get low stock products
 *     description: Retrieve products with stock below a specified threshold
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Stock threshold
 *     responses:
 *       200:
 *         description: Low stock products
 *       400:
 *         description: Bad request - invalid threshold
 */
router.get('/low-stock', asyncHandler(productController.getLowStockProducts));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     description: Retrieve a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Product retrieved successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', validateParams(IdParamDTO), asyncHandler(productController.getProductById));

/**
 * @swagger
 * /products/{id}/logs:
 *   get:
 *     summary: Get product activity logs
 *     description: Retrieve activity logs for a specific product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product activity logs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 *       404:
 *         description: Product not found
 */
router.get(
  '/:id/logs',
  authenticate,
  validateParams(IdParamDTO),
  requirePermission(Permission.VIEW_PRODUCTS),
  asyncHandler(productController.getProductActivityLogs)
);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product. Requires authentication and CREATE_PRODUCT permission.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDTO'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Product created successfully
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  '/',
  authenticate,
  requirePermission(Permission.CREATE_PRODUCT),
  validateBody(CreateProductDTO),
  asyncHandler(productController.createProduct)
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update an existing product. Requires authentication, UPDATE_PRODUCT permission, and ownership.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductDTO'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions or not the owner
 *       404:
 *         description: Product not found
 */
router.put(
  '/:id',
  authenticate,
  validateParams(IdParamDTO),
  validateBody(UpdateProductDTO),
  requirePermissionAndOwnership(Permission.UPDATE_PRODUCT, async req => {
    const productId = Number.parseInt(req.params.id, 10);
    const product = await productService.getProductById(productId);
    return product ? product.createdBy : null;
  }),
  asyncHandler(productController.updateProduct)
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product. Requires authentication, DELETE_PRODUCT permission, and ownership.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions or not the owner
 *       404:
 *         description: Product not found
 */
router.delete(
  '/:id',
  authenticate,
  validateParams(IdParamDTO),
  requirePermissionAndOwnership(Permission.DELETE_PRODUCT, async req => {
    const productId = Number.parseInt(req.params.id, 10);
    const product = await productService.getProductById(productId);
    return product ? product.createdBy : null;
  }),
  asyncHandler(productController.deleteProduct)
);

/**
 * @swagger
 * /products/bulk:
 *   post:
 *     summary: Bulk create products
 *     description: Create multiple products at once. Requires authentication and MANAGE_ALL permission.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/CreateProductDTO'
 *     responses:
 *       201:
 *         description: Products created successfully
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post(
  '/bulk',
  authenticate,
  requirePermission(Permission.MANAGE_ALL),
  asyncHandler(productController.bulkCreateProducts)
);

export default router;
