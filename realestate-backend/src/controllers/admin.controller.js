import User from '../models/User.js';
import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import { asyncHandler, sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/v1/admin/stats
export const getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProperties,
    pendingApprovals,
    totalBookings,
    activeListings,
    totalAgents,
  ] = await Promise.all([
    User.countDocuments(),
    Property.countDocuments(),
    Property.countDocuments({ status: 'pending' }),
    Booking.countDocuments(),
    Property.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'agent' }),
  ]);

  sendSuccess(res, {
    totalUsers,
    totalProperties,
    pendingApprovals,
    totalBookings,
    activeListings,
    totalAgents,
  });
});

// GET /api/v1/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;
  const filter = {};

  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshToken -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  sendPaginated(res, users, { page: Number(page), limit: Number(limit), total });
});

// PATCH /api/v1/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const { role, isActive } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) throw new AppError('User not found', 404);
  if (user._id.toString() === req.user._id.toString() && isActive === false) {
    throw new AppError('You cannot deactivate your own account', 400);
  }
  if (user._id.toString() === req.user._id.toString() && role && role !== 'admin') {
    throw new AppError('You cannot change your own admin role', 400);
  }

  if (role !== undefined) {
    if (!['buyer', 'agent', 'admin'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }
    user.role = role;
  }
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  const safeUser = user.toJSON();
  delete safeUser.password;
  sendSuccess(res, { user: safeUser }, 'User updated successfully');
});

// GET /api/v1/admin/bookings
export const getAllBookings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('property', 'title address images price')
      .populate('buyer', 'firstName lastName email phone')
      .populate('agent', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Booking.countDocuments(filter),
  ]);

  sendPaginated(res, bookings, { page: Number(page), limit: Number(limit), total });
});
