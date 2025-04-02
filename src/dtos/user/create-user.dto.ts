import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength } from "class-validator"
import { Expose } from "class-transformer"

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDTO:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         role:
 *           type: string
 *           description: User's role
 *           example: user
 */
export class CreateUserDTO {
  @Expose()
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  @Length(2, 100, { message: "Name must be between 2 and 100 characters" })
  name: string

  @Expose()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  @MaxLength(100, { message: "Email must be at most 100 characters" })
  email: string

  @Expose()
  @IsOptional()
  @IsString({ message: "Role must be a string" })
  @MaxLength(50, { message: "Role must be at most 50 characters" })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: "Role can only contain letters, numbers, underscores and hyphens",
  })
  role?: string
}

