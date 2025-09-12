import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/api.js';

export const validateRequest = (schema: {
  body?: any;
  query?: any;
  params?: any;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Body validation
      if (schema.body) {
        const { error } = schema.body.validate(req.body);
        if (error) {
          const errorResponse: ErrorResponse = {
            success: false,
            error: {
              message: 'Validation error',
              code: 'VALIDATION_ERROR',
              details: {
                field: error.details[0].path.join('.'),
                reason: error.details[0].message
              }
            }
          };
          res.status(400).json(errorResponse);
          return;
        }
      }

      // Query validation
      if (schema.query) {
        const { error } = schema.query.validate(req.query);
        if (error) {
          const errorResponse: ErrorResponse = {
            success: false,
            error: {
              message: 'Query validation error',
              code: 'QUERY_VALIDATION_ERROR',
              details: {
                field: error.details[0].path.join('.'),
                reason: error.details[0].message
              }
            }
          };
          res.status(400).json(errorResponse);
          return;
        }
      }

      // Params validation
      if (schema.params) {
        const { error } = schema.params.validate(req.params);
        if (error) {
          const errorResponse: ErrorResponse = {
            success: false,
            error: {
              message: 'Parameter validation error',
              code: 'PARAM_VALIDATION_ERROR',
              details: {
                field: error.details[0].path.join('.'),
                reason: error.details[0].message
              }
            }
          };
          res.status(400).json(errorResponse);
          return;
        }
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
