import type { User } from '@prisma/client';
import bcrypt from 'bcrypt';

import type { RegisterDTO } from '../dtos/auth/register.dto';
import { UserRepository } from '../repos/user.repository';
import { logger } from '../utils/logger';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findByEmail(email);
    } catch (error) {
      logger.error(`Error finding user with email ${email}`, error);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findUserById(id: number): Promise<User | null> {
    try {
      return await this.userRepository.findById(id);
    } catch (error) {
      logger.error(`Error finding user with id ${id}`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: RegisterDTO): Promise<User> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user with hashed password
      return await this.userRepository.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: 'user', // Default role
      });
    } catch (error) {
      logger.error('Error creating user', error);
      throw error;
    }
  }
}
