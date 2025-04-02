import { Router } from 'express';

import activityLogRoutes from './activity-log.routes';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import userRoutes from './user.routes';

const router = Router();

// Register all routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/logs', activityLogRoutes);

export { router };
