import { IsOptional, IsDate } from "class-validator"
import { Expose, Type } from "class-transformer"
import { PaginationDTO } from "./pagination.dto"
import { UTCDate } from "../../decorators/utc-date.decorator"

export class ProductFilterDTO extends PaginationDTO {
  // Các trường khác...

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @UTCDate()
  createdFrom?: Date

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @UTCDate()
  createdTo?: Date

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @UTCDate()
  updatedFrom?: Date

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @UTCDate()
  updatedTo?: Date

  // Các trường khác...
}

