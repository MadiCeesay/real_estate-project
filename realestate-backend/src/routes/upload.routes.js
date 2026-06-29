import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/security.js';
import { upload } from '../utils/upload.js';
import { uploadPropertyImages, deleteImage } from '../controllers/upload.controller.js';

const router = Router();

router.post(
  '/images',
  uploadLimiter,
  protect,
  authorize('agent', 'admin'),
  upload.array('images', 10),
  uploadPropertyImages
);

// publicId is base64-encoded in the URL because it contains slashes
router.delete('/images/:publicId', protect, authorize('agent', 'admin'), deleteImage);

export default router;
