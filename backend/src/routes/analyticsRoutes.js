import express from 'express';
import { 
  getUserStats, 
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  deleteUser
} from '../controllers/analyticsController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticate, getUserStats);
router.get('/admin-stats', authenticate, requireAdmin, getAdminStats);
router.get('/admin/users', authenticate, requireAdmin, getAdminUsers);
router.put('/admin/users/:id/role', authenticate, requireAdmin, updateUserRole);
router.delete('/admin/users/:id', authenticate, requireAdmin, deleteUser);

export default router;
