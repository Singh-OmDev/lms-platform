import prisma from '../config/db.js';

// Get all articles (with optional filters)
export const getArticles = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    const where = {};
    
    // If user is not admin, only show published articles
    if (!req.user || req.user.role !== 'admin') {
      where.published = true;
    }
    
    if (category && category !== 'All') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const articles = await prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ error: 'Server error fetching articles' });
  }
};

// Get single article by ID
export const getArticleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Standard users cannot read unpublished articles
    if (!article.published && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    return res.status(200).json(article);
  } catch (error) {
    console.error('Error fetching article details:', error);
    return res.status(500).json({ error: 'Server error fetching article details' });
  }
};

// Create a new article (Admin Only)
export const createArticle = async (req, res) => {
  try {
    const { title, content, summary, category, imageUrl, published } = req.body;
    const authorId = req.user.id; // From authenticate middleware

    if (!title || !content || !summary || !category) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        summary,
        category,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
        published: published !== undefined ? published : true,
        authorId
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return res.status(201).json(article);
  } catch (error) {
    console.error('Error creating article:', error);
    return res.status(500).json({ error: 'Server error creating article' });
  }
};

// Update an article (Admin Only)
export const updateArticle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const { title, content, summary, category, imageUrl, published } = req.body;

    // Check if exists
    const existing = await prisma.article.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        content: content !== undefined ? content : existing.content,
        summary: summary !== undefined ? summary : existing.summary,
        category: category !== undefined ? category : existing.category,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
        published: published !== undefined ? published : existing.published
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return res.status(200).json(article);
  } catch (error) {
    console.error('Error updating article:', error);
    return res.status(500).json({ error: 'Server error updating article' });
  }
};

// Delete an article (Admin Only)
export const deleteArticle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }

    const existing = await prisma.article.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await prisma.article.delete({
      where: { id }
    });

    return res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    return res.status(500).json({ error: 'Server error deleting article' });
  }
};
