import express from 'express';
import { 
  getArticles, 
  getArticleById, 
  createArticle, 
  updateArticle, 
  deleteArticle 
} from '../controllers/articleController.js';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Publicly readable with optional session check
router.get('/', optionalAuthenticate, getArticles);
router.get('/:id', optionalAuthenticate, getArticleById);

// Admin only management routes
router.post('/', authenticate, requireAdmin, createArticle);
router.put('/:id', authenticate, requireAdmin, updateArticle);
router.delete('/:id', authenticate, requireAdmin, deleteArticle);

export default router;
