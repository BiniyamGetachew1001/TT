import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { supabase } from '../lib/supabase';

const router = Router();
const prisma = new PrismaClient();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    
    // Build filter conditions
    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    if (status) {
      where.status = status;
    } else {
      // By default, only return published posts for public API
      where.status = 'published';
    }
    
    const posts = await prisma.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bookmarks: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    });
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get a single blog post
router.get('/:id', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bookmarks: true
      }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Only return published posts unless explicitly requesting a draft
    if (post.status !== 'published' && req.query.includeUnpublished !== 'true') {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, authorId, category, tags, status } = req.body;
    
    // Store cover image in Supabase Storage if provided
    let coverImageUrl = coverImage;
    if (coverImage && coverImage.startsWith('data:')) {
      const { data, error } = await supabase.storage
        .from('blog-covers')
        .upload(`${Date.now()}-${title.replace(/\s+/g, '-').toLowerCase()}.jpg`, coverImage);
      
      if (error) throw error;
      coverImageUrl = data.path;
    }
    
    const publishedAt = status === 'published' ? new Date() : null;
    
    const newPost = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt,
        coverImage: coverImageUrl,
        authorId,
        category,
        tags: tags || [],
        status,
        publishedAt
      }
    });
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, category, tags, status } = req.body;
    const postId = req.params.id;
    
    // Get the existing post
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId }
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Store cover image in Supabase Storage if provided and different from existing
    let coverImageUrl = existingPost.coverImage;
    if (coverImage && coverImage !== existingPost.coverImage) {
      if (coverImage.startsWith('data:')) {
        const { data, error } = await supabase.storage
          .from('blog-covers')
          .upload(`${Date.now()}-${title.replace(/\s+/g, '-').toLowerCase()}.jpg`, coverImage);
        
        if (error) throw error;
        coverImageUrl = data.path;
      } else {
        coverImageUrl = coverImage;
      }
    }
    
    // Set publishedAt if status is changing to published
    const publishedAt = 
      status === 'published' && existingPost.status !== 'published' 
        ? new Date() 
        : existingPost.publishedAt;
    
    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title,
        content,
        excerpt,
        coverImage: coverImageUrl,
        category,
        tags: tags || existingPost.tags,
        status,
        publishedAt,
        updatedAt: new Date()
      }
    });
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Check if post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Delete related bookmarks first
    await prisma.bookmark.deleteMany({
      where: {
        type: 'blog-post',
        itemId: postId
      }
    });
    
    // Delete the post
    await prisma.blogPost.delete({
      where: { id: postId }
    });
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;
