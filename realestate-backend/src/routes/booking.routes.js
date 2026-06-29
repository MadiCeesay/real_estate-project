import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createBookingSchema, updateBookingStatusSchema } from '../validators/booking.js';
import {
  createBooking,
  getMyBookings,
  getAgentBookings,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/booking.controller.js';

const router = Router();

router.post('/',              protect,                          validate(createBookingSchema), createBooking);
router.get( '/mine',          protect,                          getMyBookings);
router.get( '/agent',         protect, authorize('agent', 'admin'), getAgentBookings);
router.patch('/:id/status',   protect, authorize('agent', 'admin'), validate(updateBookingStatusSchema), updateBookingStatus);
router.delete('/:id',         protect,                          cancelBooking);

export default router;
