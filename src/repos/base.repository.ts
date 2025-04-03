/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrismaClient } from '@prisma/client';

import prisma from '../lib/prisma';
import { logger } from '../utils/logger';

export type PrismaModel<T = any> = {
  findMany: (...args: any[]) => Promise<T[]>;
  findUnique: (...args: any[]) => Promise<T | null>;
  findFirst: (...args: any[]) => Promise<T | null>;
  create: (...args: any[]) => Promise<T>;
  update: (...args: any[]) => Promise<T>;
  delete: (...args: any[]) => Promise<T>;
  count: (...args: any[]) => Promise<number>;
} & Record<string, any>;

export abstract class BaseRepository<
  T,
  CreateInput extends Record<string, unknown>,
  UpdateInput extends Record<string, unknown>,
> {
  protected prisma: PrismaClient;
  protected model: PrismaModel<T>;
  protected modelName: string;

  constructor(model: PrismaModel<T>, modelName: string) {
    this.prisma = prisma;
    this.model = model;
    this.modelName = modelName;
  }

  /**
   * Find all records
   */
  async findAll(
    options: {
      where?: Record<string, unknown>;
      select?: Record<string, unknown>;
      include?: Record<string, unknown>;
      orderBy?: Record<string, unknown>;
      skip?: number;
      take?: number;
    } = {}
  ): Promise<T[]> {
    try {
      return await this.model.findMany(options);
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          modelName: this.modelName,
        },
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
      select?: Record<string, unknown>;
      include?: Record<string, unknown>;
    } = {}
  ): Promise<T | null> {
    try {
      return (await this.model.findUnique({
        where: { id },
        ...options,
      })) as T | null;
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          id,
          modelName: this.modelName,
        },
        `Error finding ${this.modelName} with id ${id}`
      );
      throw error;
    }
  }

  /**
   * Find one record by criteria
   */
  async findOne(
    where: Record<string, unknown>,
    options: {
      select?: Record<string, unknown>;
      include?: Record<string, unknown>;
    } = {}
  ): Promise<T | null> {
    try {
      return (await this.model.findFirst({
        where,
        ...options,
      })) as T | null;
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          where,
          modelName: this.modelName,
        },
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
      return (await this.model.create({
        data: data as Record<string, unknown>,
      })) as T;
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          modelName: this.modelName,
        },
        `Error creating ${this.modelName}`
      );
      throw error;
    }
  }

  /**
   * Update a record
   */
  async update(id: number, data: UpdateInput): Promise<T> {
    try {
      return (await this.model.update({
        where: { id },
        data: data as Record<string, unknown>,
      })) as T;
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          id,
          modelName: this.modelName,
        },
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
      return (await this.model.delete({
        where: { id },
      })) as T;
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          id,
          modelName: this.modelName,
        },
        `Error deleting ${this.modelName} with id ${id}`
      );
      throw error;
    }
  }

  /**
   * Count records
   */
  async count(where: Record<string, unknown> = {}): Promise<number> {
    try {
      return await this.model.count({
        where,
      });
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          where,
          modelName: this.modelName,
        },
        `Error counting ${this.modelName}`
      );
      throw error;
    }
  }

  /**
   * Check if record exists
   */
  async exists(where: Record<string, unknown>): Promise<boolean> {
    try {
      const count = await this.model.count({
        where,
      });
      return count > 0;
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          where,
          modelName: this.modelName,
        },
        `Error checking if ${this.modelName} exists`
      );
      throw error;
    }
  }

  /**
   * Execute transaction
   */
  async transaction<R>(
    fn: (
      tx: Omit<
        PrismaClient,
        '$on' | '$connect' | '$disconnect' | '$use' | '$transaction' | '$extends'
      >
    ) => Promise<R>
  ): Promise<R> {
    try {
      return await this.prisma.$transaction(fn);
    } catch (error: unknown) {
      logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          modelName: this.modelName,
        },
        `Error in transaction for ${this.modelName}`
      );
      throw error;
    }
  }
}
