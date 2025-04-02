import { Expose, Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class IdParamDTO {
  @Expose()
  @IsInt({ message: 'ID must be an integer' })
  @Min(1, { message: 'ID must be greater than or equal to 1' })
  @Type(() => Number)
  id: number;
}
