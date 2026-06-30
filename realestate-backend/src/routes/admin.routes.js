import { Router } from 'express';
import { z } from 'zod';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getStats,
  getUsers,
  updateUser,
  getAllBookings,
  deleteProperty,
  updatePropertyStatus,
  updateBookingStatus,
} from '../controllers/admin.controller.js';

const router = Router();
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id', validate(z.object({
  role: z.enum(['buyer', 'agent', 'admin']).optional(),
  isActive: z.boolean().optional(),
})), updateUser);

router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

router.delete('/properties/:id', deleteProperty);
router.patch('/properties/:id/status', updatePropertyStatus);

export default router;