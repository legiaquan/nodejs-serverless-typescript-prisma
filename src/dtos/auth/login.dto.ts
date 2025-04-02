import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Expose } from "class-transformer"

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDTO:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: Password123!
 */
export class LoginDTO {
  @Expose()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string

  @Expose()
  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  password: string
}

