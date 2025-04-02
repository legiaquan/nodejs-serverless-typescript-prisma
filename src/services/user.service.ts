import type { User, Prisma } from "@prisma/client"
import { UserRepository } from "../repos/user.repository"
import { logger } from "../utils/logger"
import { BadRequestError } from "../utils/error.response"
import { BaseService } from "./base.service"
import { ActionType } from "./activity-log.service"
import { UserModel } from "../models/user.model"
import { createPaginationFromFilter } from "../utils/pagination.utils"
import type { PaginationParams } from "../interfaces/pagination.interface"
import type { UserListResult } from "../interfaces/user.interface"

export class UserService extends BaseService {
  private userRepository: UserRepository

  constructor() {
    super()
    this.userRepository = new UserRepository()
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(filter?: PaginationParams): Promise<UserListResult> {
    try {
      // Use default values if filter not provided
      const userFilter = filter || { page: 1, limit: 10 }
      const skip = (userFilter.page! - 1) * userFilter.limit!
      const take = userFilter.limit

      // Get total count
      const total = await this.userRepository.count()

      // Get users with pagination
      const data = await this.userRepository.findAll({
        skip,
        take,
      })

      // Generate pagination info
      const pagination = createPaginationFromFilter(userFilter, total)

      return {
        data,
        total,
        pagination,
      }
    } catch (error) {
      logger.error({ err: error }, "Error getting all users")
      throw error
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number, viewerId?: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findById(id)

      // Log view activity if viewerId is provided and user exists
      if (user && viewerId) {
        const userModel = new UserModel(user)
        await this.logActivity(
          userModel,
          ActionType.VIEW,
          viewerId,
          null,
          { ip: "127.0.0.1" }, // You could pass the real IP from the request
        )
      }

      return user
    } catch (error) {
      logger.error({ err: error, id }, `Error getting user with id ${id}`)
      throw error
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: Prisma.UserCreateInput, adminId?: number): Promise<User> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findByEmail(userData.email)
      if (existingUser) {
        throw new BadRequestError(`User with email ${userData.email} already exists`)
      }

      // Create the user
      const newUser = await this.userRepository.create(userData)

      // Log the activity if adminId is provided
      if (adminId) {
        const userModel = new UserModel(newUser)
        await this.logActivity(userModel, ActionType.CREATE, adminId, null)
      }

      return newUser
    } catch (error) {
      logger.error({ err: error }, "Error creating user")
      throw error
    }
  }

  /**
   * Update a user
   */
  async updateUser(id: number, userData: Prisma.UserUpdateInput, adminId?: number): Promise<User | null> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id)
      if (!existingUser) {
        return null
      }

      // Check if email is being updated and already exists
      if (userData.email) {
        const existingUserWithEmail = await this.userRepository.findByEmail(userData.email as string)
        if (existingUserWithEmail && existingUserWithEmail.id !== id) {
          throw new BadRequestError(`User with email ${userData.email} already exists`)
        }
      }

      // Update the user
      const updatedUser = await this.userRepository.update(id, userData)

      // Log the activity if adminId is provided
      if (adminId) {
        const beforeModel = new UserModel(existingUser)
        const afterModel = new UserModel(updatedUser)
        await this.logActivity(afterModel, ActionType.UPDATE, adminId, beforeModel)
      }

      return updatedUser
    } catch (error) {
      logger.error({ err: error, id }, `Error updating user with id ${id}`)
      throw error
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number, adminId: number): Promise<boolean> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id)
      if (!existingUser) {
        return false
      }

      // Log the activity before deleting
      const userModel = new UserModel(existingUser)
      await this.logActivity(null, ActionType.DELETE, adminId, userModel)

      // Delete the user
      await this.userRepository.delete(id)
      return true
    } catch (error) {
      logger.error({ err: error, id }, `Error deleting user with id ${id}`)
      throw error
    }
  }

  /**
   * Search users
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      return await this.userRepository.search(query)
    } catch (error) {
      logger.error({ err: error, query }, `Error searching users with query: ${query}`)
      throw error
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      return await this.userRepository.findByRole(role)
    } catch (error) {
      logger.error({ err: error, role }, `Error getting users with role: ${role}`)
      throw error
    }
  }

  /**
   * Get user activity logs
   */
  async getUserActivityLogs(userId: number): Promise<any[]> {
    try {
      // Check if user exists
      const user = await this.userRepository.findById(userId)
      if (!user) {
        throw new BadRequestError(`User with ID ${userId} not found`)
      }

      // Get activity logs
      return await this.activityLogService.getEntityLogs("user", userId)
    } catch (error) {
      logger.error({ err: error, userId }, `Error getting activity logs for user ${userId}`)
      throw error
    }
  }
}

