import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { supabase } from '../lib/supabase';

const router = Router();
const prisma = new PrismaClient();

// Get all book summaries
router.get('/', async (req, res) => {
  try {
    const summaries = await prisma.bookSummary.findMany({
      include: {
        bookmarks: true
      }
    });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book summaries' });
  }
});

// Get a single book summary
router.get('/:id', async (req, res) => {
  try {
    const summary = await prisma.bookSummary.findUnique({
      where: { id: req.params.id },
      include: {
        bookmarks: true
      }
    });
    if (!summary) {
      return res.status(404).json({ error: 'Book summary not found' });
    }
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book summary' });
  }
});

// Create a new book summary
router.post('/', async (req, res) => {
  try {
    const { title, author, description, coverImage, readTime, category, summary, keyPoints, price } = req.body;

    // Store cover image in Supabase Storage if provided
    let coverImageUrl = coverImage;
    if (coverImage && coverImage.startsWith('data:')) {
      const { data, error } = await supabase.storage
        .from('book-covers')
        .upload(`${Date.now()}-${title.replace(/\s+/g, '-').toLowerCase()}.jpg`, coverImage);

      if (error) throw error;
      coverImageUrl = data.path;
    }

    const newSummary = await prisma.bookSummary.create({
      data: {
        title,
        author,
        description,
        coverImage: coverImageUrl,
        readTime,
        category,
        summary,
        keyPoints,
        price: price || 0
      }
    });

    res.status(201).json(newSummary);
  } catch (error) {
    console.error('Error creating book summary:', error);
    res.status(500).json({ error: 'Failed to create book summary' });
  }
});

// Update a book summary
router.put('/:id', async (req, res) => {
  try {
    const { title, author, description, coverImage, readTime, category, summary, keyPoints, price } = req.body;
    const summaryId = req.params.id;

    // Get the existing summary
    const existingSummary = await prisma.bookSummary.findUnique({
      where: { id: summaryId }
    });

    if (!existingSummary) {
      return res.status(404).json({ error: 'Book summary not found' });
    }

    // Store cover image in Supabase Storage if provided and different from existing
    let coverImageUrl = existingSummary.coverImage;
    if (coverImage && coverImage !== existingSummary.coverImage) {
      if (coverImage.startsWith('data:')) {
        const { data, error } = await supabase.storage
          .from('book-covers')
          .upload(`${Date.now()}-${title.replace(/\s+/g, '-').toLowerCase()}.jpg`, coverImage);

        if (error) throw error;
        coverImageUrl = data.path;
      } else {
        coverImageUrl = coverImage;
      }
    }

    const updatedSummary = await prisma.bookSummary.update({
      where: { id: summaryId },
      data: {
        title,
        author,
        description,
        coverImage: coverImageUrl,
        readTime,
        category,
        summary,
        keyPoints: keyPoints || existingSummary.keyPoints,
        price: price !== undefined ? price : existingSummary.price,
        updatedAt: new Date()
      }
    });

    res.json(updatedSummary);
  } catch (error) {
    console.error('Error updating book summary:', error);
    res.status(500).json({ error: 'Failed to update book summary' });
  }
});

// Delete a book summary
router.delete('/:id', async (req, res) => {
  try {
    const summaryId = req.params.id;

    // Check if summary exists
    const summary = await prisma.bookSummary.findUnique({
      where: { id: summaryId }
    });

    if (!summary) {
      return res.status(404).json({ error: 'Book summary not found' });
    }

    // Delete related bookmarks first
    await prisma.bookmark.deleteMany({
      where: {
        type: 'book-summary',
        itemId: summaryId
      }
    });

    // Delete related purchases
    await prisma.purchase.deleteMany({
      where: {
        itemType: 'book-summary',
        itemId: summaryId
      }
    });

    // Delete the summary
    await prisma.bookSummary.delete({
      where: { id: summaryId }
    });

    res.json({ message: 'Book summary deleted successfully' });
  } catch (error) {
    console.error('Error deleting book summary:', error);
    res.status(500).json({ error: 'Failed to delete book summary' });
  }
});

export default router;