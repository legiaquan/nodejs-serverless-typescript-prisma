import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

export class UpdateUserDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name?: string;

  @Expose()
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @MaxLength(100, { message: 'Email must be at most 100 characters' })
  email?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Role must be a string' })
  @MaxLength(50, { message: 'Role must be at most 50 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Role can only contain letters, numbers, underscores and hyphens',
  })
  role?: string;
}
