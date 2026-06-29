import { Router } from 'express';
import { z } from 'zod';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { getRecommendations, mortgageAdvice } from '../controllers/ai.controller.js';

const router = Router();

const preferencesSchema = z.object({
  preferences: z.object({
    budget: z.number().optional(),
    type: z.enum(['sale', 'rent']).optional(),
    category: z.string().optional(),
    bedrooms: z.number().optional(),
    city: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

const mortgageSchema = z.object({
  propertyPrice: z.number().positive(),
  downPayment: z.number().min(0),
  income: z.number().positive(),
  question: z.string().optional(),
});

router.post('/recommendations', protect, validate(preferencesSchema), getRecommendations);
router.post('/mortgage-advice', protect, validate(mortgageSchema), mortgageAdvice);

export default router;
