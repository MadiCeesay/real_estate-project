import { Router } from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { geocode, nearby, reverse } from '../controllers/maps.controller.js';

const router = Router();

router.get('/geocode', optionalAuth, geocode);
router.get('/nearby', optionalAuth, nearby);
router.get('/reverse', optionalAuth, reverse);

export default router;
