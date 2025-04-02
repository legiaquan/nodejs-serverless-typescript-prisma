import { Expose, Type } from 'class-transformer';
import { IsDecimal,IsNumber, IsOptional, IsString, Length, Min } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateProductDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Product name
 *           example: Updated Smartphone
 *         description:
 *           type: string
 *           description: Product description
 *           example: An updated high-end smartphone with great features
 *         price:
 *           type: number
 *           format: decimal
 *           description: Product price
 *           example: 899.99
 *         stock:
 *           type: integer
 *           description: Available stock
 *           example: 75
 */
export class UpdateProductDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @Expose()
  @IsOptional()
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'Price must be a decimal with at most 2 decimal places' }
  )
  @Type(() => Number)
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  stock?: number;
}
