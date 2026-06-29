import Property from '../models/Property.js';
import { getPropertyRecommendations, getMortgageAdvice } from '../services/ai.service.js';
import { asyncHandler, sendSuccess } from '../utils/apiResponse.js';

// POST /api/v1/ai/recommendations
export const getRecommendations = asyncHandler(async (req, res) => {
  const { preferences } = req.body;

  const properties = await Property.find({ status: 'active' })
    .select('title description price type category bedrooms bathrooms area address amenities')
    .limit(50)
    .lean();

  const recommendations = await getPropertyRecommendations(preferences, properties);
  sendSuccess(res, { recommendations });
});

// POST /api/v1/ai/mortgage-advice
export const mortgageAdvice = asyncHandler(async (req, res) => {
  const advice = await getMortgageAdvice(req.body);
  sendSuccess(res, { advice });
});
