import { Expose, Type } from 'class-transformer';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProductDTO:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
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
 */
export class CreateProductDTO {
  @Expose()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @Expose()
  @IsNotEmpty({ message: 'Price is required' })
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'Price must be a decimal with at most 2 decimal places' }
  )
  @Type(() => Number)
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  stock?: number;
}
