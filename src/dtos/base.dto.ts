import { type ClassConstructor, plainToInstance } from "class-transformer"
import { validate, type ValidationError } from "class-validator"
import { BadRequestError } from "../utils/error.response"

export class BaseDTO {
  /**
   * Validate DTO and transform plain object to class instance
   */
  static async validateAndTransform<T extends object>(dto: ClassConstructor<T>, data: Record<string, any>): Promise<T> {
    // Transform plain object to class instance
    const instance = plainToInstance(dto, data, {
      excludeExtraneousValues: false,
      enableImplicitConversion: true,
    })

    // Validate the instance
    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    })

    if (errors.length > 0) {
      throw new BadRequestError(this.formatValidationErrors(errors))
    }

    return instance
  }

  /**
   * Format validation errors into a readable string
   */
  private static formatValidationErrors(errors: ValidationError[]): string {
    const formattedErrors: string[] = []

    const extractErrors = (error: ValidationError, parentPath = "") => {
      const property = parentPath ? `${parentPath}.${error.property}` : error.property

      if (error.constraints) {
        Object.values(error.constraints).forEach((constraint) => {
          formattedErrors.push(`${property}: ${constraint}`)
        })
      }

      if (error.children && error.children.length > 0) {
        error.children.forEach((childError) => {
          extractErrors(childError, property)
        })
      }
    }

    errors.forEach((error) => extractErrors(error))
    return formattedErrors.join(", ")
  }
}

