import type { User } from "@prisma/client"
import type { Loggable } from "../interfaces/loggable.interface"
import { EntityType } from "../services/activity-log.service"

/**
 * User model that implements Loggable interface
 */
export class UserModel implements Loggable {
  private user: User

  constructor(user: User) {
    this.user = user
  }

  /**
   * Get the entity type for activity logging
   */
  getEntityType(): string {
    return EntityType.USER
  }

  /**
   * Get the entity ID for activity logging
   */
  getEntityId(): number {
    return this.user.id
  }

  /**
   * Sanitize the user for logging
   */
  sanitizeForLog(): Record<string, any> {
    const { id, name, email, role, createdAt, updatedAt } = this.user
    return {
      id,
      name,
      email,
      role,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    }
  }

  /**
   * Get the underlying user
   */
  getUser(): User {
    return this.user
  }
}

