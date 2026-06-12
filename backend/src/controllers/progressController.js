import prisma from '../config/db.js';

export const updateProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { videoId, currentTime } = req.body;

    if (!videoId || currentTime === undefined) {
      return res.status(400).json({ error: 'Please provide videoId and currentTime' });
    }

    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) }
    });

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Calculate completion percentage
    const duration = video.duration;
    let completionPercentage = (currentTime / duration) * 100;
    if (completionPercentage > 100) completionPercentage = 100;

    // A video is marked completed if watched 90% or more
    const isCompleted = completionPercentage >= 90;

    // Check if progress entry already exists
    const existingProgress = await prisma.watchProgress.findUnique({
      where: {
        userId_videoId: {
          userId,
          videoId: parseInt(videoId)
        }
      }
    });

    let progress;
    let newlyCompleted = false;
    let xpEarned = 0;
    let badgesUnlocked = [];

    if (existingProgress) {
      if (!existingProgress.completed && isCompleted) {
        newlyCompleted = true;
      }
      progress = await prisma.watchProgress.update({
        where: { id: existingProgress.id },
        data: {
          currentTime: parseFloat(currentTime),
          completionPercentage,
          completed: existingProgress.completed || isCompleted
        }
      });
    } else {
      if (isCompleted) {
        newlyCompleted = true;
      }
      progress = await prisma.watchProgress.create({
        data: {
          userId,
          videoId: parseInt(videoId),
          currentTime: parseFloat(currentTime),
          completionPercentage,
          completed: isCompleted
        }
      });
    }

    return res.status(200).json({
      progress,
      newlyCompleted
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error updating watch progress' });
  }
};

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const progressList = await prisma.watchProgress.findMany({
      where: { userId },
      include: {
        video: {
          select: {
            title: true,
            category: true,
            thumbnailUrl: true
          }
        }
      }
    });

    return res.status(200).json(progressList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error fetching user progress' });
  }
};
