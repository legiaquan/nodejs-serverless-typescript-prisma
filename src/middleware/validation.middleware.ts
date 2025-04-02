import type { Request, Response, NextFunction } from "express"
import type { ClassConstructor } from "class-transformer"
import { BaseDTO } from "../dtos/base.dto"
import { asyncHandler } from "./global-error-handler"

/**
 * Middleware to validate request body against a DTO
 */
export const validateBody = <T extends object>(dto: ClassConstructor<T>) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.body = await BaseDTO.validateAndTransform(dto, req.body)
    next()
  })
}

/**
 * Middleware to validate request query parameters against a DTO
 */
export const validateQuery = <T extends object>(dto: ClassConstructor<T>) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.query = await BaseDTO.validateAndTransform(dto, req.query)
    next()
  })
}

/**
 * Middleware to validate request parameters against a DTO
 */
export const validateParams = <T extends object>(dto: ClassConstructor<T>) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    req.params = await BaseDTO.validateAndTransform(dto, req.params)
    next()
  })
}

