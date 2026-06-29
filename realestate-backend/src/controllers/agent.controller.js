import Property from '../models/Property.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { asyncHandler, sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/v1/agent/dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const agentId = req.user._id;

  const [
    totalListings,
    activeListings,
    pendingBookings,
    totalBookings,
    viewsData,
    recentBookings,
  ] = await Promise.all([
    Property.countDocuments({ agent: agentId }),
    Property.countDocuments({ agent: agentId, status: 'active' }),
    Booking.countDocuments({ agent: agentId, status: 'pending' }),
    Booking.countDocuments({ agent: agentId }),
    Property.aggregate([
      { $match: { agent: agentId } },
      { $group: { _id: null, totalViews: { $sum: '$views' }, totalFavorites: { $sum: '$favoriteCount' } } },
    ]),
    Booking.find({ agent: agentId })
      .populate('property', 'title images')
      .populate('buyer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  sendSuccess(res, {
    stats: {
      totalListings,
      activeListings,
      pendingBookings,
      totalBookings,
      totalViews: viewsData[0]?.totalViews || 0,
      totalFavorites: viewsData[0]?.totalFavorites || 0,
    },
    recentBookings,
  });
});

// GET /api/v1/agent/listings
export const getMyListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const filter = { agent: req.user._id };
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [properties, total] = await Promise.all([
    Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Property.countDocuments(filter),
  ]);

  sendPaginated(res, properties, { page: Number(page), limit: Number(limit), total });
});

// GET /api/v1/agent/analytics
export const getAgentAnalytics = asyncHandler(async (req, res) => {
  const agentId = req.user._id;

  // Views per property (top 5)
  const topProperties = await Property.find({ agent: agentId })
    .select('title views favoriteCount price status')
    .sort({ views: -1 })
    .limit(5);

  // Bookings by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const bookingsByMonth = await Booking.aggregate([
    { $match: { agent: agentId, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  sendSuccess(res, { topProperties, bookingsByMonth });
});

// PATCH /api/v1/agent/profile
export const updateAgentProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['firstName', 'lastName', 'phone', 'bio', 'agencyName', 'licenseNumber', 'avatar'];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError('User not found', 404);

  sendSuccess(res, { user }, 'Profile updated successfully');
});
