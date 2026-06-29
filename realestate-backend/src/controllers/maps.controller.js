import { geocodeAddress, getNearbyPlaces, reverseGeocode } from '../services/maps.service.js';
import { asyncHandler, sendSuccess } from '../utils/apiResponse.js';
import { AppError } from '../middleware/errorHandler.js';

// GET /api/v1/maps/geocode?address=...
export const geocode = asyncHandler(async (req, res) => {
  const { address } = req.query;
  if (!address) throw new AppError('address query param is required', 400);

  const result = await geocodeAddress(address);
  sendSuccess(res, result);
});

// GET /api/v1/maps/nearby?lat=&lng=&type=&radius=
export const nearby = asyncHandler(async (req, res) => {
  const { lat, lng, type = 'school', radius = 2000 } = req.query;
  if (!lat || !lng) throw new AppError('lat and lng query params are required', 400);

  const places = await getNearbyPlaces(Number(lat), Number(lng), type, Number(radius));
  sendSuccess(res, { places });
});

// GET /api/v1/maps/reverse?lat=&lng=
export const reverse = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) throw new AppError('lat and lng query params are required', 400);

  const result = await reverseGeocode(Number(lat), Number(lng));
  sendSuccess(res, result);
});
