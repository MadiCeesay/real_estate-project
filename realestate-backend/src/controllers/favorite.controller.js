import Favorite from '../models/Favorite.js';
import Property from '../models/Property.js';
import { asyncHandler, sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';

// POST /api/v1/favorites/:propertyId  — toggle add/remove
export const toggleFavorite = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);
  if (!property) throw new AppError('Property not found', 404);

  const existing = await Favorite.findOne({ user: req.user._id, property: propertyId });

  if (existing) {
    await existing.deleteOne();
    await Property.findByIdAndUpdate(propertyId, { $inc: { favoriteCount: -1 } });
    return sendSuccess(res, { isFavorited: false }, 'Removed from favorites');
  }

  await Favorite.create({ user: req.user._id, property: propertyId });
  await Property.findByIdAndUpdate(propertyId, { $inc: { favoriteCount: 1 } });
  sendSuccess(res, { isFavorited: true }, 'Added to favorites');
});

// GET /api/v1/favorites
export const getMyFavorites = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [favorites, total] = await Promise.all([
    Favorite.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'agent', select: 'firstName lastName avatar' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Favorite.countDocuments({ user: req.user._id }),
  ]);

  const properties = favorites.map((f) => f.property);
  sendPaginated(res, properties, { page: Number(page), limit: Number(limit), total });
});

// GET /api/v1/favorites/:propertyId  — check status
export const checkFavorite = asyncHandler(async (req, res) => {
  const isFavorited = await Favorite.isFavorited(req.user._id, req.params.propertyId);
  sendSuccess(res, { isFavorited });
});
