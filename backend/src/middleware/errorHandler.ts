import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types/api.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: Record<string, unknown>;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: errorCode,
      details: err.details || {}
    }
  };

  console.error('Error:', {
    message: err.message,
    statusCode,
    code: errorCode,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: `Route ${req.method} ${req.url} not found`,
      code: 'ROUTE_NOT_FOUND'
    }
  };

  res.status(404).json(errorResponse);
};
