import multer from 'multer';

// Use memory storage to stream directly to Cloudinary without writing files to local disk
const storage = multer.memoryStorage();

// Export multer instance with a 100MB limit for video files
export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only accept video mime types
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});
