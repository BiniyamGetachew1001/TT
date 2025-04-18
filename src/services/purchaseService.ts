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

// Admin functions
export const getAllPurchases = async () => {
  try {
    // First, get all purchases
    const { data: purchasesData, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    // Handle errors with mock data
    if (purchasesError) {
      // If the table doesn't exist or there's another database error, return mock data
      if (purchasesError.code === '42P01' || purchasesError.message.includes('does not exist')) {
        console.log('Using mock data as fallback for all purchases');

        // Create mock purchases
        const mockPurchases = mockSummaries.slice(0, 5).map((summary, index) => ({
          id: `purchase-${index}`,
          user_id: `user-${index % 3 + 1}`,
          item_type: index % 2 === 0 ? 'book-summary' : 'business-plan',
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
          book_summary: index % 2 === 0 ? {
            id: summary.id.toString(),
            title: summary.title,
            author: summary.author,
            category: summary.category
          } : null,
          business_plan: index % 2 === 1 ? {
            id: summary.id.toString(),
            title: `Business Plan for ${summary.title}`,
            industry: ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail'][index % 5]
          } : null
        }));

        return {
          success: true,
          data: mockPurchases
        };
      }

      throw purchasesError;
    }

    // If no purchases found, return empty array
    if (!purchasesData || purchasesData.length === 0) {
      return {
        success: true,
        data: []
      };
    }

    // If we have purchases, fetch related data
    // Get unique user IDs
    const userIds = [...new Set(purchasesData.map(p => p.user_id))];

    // Get users
    const { data: usersData } = await supabase
      .from('users')
      .select('id, email, name')
      .in('id', userIds);

    // Get unique item IDs for book summaries
    const bookSummaryIds = [...new Set(
      purchasesData
        .filter(p => p.item_type === 'book-summary')
        .map(p => p.item_id)
    )];

    // Get book summaries if there are any book summary purchases
    let bookSummariesData = [];
    if (bookSummaryIds.length > 0) {
      const { data } = await supabase
        .from('book_summaries')
        .select('id, title, author, category')
        .in('id', bookSummaryIds);
      bookSummariesData = data || [];
    }

    // Get unique item IDs for business plans
    const businessPlanIds = [...new Set(
      purchasesData
        .filter(p => p.item_type === 'business-plan')
        .map(p => p.item_id)
    )];

    // Get business plans if there are any business plan purchases
    let businessPlansData = [];
    if (businessPlanIds.length > 0) {
      const { data } = await supabase
        .from('business_plans')
        .select('id, title, industry')
        .in('id', businessPlanIds);
      businessPlansData = data || [];
    }

    // Combine the data
    const enrichedPurchases = purchasesData.map(purchase => {
      // Find related user
      const user = usersData?.find(u => u.id === purchase.user_id) || {
        email: 'unknown@example.com',
        name: 'Unknown User'
      };

      // Find related item based on item_type
      let item = null;
      if (purchase.item_type === 'book-summary') {
        item = bookSummariesData?.find(b => b.id === purchase.item_id);
      } else if (purchase.item_type === 'business-plan') {
        item = businessPlansData?.find(b => b.id === purchase.item_id);
      }

      return {
        ...purchase,
        user,
        book_summary: purchase.item_type === 'book-summary' ? item : null,
        business_plan: purchase.item_type === 'business-plan' ? item : null
      };
    });

    return {
      success: true,
      data: enrichedPurchases
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
    const { data, error } = await supabase
      .from('purchases')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
    };
  } catch (error: any) {
    console.error('Error updating purchase status:', error);
    return {
      success: false,
      message: error.message || 'Failed to update purchase status'
    };
  }
};
