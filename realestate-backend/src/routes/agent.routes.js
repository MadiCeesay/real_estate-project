import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import {
  getDashboardStats,
  getMyListings,
  getAgentAnalytics,
  updateAgentProfile,
} from '../controllers/agent.controller.js';

const router = Router();

// All agent routes require authentication and agent/admin role
router.use(protect, authorize('agent', 'admin'));

router.get(  '/dashboard', getDashboardStats);
router.get(  '/listings',  getMyListings);
router.get(  '/analytics', getAgentAnalytics);
router.patch('/profile',   updateAgentProfile);

export default router;
