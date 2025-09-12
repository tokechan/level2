import { Request, Response } from 'express';
import type { components } from '../types/api.js';

type UserResponse = components['schemas']['UserResponse'];
type UsersResponse = components['schemas']['UsersResponse'];
type CreateUserRequest = components['schemas']['CreateUserRequest'];
type UpdateUserRequest = components['schemas']['UpdateUserRequest'];
type PaginationInfo = components['schemas']['PaginationInfo'];
type ErrorResponse = components['schemas']['ErrorResponse'];
import { prisma } from '../lib/prisma.js';
import { CreateUserInput, UpdateUserInput, GetUserParams, GetUsersQuery } from '../schemas/userSchemas.js';
import { transformUser, transformUsers } from '../utils/transformers.js';
import { parseUserId, parseQueryParams } from '../utils/params.js';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit, search } = parseQueryParams(req);

    // Build where clause for search
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } }
      ]
    } : {};

    // Get total count
    const total = await prisma.user.count({ where });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);

    const pagination: PaginationInfo = {
      page,
      limit,
      total,
      totalPages
    };

    const response: UsersResponse = {
      success: true,
      data: transformUsers(users),
      pagination,
      message: 'Users retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: 'Failed to fetch users',
        code: 'FETCH_USERS_ERROR'
      }
    };
    res.status(500).json(errorResponse);
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseUserId(req);

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      };
      res.status(404).json(errorResponse);
      return;
    }

    const response: UserResponse = {
      success: true,
      data: transformUser(user),
      message: 'User retrieved successfully'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: 'Failed to fetch user',
        code: 'FETCH_USER_ERROR'
      }
    };
    res.status(500).json(errorResponse);
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email } = req.body as CreateUserInput;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          message: 'User with this email already exists',
          code: 'USER_ALREADY_EXISTS'
        }
      };
      res.status(409).json(errorResponse);
      return;
    }

    const newUser = await prisma.user.create({
      data: { name, email }
    });

    const response: UserResponse = {
      success: true,
      data: transformUser(newUser),
      message: 'User created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating user:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: 'Failed to create user',
        code: 'CREATE_USER_ERROR'
      }
    };
    res.status(500).json(errorResponse);
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseUserId(req);
    const updateData = req.body as UpdateUserInput;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Check if email is already taken by another user
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email }
      });

      if (emailExists) {
        const errorResponse: ErrorResponse = {
          success: false,
          error: {
            message: 'Email already exists',
            code: 'EMAIL_ALREADY_EXISTS'
          }
        };
        res.status(409).json(errorResponse);
        return;
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    const response: UserResponse = {
      success: true,
      data: transformUser(updatedUser),
      message: 'User updated successfully'
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating user:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: 'Failed to update user',
        code: 'UPDATE_USER_ERROR'
      }
    };
    res.status(500).json(errorResponse);
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseUserId(req);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }
      };
      res.status(404).json(errorResponse);
      return;
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        message: 'Failed to delete user',
        code: 'DELETE_USER_ERROR'
      }
    };
    res.status(500).json(errorResponse);
  }
};
