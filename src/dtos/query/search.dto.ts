import { IsNotEmpty, IsString, MinLength } from "class-validator"
import { Expose } from "class-transformer"
import { PaginationDTO } from "./pagination.dto"

export class SearchDTO extends PaginationDTO {
  @Expose()
  @IsNotEmpty({ message: "Search query is required" })
  @IsString({ message: "Search query must be a string" })
  @MinLength(2, { message: "Search query must be at least 2 characters" })
  query: string
}

