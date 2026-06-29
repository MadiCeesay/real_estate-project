import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import { sendBookingConfirmation, sendBookingStatusUpdate } from '../services/email.service.js';
import { asyncHandler, sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';

// POST /api/v1/bookings
export const createBooking = asyncHandler(async (req, res) => {
  const { propertyId, viewingDate, viewingTime, message } = req.body;

  const property = await Property.findById(propertyId).populate('agent');
  if (!property) throw new AppError('Property not found', 404);
  if (property.status !== 'active') throw new AppError('This property is not available for viewing', 400);

  // Prevent agents from booking their own properties
  if (property.agent._id.toString() === req.user._id.toString()) {
    throw new AppError('You cannot book a viewing for your own property', 400);
  }

  // Check for existing booking conflict on same date/time
  const conflict = await Booking.findOne({
    property: propertyId,
    viewingDate: new Date(viewingDate),
    viewingTime,
    status: { $in: ['pending', 'confirmed'] },
  });
  if (conflict) throw new AppError('This time slot is already booked. Please choose another.', 409);

  const booking = await Booking.create({
    property: propertyId,
    buyer: req.user._id,
    agent: property.agent._id,
    viewingDate: new Date(viewingDate),
    viewingTime,
    message,
  });

  await booking.populate([
    { path: 'property', select: 'title address images' },
    { path: 'buyer', select: 'firstName lastName email phone' },
    { path: 'agent', select: 'firstName lastName email phone' },
  ]);

  // Send email notifications (non-blocking)
  sendBookingConfirmation(booking).catch((err) =>
    console.warn('Booking email failed:', err.message)
  );

  sendCreated(res, { booking }, 'Viewing request submitted successfully');
});

// GET /api/v1/bookings/mine
export const getMyBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { buyer: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('property', 'title address images price type')
      .populate('agent', 'firstName lastName email phone avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);

  sendPaginated(res, bookings, { page: Number(page), limit: Number(limit), total });
});

// GET /api/v1/bookings/agent
export const getAgentBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { agent: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('property', 'title address images price')
      .populate('buyer', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);

  sendPaginated(res, bookings, { page: Number(page), limit: Number(limit), total });
});

// PATCH /api/v1/bookings/:id/status
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const booking = await Booking.findById(req.params.id)
    .populate('property', 'title address')
    .populate('buyer', 'firstName lastName email')
    .populate('agent', 'firstName lastName email');

  if (!booking) throw new AppError('Booking not found', 404);
  if (booking.agent._id.toString() !== req.user._id.toString()) {
    throw new AppError('You can only update bookings for your properties', 403);
  }
  if (booking.status === 'cancelled') {
    throw new AppError('Cannot update a cancelled booking', 400);
  }

  booking.status = status;
  if (notes) booking.notes = notes;
  await booking.save();

  sendBookingStatusUpdate(booking).catch((err) =>
    console.warn('Status email failed:', err.message)
  );

  sendSuccess(res, { booking }, 'Booking status updated');
});

// DELETE /api/v1/bookings/:id
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) throw new AppError('Booking not found', 404);

  const isBuyer = booking.buyer.toString() === req.user._id.toString();
  const isAgent = booking.agent.toString() === req.user._id.toString();

  if (!isBuyer && !isAgent && req.user.role !== 'admin') {
    throw new AppError('You do not have permission to cancel this booking', 403);
  }
  if (booking.status === 'completed') {
    throw new AppError('Cannot cancel a completed booking', 400);
  }

  booking.status = 'cancelled';
  booking.cancelledBy = isBuyer ? 'buyer' : 'agent';
  await booking.save();

  sendSuccess(res, null, 'Booking cancelled successfully');
});
