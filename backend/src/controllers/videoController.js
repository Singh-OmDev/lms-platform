import prisma from '../config/db.js';
import cloudinary from '../config/cloudinary.js';

// Get all videos with search, category filter, completion status, and tags
export const getVideos = async (req, res) => {
  try {
    const { search, category, status, sortBy } = req.query;
    const userId = req.user.id;

    let whereClause = {};

    if (search) {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    // Filter by progress status if requested
    if (status) {
      if (status === 'Completed') {
        whereClause.progress = {
          some: {
            userId,
            completed: true
          }
        };
      } else if (status === 'In Progress') {
        whereClause.progress = {
          some: {
            userId,
            completed: false,
            currentTime: { gt: 0 }
          }
        };
      }
    }

    const orderBy = sortBy === 'Newest' ? { createdAt: 'desc' } : { id: 'asc' };

    const videos = await prisma.video.findMany({
      where: whereClause,
      orderBy,
      include: {
        progress: {
          where: { userId }
        }
      }
    });

    // Format output to return single progress object per video
    const formattedVideos = videos.map(video => {
      const progress = video.progress[0] || null;
      return {
        ...video,
        progress: progress ? {
          currentTime: progress.currentTime,
          completionPercentage: progress.completionPercentage,
          completed: progress.completed
        } : null
      };
    });

    return res.status(200).json(formattedVideos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error retrieving videos' });
  }
};

// Get single video details (with comments, bookmarks, progress)
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const videoId = parseInt(id);

    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        progress: {
          where: { userId }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        bookmarks: {
          where: { userId }
        }
      }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Get related videos (excluding current one, matching same category)
    const relatedVideos = await prisma.video.findMany({
      where: {
        category: video.category,
        id: { not: videoId }
      },
      include: {
        progress: {
          where: { userId }
        }
      },
      take: 10
    });

    const formattedRelated = relatedVideos.map(v => ({
      ...v,
      progress: v.progress[0] || null
    }));

    return res.status(200).json({
      video: {
        ...video,
        progress: video.progress[0] || null,
        bookmarks: video.bookmarks
      },
      relatedVideos: formattedRelated
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error fetching video details' });
  }
};

// Create a new video (Admin Only)
export const createVideo = async (req, res) => {
  try {
    const { title, description, category, videoUrl, thumbnailUrl, duration, difficulty, tags, estimatedTime } = req.body;

    if (!title || !description || !category || !videoUrl || !thumbnailUrl || !duration) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        category,
        videoUrl,
        thumbnailUrl,
        duration: parseInt(duration),
        difficulty: difficulty || 'Beginner',
        tags: tags || '',
        estimatedTime: estimatedTime || `${Math.ceil(duration / 60)} mins`
      }
    });

    // Make sure category exists in database
    const existingCategory = await prisma.category.findUnique({
      where: { name: category }
    });
    if (!existingCategory) {
      await prisma.category.create({
        data: { name: category }
      });
    }

    return res.status(201).json(video);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error creating video' });
  }
};

// Edit a video (Admin Only)
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const videoId = parseInt(id);
    const { title, description, category, videoUrl, thumbnailUrl, duration, difficulty, tags, estimatedTime } = req.body;

    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!existingVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: {
        title: title || existingVideo.title,
        description: description || existingVideo.description,
        category: category || existingVideo.category,
        videoUrl: videoUrl || existingVideo.videoUrl,
        thumbnailUrl: thumbnailUrl || existingVideo.thumbnailUrl,
        duration: duration ? parseInt(duration) : existingVideo.duration,
        difficulty: difficulty || existingVideo.difficulty,
        tags: tags !== undefined ? tags : existingVideo.tags,
        estimatedTime: estimatedTime || existingVideo.estimatedTime
      }
    });

    return res.status(200).json(updatedVideo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error updating video' });
  }
};

// Delete a video (Admin Only)
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const videoId = parseInt(id);

    if (isNaN(videoId)) {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!existingVideo) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await prisma.video.delete({
      where: { id: videoId }
    });

    return res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error deleting video' });
  }
};

// Add Bookmark
export const addBookmark = async (req, res) => {
  try {
    const { videoId, timestamp } = req.body;
    const userId = req.user.id;

    if (!videoId || timestamp === undefined) {
      return res.status(400).json({ error: 'Please provide videoId and timestamp' });
    }

    const bookmark = await prisma.bookmarks.create({
      data: {
        userId,
        videoId: parseInt(videoId),
        timestamp: parseFloat(timestamp)
      }
    });

    return res.status(201).json(bookmark);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error creating bookmark' });
  }
};

// Delete Bookmark
export const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const bookmarkId = parseInt(id);

    if (isNaN(bookmarkId)) {
      return res.status(400).json({ error: 'Invalid bookmark ID' });
    }

    await prisma.bookmarks.delete({
      where: { id: bookmarkId }
    });

    return res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error deleting bookmark' });
  }
};

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { videoId, message } = req.body;
    const userId = req.user.id;

    if (!videoId || !message) {
      return res.status(400).json({ error: 'Please provide videoId and message' });
    }

    const comment = await prisma.comments.create({
      data: {
        userId,
        videoId: parseInt(videoId),
        message
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error posting comment' });
  }
};

// Get Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error fetching categories' });
  }
};

// Create Category (Admin Only)
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Please provide a category name' });
    }

    const category = await prisma.category.create({
      data: { name }
    });

    return res.status(201).json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error creating category' });
  }
};

// Upload video file to Cloudinary (Admin Only)
export const uploadVideoFile = async (req, res) => {
  try {
    // Check if Cloudinary keys are configured in env. Fallback to mock data for development.
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.warn('Cloudinary credentials missing in .env. Falling back to development mock upload.');
      return res.status(200).json({
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=600&auto=format&fit=crop',
        duration: 596
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a video file' });
    }

    // Set up a promise to upload file buffer using upload_stream
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'lms_portal_videos',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const result = await uploadToCloudinary(req.file.buffer);

    // Generate matching JPG thumbnail for the uploaded video from Cloudinary
    const thumbnailUrl = result.secure_url.replace(/\.[^/.]+$/, '.jpg');

    return res.status(200).json({
      videoUrl: result.secure_url,
      thumbnailUrl: thumbnailUrl,
      duration: Math.round(result.duration || 0),
      publicId: result.public_id
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ error: 'Failed to upload video file to Cloudinary' });
  }
};
