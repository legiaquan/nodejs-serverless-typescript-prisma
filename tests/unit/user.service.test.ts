import { UserService } from "../../src/services/user.service"
import prisma from "../../src/lib/prisma"
import { describe, beforeEach, it, expect, jest } from "@jest/globals"
import type { User } from "@prisma/client"

// Mock the Prisma client
jest.mock("../../src/lib/prisma", () => ({
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}))

describe("UserService", () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService()
    jest.clearAllMocks()
  })

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: "User 1",
          email: "user1@example.com",
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          name: "User 2",
          email: "user2@example.com",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      ;(prisma.user.findMany as jest.Mock).mockResolvedValue(mockUsers)

      const result = await userService.getAllUsers()

      expect(prisma.user.findMany).toHaveBeenCalled()
      expect(result).toEqual(mockUsers)
    })
  })

  describe("getUserById", () => {
    it("should return a user when found", async () => {
      const mockUser: User = {
        id: 1,
        name: "User 1",
        email: "user1@example.com",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const result = await userService.getUserById(1)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(result).toEqual(mockUser)
    })

    it("should return null when user not found", async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await userService.getUserById(999)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      })
      expect(result).toBeNull()
    })
  })
})

