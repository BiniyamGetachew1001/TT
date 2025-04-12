import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all purchases for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const purchases = await prisma.purchase.findMany({
      where: {
        userId
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverImage: true,
            category: true
          }
        },
        plan: {
          select: {
            id: true,
            title: true,
            industry: true,
            coverImage: true,
            author: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
});

// Get a single purchase
router.get('/:id', async (req, res) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id: req.params.id },
      include: {
        book: true,
        plan: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }
    
    res.json(purchase);
  } catch (error) {
    console.error('Error fetching purchase:', error);
    res.status(500).json({ error: 'Failed to fetch purchase' });
  }
});

// Create a new purchase
router.post('/', async (req, res) => {
  try {
    const { userId, itemType, itemId, amount, currency, status, paymentId } = req.body;
    
    // Check if the item exists
    if (itemType === 'book-summary') {
      const book = await prisma.bookSummary.findUnique({
        where: { id: itemId }
      });
      
      if (!book) {
        return res.status(404).json({ error: 'Book summary not found' });
      }
    } else if (itemType === 'business-plan') {
      const plan = await prisma.businessPlan.findUnique({
        where: { id: itemId }
      });
      
      if (!plan) {
        return res.status(404).json({ error: 'Business plan not found' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid item type' });
    }
    
    // Check if purchase already exists
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId,
        itemType,
        itemId,
        status: 'completed'
      }
    });
    
    if (existingPurchase) {
      return res.status(400).json({ error: 'Item already purchased' });
    }
    
    const newPurchase = await prisma.purchase.create({
      data: {
        userId,
        itemType,
        itemId,
        amount,
        currency: currency || 'USD',
        status,
        paymentId
      }
    });
    
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error('Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
});

// Update a purchase status
router.put('/:id', async (req, res) => {
  try {
    const { status, paymentId } = req.body;
    const purchaseId = req.params.id;
    
    const updatedPurchase = await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        status,
        paymentId,
        updatedAt: new Date()
      }
    });
    
    res.json(updatedPurchase);
  } catch (error) {
    console.error('Error updating purchase:', error);
    res.status(500).json({ error: 'Failed to update purchase' });
  }
});

// Check if user has purchased an item
router.get('/check/:userId/:itemType/:itemId', async (req, res) => {
  try {
    const { userId, itemType, itemId } = req.params;
    
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        itemType,
        itemId,
        status: 'completed'
      }
    });
    
    res.json({
      purchased: !!purchase,
      purchaseDetails: purchase
    });
  } catch (error) {
    console.error('Error checking purchase status:', error);
    res.status(500).json({ error: 'Failed to check purchase status' });
  }
});

export default router;
