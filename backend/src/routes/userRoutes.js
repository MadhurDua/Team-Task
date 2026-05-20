import { Router } from 'express';
import { listUsers, updateProfile } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

export const userRoutes = Router();

userRoutes.use(protect);
userRoutes.get('/', restrictTo('admin'), listUsers);
userRoutes.patch('/me', updateProfile);
