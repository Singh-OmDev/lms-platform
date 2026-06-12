import express from 'express';
import { getUserStats, getAdminStats } from '../controllers/analyticsController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticate, getUserStats);
router.get('/admin-stats', authenticate, requireAdmin, getAdminStats);

export default router;
