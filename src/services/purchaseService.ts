import api from './api';
import { mockSummaries, mockBusinessPlans } from '../data/mockData';

// Define Purchase type locally since we removed the Supabase import
export type Purchase = {
  id: string;
  user_id: string;
  item_type: 'book-summary' | 'business-plan';
  item_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'refunded' | 'cancelled';
  payment_id: string;
  created_at: string;
  updated_at?: string;
  book_summary?: any;
  business_plan?: any;
  user?: any;
};

export const purchaseBook = async (userId: string, bookId: string, amount: number) => {
  try {
    const response = await api.post('/api/purchases', {
      userId,
      itemType: 'book-summary',
      itemId: bookId,
      amount,
      currency: 'USD',
      status: 'completed', // In a real implementation, this would be 'pending' until payment confirmation
      paymentId: `sim_${Date.now()}` // Simulated payment ID
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to process purchase'
    };
  }
};

export const purchaseBusinessPlan = async (userId: string, planId: string, amount: number) => {
  try {
    const response = await api.post('/api/purchases', {
      userId,
      itemType: 'business-plan',
      itemId: planId,
      amount,
      currency: 'USD',
      status: 'completed', // In a real implementation, this would be 'pending' until payment confirmation
      paymentId: `sim_${Date.now()}` // Simulated payment ID
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to process purchase'
    };
  }
};

export const getUserPurchases = async (userId: string) => {
  // If userId is undefined or null, return empty array
  if (!userId) {
    console.warn('getUserPurchases called with undefined or null userId');
    return {
      success: true,
      data: []
    };
  }

  try {
    console.log('Using mock data for user purchases');

    // Create mock purchases from the first 2 book summaries and 1 business plan
    const mockBookPurchases = mockSummaries.slice(0, 2).map(summary => ({
      id: `purchase-${summary.id}`,
      user_id: userId,
      item_type: 'book-summary',
      item_id: summary.id.toString(),
      amount: summary.isPremium ? 9.99 : 0,
      currency: 'USD',
      status: 'completed',
      payment_id: `mock-payment-${summary.id}`,
      created_at: new Date().toISOString(),
      book_summary: {
        id: summary.id.toString(),
        title: summary.title,
        author: summary.author,
        cover_image: summary.coverImage,
        category: summary.category
      }
    }));

    const mockBusinessPlanPurchases = mockBusinessPlans.slice(0, 1).map(plan => ({
      id: `purchase-bp-${plan.id}`,
      user_id: userId,
      item_type: 'business-plan',
      item_id: plan.id.toString(),
      amount: plan.isPremium ? plan.price : 0,
      currency: 'USD',
      status: 'completed',
      payment_id: `mock-payment-bp-${plan.id}`,
      created_at: new Date().toISOString(),
      business_plan: {
        id: plan.id.toString(),
        title: plan.title,
        industry: plan.industry,
        cover_image: plan.coverImage
      }
    }));

    // Combine both types of purchases
    const mockPurchases = [...mockBookPurchases, ...mockBusinessPlanPurchases];

    // Sort by created_at in descending order
    mockPurchases.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return {
      success: true,
      data: mockPurchases
    };
  } catch (error: any) {
    console.error('Error fetching user purchases:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch user purchases',
      data: []
    };
  }
};

export const checkPurchaseStatus = async (userId: string, itemType: string, itemId: string) => {
  // If userId is undefined or null, return not purchased
  if (!userId) {
    console.warn('checkPurchaseStatus called with undefined or null userId');
    return {
      success: true,
      purchased: false,
      data: null
    };
  }

  try {
    console.log('Using mock data for purchase status check');

    // For demo purposes, let's say the first 2 books and first business plan are purchased
    const mockId = parseInt(itemId, 10);
    const isPurchased = (itemType === 'book-summary' && mockId <= 2) ||
                        (itemType === 'business-plan' && mockId === 1);

    return {
      success: true,
      purchased: isPurchased,
      data: isPurchased ? {
        id: `mock-purchase-${itemType}-${itemId}`,
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        amount: 9.99,
        currency: 'USD',
        status: 'completed',
        payment_id: `mock-payment-${itemId}`,
        created_at: new Date().toISOString()
      } : null
    };
  } catch (error: any) {
    console.error('Error checking purchase status:', error);
    return {
      success: false,
      purchased: false,
      message: error.message || 'Failed to check purchase status',
      data: null
    };
  }
};

// For backward compatibility with code that might still use the mock functions
export const getMockUserPurchases = async (userId: string) => {
  return await getUserPurchases(userId);
};

export const getMockPurchaseStatus = async (userId: string, itemType: string, itemId: string) => {
  return await checkPurchaseStatus(userId, itemType, itemId);
};

// Admin functions
export const getAllPurchases = async () => {
  try {
    console.log('Using mock data for all purchases');

    // Create mock purchases
    const mockBookPurchases = mockSummaries.slice(0, 3).map((summary, index) => ({
      id: `purchase-book-${index}`,
      user_id: `user-${index % 3 + 1}`,
      item_type: 'book-summary',
      item_id: summary.id.toString(),
      amount: summary.isPremium ? 9.99 : 0,
      currency: 'USD',
      status: ['completed', 'pending', 'refunded'][index % 3],
      payment_id: `mock-payment-${index}`,
      created_at: new Date(Date.now() - index * 86400000).toISOString(),
      user: {
        email: `user${index % 3 + 1}@example.com`,
        name: `User ${index % 3 + 1}`
      },
      book_summary: {
        id: summary.id.toString(),
        title: summary.title,
        author: summary.author,
        category: summary.category
      },
      business_plan: null
    }));

    const mockBusinessPlanPurchases = mockBusinessPlans.slice(0, 2).map((plan, index) => ({
      id: `purchase-bp-${index}`,
      user_id: `user-${index % 3 + 1}`,
      item_type: 'business-plan',
      item_id: plan.id.toString(),
      amount: plan.isPremium ? plan.price : 0,
      currency: 'USD',
      status: ['completed', 'pending', 'refunded'][index % 3],
      payment_id: `mock-payment-bp-${index}`,
      created_at: new Date(Date.now() - (index + 3) * 86400000).toISOString(),
      user: {
        email: `user${index % 3 + 1}@example.com`,
        name: `User ${index % 3 + 1}`
      },
      book_summary: null,
      business_plan: {
        id: plan.id.toString(),
        title: plan.title,
        industry: plan.industry
      }
    }));

    // Combine and sort by created_at in descending order
    const mockPurchases = [...mockBookPurchases, ...mockBusinessPlanPurchases];
    mockPurchases.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return {
      success: true,
      data: mockPurchases
    };
  } catch (error: any) {
    console.error('Error fetching all purchases:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch all purchases',
      data: []
    };
  }
};

export const updatePurchaseStatus = async (id: string, status: string) => {
  try {
    console.log('Using mock data for updating purchase status');

    // In a real implementation, this would update the database
    // For now, just return a mock success response
    return {
      success: true,
      data: {
        id,
        status,
        updated_at: new Date().toISOString()
      }
    };
  } catch (error: any) {
    console.error('Error updating purchase status:', error);
    return {
      success: false,
      message: error.message || 'Failed to update purchase status'
    };
  }
};
