import { z } from 'zod';

// User validation schemas
export const createUserSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
});

export const updateUserSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .optional(),
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .optional()
}).refine(data => data.name || data.email, {
  message: 'At least one field (name or email) must be provided'
});

export const getUserParamsSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'ID must be a number')
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'ID must be positive')
});

export const getUsersQuerySchema = z.object({
  page: z.string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(val => parseInt(val, 10))
    .refine(val => val >= 1, 'Page must be at least 1')
    .optional()
    .default('1'),
  limit: z.string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(val => parseInt(val, 10))
    .refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default('10'),
  search: z.string()
    .min(1, 'Search term must not be empty')
    .max(100, 'Search term must be less than 100 characters')
    .optional()
});

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>;
