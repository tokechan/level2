import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

// Health check route
router.use('/health', healthRoutes);

// User routes
router.use('/users', userRoutes);

export default router;
