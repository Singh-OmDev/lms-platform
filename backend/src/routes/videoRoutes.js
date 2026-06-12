import express from 'express';
import { 
  getVideos, 
  getVideoById, 
  createVideo, 
  updateVideo, 
  deleteVideo, 
  addBookmark, 
  deleteBookmark, 
  addComment,
  getCategories,
  createCategory,
  uploadVideoFile
} from '../controllers/videoController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Get list of categories
router.get('/categories', authenticate, getCategories);
router.post('/categories', authenticate, requireAdmin, createCategory);

// Video resource endpoints
router.get('/', authenticate, getVideos);
router.get('/:id', authenticate, getVideoById);
router.post('/upload', authenticate, requireAdmin, upload.single('video'), uploadVideoFile);
router.post('/', authenticate, requireAdmin, createVideo);

router.put('/:id', authenticate, requireAdmin, updateVideo);
router.delete('/:id', authenticate, requireAdmin, deleteVideo);

// Bookmarks & Comments
router.post('/bookmarks', authenticate, addBookmark);
router.delete('/bookmarks/:id', authenticate, deleteBookmark);
router.post('/comments', authenticate, addComment);

export default router;
