import { Request, Response } from 'express';
import { 
  UserResponse, 
  UsersResponse, 
  CreateUserRequest, 
  UpdateUserRequest,
  PaginationInfo 
} from '../types/api.js';

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z'
  }
];

let nextId = 3;

export const getUsers = (req: Request, res: Response): void => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;

  let filteredUsers = mockUsers;

  // Apply search filter
  if (search) {
    filteredUsers = mockUsers.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Calculate pagination
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const pagination: PaginationInfo = {
    page,
    limit,
    total,
    totalPages
  };

  const response: UsersResponse = {
    success: true,
    data: paginatedUsers,
    pagination,
    message: 'Users retrieved successfully'
  };

  res.status(200).json(response);
};

export const getUserById = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const user = mockUsers.find(u => u.id === id);

  if (!user) {
    const errorResponse = {
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
    data: user,
    message: 'User retrieved successfully'
  };

  res.status(200).json(response);
};

export const createUser = (req: Request, res: Response): void => {
  const { name, email }: CreateUserRequest = req.body;

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    const errorResponse = {
      success: false,
      error: {
        message: 'User with this email already exists',
        code: 'USER_ALREADY_EXISTS'
      }
    };
    res.status(409).json(errorResponse);
    return;
  }

  const newUser = {
    id: nextId++,
    name,
    email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  mockUsers.push(newUser);

  const response: UserResponse = {
    success: true,
    data: newUser,
    message: 'User created successfully'
  };

  res.status(201).json(response);
};

export const updateUser = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const { name, email }: UpdateUserRequest = req.body;

  const userIndex = mockUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    const errorResponse = {
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
  if (email && email !== mockUsers[userIndex].email) {
    const existingUser = mockUsers.find(u => u.email === email && u.id !== id);
    if (existingUser) {
      const errorResponse = {
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
  const updatedUser = {
    ...mockUsers[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    updatedAt: new Date().toISOString()
  };

  mockUsers[userIndex] = updatedUser;

  const response: UserResponse = {
    success: true,
    data: updatedUser,
    message: 'User updated successfully'
  };

  res.status(200).json(response);
};

export const deleteUser = (req: Request, res: Response): void => {
  const id = parseInt(req.params.id);
  const userIndex = mockUsers.findIndex(u => u.id === id);

  if (userIndex === -1) {
    const errorResponse = {
      success: false,
      error: {
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      }
    };
    res.status(404).json(errorResponse);
    return;
  }

  mockUsers.splice(userIndex, 1);

  res.status(204).send();
};
