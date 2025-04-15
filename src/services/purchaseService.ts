import api from './api';
import { supabase } from '../lib/supabase';
import { mockSummaries } from '../data/mockData';

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
    // Use Supabase to fetch user purchases from the purchase_details view
    const { data, error } = await supabase
      .from('purchase_details')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) {
      // If the table doesn't exist or there's another database error, return mock data
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('Using mock data as fallback for purchases');

        // Create mock purchases from the first 2 book summaries
        const mockPurchases = mockSummaries.slice(0, 2).map(summary => ({
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

        return {
          success: true,
          data: mockPurchases
        };
      }

      throw error;
    }

    return {
      success: true,
      data: data || []
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
    // Use Supabase to check purchase status
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .eq('status', 'completed')
      .single();

    if (error) {
      // If it's just a "no rows returned" error, that's expected
      if (error.code === 'PGRST116') {
        return {
          success: true,
          purchased: false,
          data: null
        };
      }

      // If the table doesn't exist or there's another database error, return mock data
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('Using mock data as fallback for purchase status');

        // For demo purposes, let's say the first 2 books are purchased
        const mockId = parseInt(itemId, 10);
        const isPurchased = mockId <= 2;

        return {
          success: true,
          purchased: isPurchased,
          data: isPurchased ? {
            id: `purchase-${itemId}`,
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
      }

      throw error;
    }

    return {
      success: true,
      purchased: !!data,
      data
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
