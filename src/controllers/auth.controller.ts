import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import type { LoginDTO } from '../dtos/auth/login.dto';
import type { RegisterDTO } from '../dtos/auth/register.dto';
import { AuthService } from '../services/auth.service';
import { AuthFailureError, BadRequestError } from '../utils/error.response';
import { CreatedResponse, OkResponse } from '../utils/success.response';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    const userData = req.body as RegisterDTO;

    // Check if user already exists
    const existingUser = await this.authService.findUserByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    // Create new user
    const newUser = await this.authService.createUser(userData);

    // Generate token
    const token = this.generateToken(newUser);

    new CreatedResponse({
      message: 'User registered successfully',
      metadata: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      },
    }).send(res);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginDTO;

    // Find user by email
    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new AuthFailureError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AuthFailureError('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken(user);

    new OkResponse({
      message: 'Login successful',
      metadata: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    }).send(res);
  };

  getCurrentUser = async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AuthFailureError('User not authenticated');
    }

    const user = await this.authService.findUserById(req.user.id);
    if (!user) {
      throw new AuthFailureError('User not found');
    }

    new OkResponse({
      message: 'User retrieved successfully',
      metadata: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    }).send(res);
  };

  private generateToken(user: { id: number; email: string; role: string }) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  }
}
