import Property from '../models/Property.js';
import Favorite from '../models/Favorite.js';
import { asyncHandler, sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';

// ── Build sort object from query param ───────────────────────────────────────
const getSortObj = (sort) => {
  const map = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    most_viewed: { views: -1 },
  };
  return map[sort] || { createdAt: -1 };
};

// GET /api/v1/properties
export const getProperties = asyncHandler(async (req, res) => {
  const {
    page, limit, search, city, type, category,
    minPrice, maxPrice, bedrooms, bathrooms,
    minArea, maxArea, amenities, sort,
    lat, lng, radius, status, isFeatured,
  } = req.query;

  const filter = {};

  if (status) {
    if (status === 'all' && req.user?.role === 'admin') {
      // Admin can request all statuses explicitly.
    } else if (['active', 'pending', 'sold', 'rented'].includes(status) && req.user?.role === 'admin') {
      filter.status = status;
    } else {
      filter.status = 'active';
    }
  } else if (req.user?.role !== 'admin') {
    filter.status = 'active';
  }

  if (isFeatured !== undefined) {
    filter.isFeatured = isFeatured;
  }

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (city) filter['address.city'] = new RegExp(city, 'i');
  if (bedrooms !== undefined) filter.bedrooms = { $gte: Number(bedrooms) };
  if (bathrooms !== undefined) filter.bathrooms = { $gte: Number(bathrooms) };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (minArea || maxArea) {
    filter.area = {};
    if (minArea) filter.area.$gte = Number(minArea);
    if (maxArea) filter.area.$lte = Number(maxArea);
  }
  if (amenities) {
    filter.amenities = { $all: amenities.split(',').map((a) => a.trim()) };
  }
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { 'address.city': new RegExp(search, 'i') },
    ];
  }

  // Geospatial: nearby search overrides standard filter
  if (lat && lng && radius) {
    filter.location = {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius) * 1000, // km to metres
      },
    };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate('agent', 'firstName lastName email phone avatar agencyName')
      .sort(getSortObj(sort))
      .skip(skip)
      .limit(Number(limit)),
    Property.countDocuments(filter),
  ]);

  // Annotate each property with isFavorited if user is logged in
  const userId = req.user?._id;
  const data = await Promise.all(
    properties.map(async (p) => ({
      ...p.toJSON(),
      isFavorited: await Favorite.isFavorited(userId, p._id),
    }))
  );

  sendPaginated(res, data, { page: Number(page), limit: Number(limit), total });
});

// GET /api/v1/properties/:id
export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    'agent',
    'firstName lastName email phone avatar agencyName licenseNumber bio'
  );
  if (!property) throw new AppError('Property not found', 404);

  // Increment view count (fire and forget — don't await)
  Property.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

  const isFavorited = await Favorite.isFavorited(req.user?._id, property._id);

  sendSuccess(res, { property: { ...property.toJSON(), isFavorited } });
});

// POST /api/v1/properties
export const createProperty = asyncHandler(async (req, res) => {
  const { coordinates, ...rest } = req.body;

  const property = await Property.create({
    ...rest,
    agent: req.user._id,
    location: {
      type: 'Point',
      coordinates: [coordinates.lng, coordinates.lat], // GeoJSON: [lng, lat]
    },
  });

  sendCreated(res, { property }, 'Property listed successfully');
});

// PUT /api/v1/properties/:id
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new AppError('Property not found', 404);

  // Only the owning agent or admin can update
  if (
    property.agent.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('You do not have permission to update this property', 403);
  }

  const { coordinates, ...rest } = req.body;
  if (coordinates) {
    rest.location = {
      type: 'Point',
      coordinates: [coordinates.lng, coordinates.lat],
    };
  }

  const updated = await Property.findByIdAndUpdate(req.params.id, rest, {
    new: true,
    runValidators: true,
  });

  sendSuccess(res, { property: updated }, 'Property updated successfully');
});

// DELETE /api/v1/properties/:id
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) throw new AppError('Property not found', 404);

  if (
    property.agent.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('You do not have permission to delete this property', 403);
  }

  if (req.user.role === 'admin') {
    await property.deleteOne();
    return sendSuccess(res, null, 'Property deleted successfully');
  }

  await Property.findByIdAndUpdate(req.params.id, { status: 'pending' });
  sendSuccess(res, null, 'Property removed from listings');
});

// GET /api/v1/properties/nearby?lat=X&lng=Y&radius=5
export const getNearbyProperties = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  if (!lat || !lng) throw new AppError('lat and lng query params are required', 400);

  const properties = await Property.find({
    status: 'active',
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radius) * 1000,
      },
    },
  })
    .limit(20)
    .populate('agent', 'firstName lastName avatar');

  sendSuccess(res, { properties, count: properties.length });
});
