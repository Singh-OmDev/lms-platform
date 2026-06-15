import express from 'express';
import { 
  getTestByCategory, 
  submitTest, 
  adminGetTests, 
  adminUpsertTest, 
  adminGetSubmissions, 
  adminGradeSubmission 
} from '../controllers/testController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student Routes
router.get('/:category', authenticate, getTestByCategory);
router.post('/:category/submit', authenticate, submitTest);

// Admin Routes (Configuring Tests and Grading Submissions)
router.get('/admin/config', authenticate, requireAdmin, adminGetTests);
router.post('/admin/config', authenticate, requireAdmin, adminUpsertTest);
router.get('/admin/submissions', authenticate, requireAdmin, adminGetSubmissions);
router.post('/admin/submissions/:id/grade', authenticate, requireAdmin, adminGradeSubmission);

export default router;
