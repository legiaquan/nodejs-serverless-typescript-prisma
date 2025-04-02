import type { Request, Response } from "express"

import { UserService } from "../services/user.service"
import { NotFoundError } from "../utils/error.response"
import { OkResponse, CreatedResponse } from "../utils/success.response"
import type { CreateUserDTO } from "../dtos/user/create-user.dto"
import type { UpdateUserDTO } from "../dtos/user/update-user.dto"
import type { SearchDTO } from "../dtos/query/search.dto"
import type { IdParamDTO } from "../dtos/params/id-param.dto"
import type { RoleParamDTO } from "../dtos/params/role-param.dto"

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  // Update getAllUsers to use pagination
  getAllUsers = async (req: Request, res: Response) => {
    const page = req.query.page ? Number.parseInt(req.query.page as string) : 1
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : 10

    const result = await this.userService.getAllUsers({ page, limit })

    new OkResponse({
      message: "Users retrieved successfully",
      metadata: {
        data: result.data,
        total: result.total,
        pagination: result.pagination,
      },
    }).send(res)
  }

  getUserById = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IdParamDTO

    const user = await this.userService.getUserById(id)

    if (!user) {
      throw new NotFoundError("User not found")
    }

    new OkResponse({
      message: "User retrieved successfully",
      metadata: { data: user },
    }).send(res)
  }

  createUser = async (req: Request, res: Response) => {
    const userData = req.body as CreateUserDTO
    const newUser = await this.userService.createUser(userData)

    new CreatedResponse({
      message: "User created successfully",
      metadata: { data: newUser },
    }).send(res)
  }

  updateUser = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IdParamDTO
    const userData = req.body as UpdateUserDTO

    const updatedUser = await this.userService.updateUser(id, userData)

    if (!updatedUser) {
      throw new NotFoundError("User not found")
    }

    new OkResponse({
      message: "User updated successfully",
      metadata: { data: updatedUser },
    }).send(res)
  }

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as IdParamDTO

    const result = await this.userService.deleteUser(id)

    if (!result) {
      throw new NotFoundError("User not found")
    }

    new OkResponse({
      message: "User deleted successfully",
      metadata: { success: true },
    }).send(res)
  }

  searchUsers = async (req: Request, res: Response) => {
    const { query, page, limit } = req.query as unknown as SearchDTO

    const users = await this.userService.searchUsers(query)

    new OkResponse({
      message: "Users search completed",
      metadata: {
        data: users,
        count: users.length,
        query,
        pagination: { page, limit },
      },
    }).send(res)
  }

  getUsersByRole = async (req: Request, res: Response) => {
    const { role } = req.params as unknown as RoleParamDTO

    const users = await this.userService.getUsersByRole(role)

    new OkResponse({
      message: `Users with role '${role}' retrieved successfully`,
      metadata: {
        data: users,
        count: users.length,
        role,
      },
    }).send(res)
  }
}

