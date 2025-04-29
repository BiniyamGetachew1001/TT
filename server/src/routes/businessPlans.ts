import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all business plans
router.get('/', async (req, res) => {
  try {
    const plans = await prisma.businessPlan.findMany({
      include: {
        bookmarks: true
      }
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch business plans' });
  }
});

// Get a single business plan
router.get('/:id', async (req, res) => {
  try {
    const plan = await prisma.businessPlan.findUnique({
      where: { id: req.params.id },
      include: {
        bookmarks: true
      }
    });
    if (!plan) {
      return res.status(404).json({ error: 'Business plan not found' });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch business plan' });
  }
});

// Create a new business plan
router.post('/', async (req, res) => {
  try {
    const { title, industry, description, coverImage, author, readTime, price, sections, keyFeatures } = req.body;

    // Just use the provided image URL or a placeholder
    let coverImageUrl = coverImage;
    if (coverImage && coverImage.startsWith('data:')) {
      // In a real implementation, we would save the image to a file or cloud storage
      // For now, just use a placeholder image URL
      coverImageUrl = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop&t=${Date.now()}`;
    }

    const newPlan = await prisma.businessPlan.create({
      data: {
        title,
        industry,
        description,
        coverImage: coverImageUrl,
        author,
        readTime,
        price,
        sections,
        keyFeatures
      }
    });

    res.status(201).json(newPlan);
  } catch (error) {
    console.error('Error creating business plan:', error);
    res.status(500).json({ error: 'Failed to create business plan' });
  }
});

// Update a business plan
router.put('/:id', async (req, res) => {
  try {
    const { title, industry, description, coverImage, author, readTime, price, sections, keyFeatures } = req.body;
    const planId = req.params.id;

    // Get the existing plan
    const existingPlan = await prisma.businessPlan.findUnique({
      where: { id: planId }
    });

    if (!existingPlan) {
      return res.status(404).json({ error: 'Business plan not found' });
    }

    // Just use the provided image URL or keep the existing one
    let coverImageUrl = existingPlan.coverImage;
    if (coverImage && coverImage !== existingPlan.coverImage) {
      if (coverImage.startsWith('data:')) {
        // In a real implementation, we would save the image to a file or cloud storage
        // For now, just use a placeholder image URL
        coverImageUrl = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop&t=${Date.now()}`;
      } else {
        coverImageUrl = coverImage;
      }
    }

    const updatedPlan = await prisma.businessPlan.update({
      where: { id: planId },
      data: {
        title,
        industry,
        description,
        coverImage: coverImageUrl,
        author,
        readTime,
        price,
        sections: sections || existingPlan.sections,
        keyFeatures: keyFeatures || existingPlan.keyFeatures,
        updatedAt: new Date()
      }
    });

    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating business plan:', error);
    res.status(500).json({ error: 'Failed to update business plan' });
  }
});

// Delete a business plan
router.delete('/:id', async (req, res) => {
  try {
    const planId = req.params.id;

    // Check if plan exists
    const plan = await prisma.businessPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return res.status(404).json({ error: 'Business plan not found' });
    }

    // Delete related bookmarks first
    await prisma.bookmark.deleteMany({
      where: {
        type: 'business-plan',
        itemId: planId
      }
    });

    // Delete related purchases
    await prisma.purchase.deleteMany({
      where: {
        itemType: 'business-plan',
        itemId: planId
      }
    });

    // Delete the plan
    await prisma.businessPlan.delete({
      where: { id: planId }
    });

    res.json({ message: 'Business plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting business plan:', error);
    res.status(500).json({ error: 'Failed to delete business plan' });
  }
});

export default router;