import { IsOptional, IsNumber, Min } from "class-validator"
import { Expose, Type } from "class-transformer"
import { PaginationDTO } from "./pagination.dto"

export class PriceRangeDTO extends PaginationDTO {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "Minimum price must be a number" })
  @Min(0, { message: "Minimum price must be greater than or equal to 0" })
  @Type(() => Number)
  minPrice?: number = 0

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: "Maximum price must be a number" })
  @Min(0, { message: "Maximum price must be greater than or equal to 0" })
  @Type(() => Number)
  maxPrice?: number = Number.MAX_SAFE_INTEGER
}

