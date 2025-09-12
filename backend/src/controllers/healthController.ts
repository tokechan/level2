import { Request, Response } from 'express';
import type { components } from '../types/api.js';

type HealthResponse = components['schemas']['HealthResponse'];

export const healthCheck = (req: Request, res: Response): void => {
  const healthResponse: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime()
  };

  res.status(200).json(healthResponse);
};
