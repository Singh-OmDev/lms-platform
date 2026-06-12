import express from 'express';
import { updateProgress, getProgress } from '../controllers/progressController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, updateProgress);
router.get('/', authenticate, getProgress);

export default router;
