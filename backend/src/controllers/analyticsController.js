import prisma from '../config/db.js';

// Get user specific learning stats & analytics charts data (no gamification)
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total platform videos
    const totalVideos = await prisma.video.count();

    // Progress list
    const userProgress = await prisma.watchProgress.findMany({
      where: { userId }
    });

    const videosCompleted = userProgress.filter(p => p.completed).length;
    const videosInProgress = userProgress.filter(p => !p.completed && p.currentTime > 0).length;

    // Completion Rate calculation
    const overallCompletionRate = totalVideos > 0 
      ? Math.round((videosCompleted / totalVideos) * 100) 
      : 0;

    // Get all videos with categories to calculate category-specific stats
    const allVideos = await prisma.video.findMany({
      select: { id: true, category: true }
    });

    const categoryTotals = {};
    allVideos.forEach(v => {
      categoryTotals[v.category] = (categoryTotals[v.category] || 0) + 1;
    });

    const categoryCompletions = {};
    userProgress.forEach(p => {
      if (p.completed) {
        const video = allVideos.find(v => v.id === p.videoId);
        if (video) {
          categoryCompletions[video.category] = (categoryCompletions[video.category] || 0) + 1;
        }
      }
    });

    // Fetch tests and user submissions to evaluate testStatus
    const tests = await prisma.test.findMany({
      include: {
        submissions: {
          where: { userId }
        }
      }
    });

    const categoryStats = {};
    Object.keys(categoryTotals).forEach(cat => {
      const categoryTest = tests.find(t => t.category === cat);
      let testStatus = 'no_test';
      let submissionId = null;
      let submissionScore = null;
      let submissionFeedback = null;
      
      if (categoryTest) {
        const userSub = categoryTest.submissions[0];
        if (!userSub) {
          testStatus = 'not_taken';
        } else if (userSub.status === 'pending') {
          testStatus = 'pending';
          submissionId = userSub.id;
        } else if (userSub.status === 'graded') {
          testStatus = userSub.passed ? 'passed' : 'failed';
          submissionId = userSub.id;
          submissionScore = userSub.score;
          submissionFeedback = userSub.feedback;
        }
      }

      categoryStats[cat] = {
        total: categoryTotals[cat],
        completed: categoryCompletions[cat] || 0,
        testStatus,
        submissionId,
        submissionScore,
        submissionFeedback
      };
    });

    // Category distribution counts for charts
    const chartCategoryData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value
    }));

    // Weekly learning progress mockup
    const weeklyProgress = [
      { day: 'Mon', hours: 1.2 },
      { day: 'Tue', hours: 0.8 },
      { day: 'Wed', hours: 2.1 },
      { day: 'Thu', hours: 0.5 },
      { day: 'Fri', hours: 1.6 },
      { day: 'Sat', hours: 3.0 },
      { day: 'Sun', hours: 2.2 }
    ];

    // Recent activity logs
    const recentActivities = await prisma.watchProgress.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      include: {
        video: {
          select: {
            title: true,
            category: true
          }
        }
      }
    });

    const formattedActivities = recentActivities.map(activity => ({
      id: activity.id,
      type: activity.completed ? 'completed' : 'progress',
      title: activity.completed ? `Completed course: ${activity.video.title}` : `Watched ${activity.video.title}`,
      category: activity.video.category,
      time: new Date(activity.updatedAt).toLocaleDateString()
    }));

    return res.status(200).json({
      stats: {
        totalVideos,
        videosCompleted,
        videosInProgress,
        completionRate: overallCompletionRate,
        categoryStats
      },
      charts: {
        weeklyProgress,
        categoryDistribution: chartCategoryData
      },
      recentActivities: formattedActivities
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error retrieving user stats' });
  }
};

// Admin stats overview
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalVideos = await prisma.video.count();
    
    // Simple calculation for active users and watch hours
    const watchProgressCount = await prisma.watchProgress.count();
    const activeUsers = await prisma.user.count({
      where: {
        progress: {
          some: {}
        }
      }
    });
    
    // Simulate/mock watch hours (e.g. progress count * 0.5)
    const totalWatchHours = Math.round(watchProgressCount * 0.5) || 12;

    // Engagement trends (user registration charts over months)
    const userGrowth = [
      { month: 'Jan', users: 12 },
      { month: 'Feb', users: 19 },
      { month: 'Mar', users: 32 },
      { month: 'Apr', users: 48 },
      { month: 'May', users: 65 },
      { month: 'Jun', users: totalUsers }
    ];

    // Most viewed videos (mock views using watch progress count)
    const videos = await prisma.video.findMany({
      include: {
        progress: true
      }
    });

    const mostViewedVideos = videos.map(v => {
      const views = v.progress.length;
      const completionRate = views > 0 
        ? Math.round((v.progress.filter(p => p.completed).length / views) * 100)
        : 0;

      return {
        id: v.id,
        title: v.title,
        category: v.category,
        views,
        completionRate,
        uploadDate: new Date(v.createdAt).toLocaleDateString()
      };
    }).sort((a, b) => b.views - a.views).slice(0, 5);

    // Category popularity chart
    const categoryCounts = {};
    videos.forEach(v => {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + v.progress.length;
    });

    const categoryPopularity = Object.entries(categoryCounts).map(([name, value]) => ({
      name,
      value
    }));

    return res.status(200).json({
      stats: {
        totalUsers,
        totalVideos,
        activeUsers,
        watchHours: totalWatchHours
      },
      charts: {
        userGrowth,
        categoryPopularity,
        mostViewedVideos
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error retrieving admin stats' });
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return res.status(500).json({ error: 'Server error retrieving users' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'admin' && role !== 'user') {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const userIdToUpdate = parseInt(id, 10);
    if (isNaN(userIdToUpdate)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Prevent self-demotion
    if (userIdToUpdate === req.user.id && role === 'user') {
      return res.status(400).json({ error: 'You cannot remove your own admin privileges.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userIdToUpdate },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ error: 'Server error updating user role' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userIdToDelete = parseInt(id, 10);
    if (isNaN(userIdToDelete)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Prevent self-deletion
    if (userIdToDelete === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account from the admin dashboard.' });
    }

    await prisma.user.delete({
      where: { id: userIdToDelete }
    });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Server error deleting user' });
  }
};

