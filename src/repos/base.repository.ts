import type { PrismaClient } from '@prisma/client';

import prisma from '../lib/prisma';
import { logger } from '../utils/logger';

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected prisma: PrismaClient;
  protected model: any;
  protected modelName: string;

  constructor(model: any, modelName: string) {
    this.prisma = prisma;
    this.model = model;
    this.modelName = modelName;
  }

  /**
   * Find all records
   */
  async findAll(
    options: {
      where?: any;
      select?: any;
      include?: any;
      orderBy?: any;
      skip?: number;
      take?: number;
    } = {}
  ): Promise<T[]> {
    try {
      return await this.model.findMany(options);
    } catch (error) {
      logger.error(
        { err: error, modelName: this.modelName },
        `Error finding all ${this.modelName}`
      );
      throw error;
    }
  }

  /**
   * Find record by ID
   */
  async findById(
    id: number,
    options: {
      select?: any;
      include?: any;
    } = {}
  ): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
        ...options,
      });
    } catch (error) {
      logger.error(
        { err: error, id, modelName: this.modelName },
        `Error finding ${this.modelName} with id ${id}`
      );
      throw error;
    }
  }

  /**
   * Find one record by criteria
   */
  async findOne(
    where: any,
    options: {
      select?: any;
      include?: any;
    } = {}
  ): Promise<T | null> {
    try {
      return await this.model.findFirst({
        where,
        ...options,
      });
    } catch (error) {
      logger.error(
        { err: error, where, modelName: this.modelName },
        `Error finding ${this.modelName}`
      );
      throw error;
    }
  }

  /**
   * Create a new record
   */
  async create(data: CreateInput): Promise<T> {
    try {
      return await this.model.create({
        data,
      });
    } catch (error) {
      logger.error({ err: error, modelName: this.modelName }, `Error creating ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Update a record
   */
  async update(id: number, data: UpdateInput): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error(
        { err: error, id, modelName: this.modelName },
        `Error updating ${this.modelName} with id ${id}`
      );
      throw error;
    }
  }

  /**
   * Delete a record
   */
  async delete(id: number): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      logger.error(
        { err: error, id, modelName: this.modelName },
        `Error deleting ${this.modelName} with id ${id}`
      );
      throw error;
    }
  }

  /**
   * Count records
   */
  async count(where: any = {}): Promise<number> {
    try {
      return await this.model.count({
        where,
      });
    } catch (error) {
      logger.error(
        { err: error, where, modelName: this.modelName },
        `Error counting ${this.modelName}`
      );
      throw error;
    }
  }

  /**
   * Check if record exists
   */
  async exists(where: any): Promise<boolean> {
    try {
      const count = await this.model.count({
        where,
      });
      return count > 0;
    } catch (error) {
      logger.error(
        { err: error, where, modelName: this.modelName },
        `Error checking if ${this.modelName} exists`
      );
      throw error;
    }
  }

  /**
   * Execute transaction
   */
  async transaction<R>(fn: (tx: any) => Promise<R>): Promise<R> {
    try {
      return await this.prisma.$transaction(fn);
    } catch (error) {
      logger.error(
        { err: error, modelName: this.modelName },
        `Error in transaction for ${this.modelName}`
      );
      throw error;
    }
  }
}
