import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { toggleFavorite, getMyFavorites, checkFavorite } from '../controllers/favorite.controller.js';

const router = Router();

router.post('/:propertyId', protect, toggleFavorite);
router.get( '/',            protect, getMyFavorites);
router.get( '/:propertyId', protect, checkFavorite);

export default router;
