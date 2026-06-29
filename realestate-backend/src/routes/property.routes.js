import { Router } from 'express';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPropertySchema, updatePropertySchema } from '../validators/property.js';
import { searchQuerySchema } from '../validators/query.js';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getNearbyProperties,
} from '../controllers/property.controller.js';

const router = Router();

// Public routes (optionalAuth annotates isFavorited for logged-in users)
router.get('/',        optionalAuth, validate(searchQuerySchema, 'query'), getProperties);
router.get('/nearby',  optionalAuth, getNearbyProperties);
router.get('/:id',     optionalAuth, getPropertyById);

// Protected routes — agents and admins only
router.post(  '/',    protect, authorize('agent', 'admin'), validate(createPropertySchema), createProperty);
router.put(   '/:id', protect, authorize('agent', 'admin'), validate(updatePropertySchema), updateProperty);
router.delete('/:id', protect, authorize('agent', 'admin'),                                deleteProperty);

export default router;
