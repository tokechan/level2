import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ErrorResponse } from '../types/api.js';

export const validateRequest = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Body validation
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          const errorResponse: ErrorResponse = {
            success: false,
            error: {
              message: 'Validation error',
              code: 'VALIDATION_ERROR',
              details: {
                field: result.error.errors[0].path.join('.'),
                reason: result.error.errors[0].message
              }
            }
          };
          res.status(400).json(errorResponse);
          return;
        }
        req.body = result.data;
      }

      // Query validation
      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          const errorResponse: ErrorResponse = {
            success: false,
            error: {
              message: 'Query validation error',
              code: 'QUERY_VALIDATION_ERROR',
              details: {
                field: result.error.errors[0].path.join('.'),
                reason: result.error.errors[0].message
              }
            }
          };
          res.status(400).json(errorResponse);
          return;
        }
        req.query = result.data;
      }

      // Params validation
      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          const errorResponse: ErrorResponse = {
            success: false,
            error: {
              message: 'Parameter validation error',
              code: 'PARAM_VALIDATION_ERROR',
              details: {
                field: result.error.errors[0].path.join('.'),
                reason: result.error.errors[0].message
              }
            }
          };
          res.status(400).json(errorResponse);
          return;
        }
        req.params = result.data;
      }

      next();
    } catch (err) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_FAILED'
        }
      };
      res.status(500).json(errorResponse);
    }
  };
};