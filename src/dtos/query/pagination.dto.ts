import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalItems:
 *           type: integer
 *           example: 100
 *         totalPages:
 *           type: integer
 *           example: 10
 *         hasNext:
 *           type: boolean
 *           example: true
 *         hasPrevious:
 *           type: boolean
 *           example: false
 *         nextPage:
 *           type: integer
 *           nullable: true
 *           example: 2
 *         previousPage:
 *           type: integer
 *           nullable: true
 *           example: null
 *         startIndex:
 *           type: integer
 *           example: 0
 *         endIndex:
 *           type: integer
 *           example: 9
 *         isFirstPage:
 *           type: boolean
 *           example: true
 *         isLastPage:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PaginationDTO:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Page number
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           description: Number of items per page
 *           example: 10
 */
export class PaginationDTO {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 10;
  static readonly MAX_LIMIT = 100;

  @Expose()
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Min(1, { message: 'Page must be greater than or equal to 1' })
  @Type(() => Number)
  page?: number = PaginationDTO.DEFAULT_PAGE;

  @Expose()
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Min(1, { message: 'Limit must be greater than or equal to 1' })
  @Max(PaginationDTO.MAX_LIMIT, {
    message: `Limit must be less than or equal to ${PaginationDTO.MAX_LIMIT}`,
  })
  @Type(() => Number)
  limit?: number = PaginationDTO.DEFAULT_LIMIT;

  get skip(): number {
    const page = this.page ?? PaginationDTO.DEFAULT_PAGE;
    const limit = this.limit ?? PaginationDTO.DEFAULT_LIMIT;
    return (page - 1) * limit;
  }
}
