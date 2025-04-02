import { ActivityLogService, type ActionType } from "./activity-log.service"
import { logger } from "../utils/logger"
import type { Loggable } from "../interfaces/loggable.interface"
import type { LogChanges } from "../interfaces/activity-log.interface"

/**
 * Abstract base class for services
 */
export abstract class BaseService {
  protected activityLogService: ActivityLogService

  constructor() {
    this.activityLogService = new ActivityLogService()
  }

  /**
   * Log an activity for an entity
   */
  protected async logActivity(
    entity: Loggable | null,
    action: ActionType,
    userId: number,
    beforeEntity?: Loggable | null,
    metadata?: Record<string, any>,
  ): Promise<void> {
    try {
      if (!entity && !beforeEntity) {
        logger.warn("Cannot log activity: No entity provided")
        return
      }

      // Use the entity that exists (for create/update use the after entity, for delete use the before entity)
      const targetEntity = entity || beforeEntity

      if (!targetEntity) {
        logger.warn("Cannot log activity: No target entity")
        return
      }

      const entityType = targetEntity.getEntityType()
      const entityId = targetEntity.getEntityId()

      // Prepare changes object
      const changes = this.prepareChanges(beforeEntity, entity)

      // Log the activity
      await this.activityLogService.logActivity(entityType, entityId, action, userId, changes, metadata)
    } catch (error) {
      // Just log the error, don't throw - we don't want logging failures to affect the main operation
      logger.error({ err: error }, "Error logging activity")
    }
  }

  /**
   * Prepare changes object by comparing before and after entities
   */
  private prepareChanges(beforeEntity?: Loggable | null, afterEntity?: Loggable | null): LogChanges {
    const changes: LogChanges = {}

    if (beforeEntity) {
      changes.before = beforeEntity.sanitizeForLog()
    }

    if (afterEntity) {
      changes.after = afterEntity.sanitizeForLog()
    }

    return changes
  }
}

