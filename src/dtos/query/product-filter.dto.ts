import { Expose, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { PaginationDTO } from './pagination.dto';
import { UTCDate } from '../../decorators/utc-date.decorator';

export enum ProductSortField {
  ID = 'id',
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class ProductFilterDTO extends PaginationDTO {
  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minStock?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxStock?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  createdBy?: number;

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @UTCDate()
  createdFrom?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @UTCDate()
  createdTo?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @UTCDate()
  updatedFrom?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @UTCDate()
  updatedTo?: Date;

  @Expose()
  @IsOptional()
  @IsEnum(ProductSortField)
  sortBy?: ProductSortField = ProductSortField.CREATED_AT;

  @Expose()
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;
}
