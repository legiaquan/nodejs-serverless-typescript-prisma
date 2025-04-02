/**
 * Interface for entities that can be logged in the activity log
 */
export interface Loggable {
  /**
   * Get the entity type for activity logging
   */
  getEntityType(): string

  /**
   * Get the entity ID for activity logging
   */
  getEntityId(): number

  /**
   * Sanitize the entity for logging
   * This should return a clean object with only the fields that should be logged
   */
  sanitizeForLog(): Record<string, any>
}

