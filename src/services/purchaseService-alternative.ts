import api from './api';
import { supabase } from '../lib/supabase';
import { mockSummaries } from '../data/mockData';

// Purchase a book or business plan
export const purchaseItem = async (userId: string, itemType: string, itemId: string, amount: number) => {
  try {
    // First check if the user already purchased this item
    const { purchased } = await checkPurchaseStatus(userId, itemType, itemId);
    
    if (purchased) {
      return {
        success: true,
        message: 'Item already purchased',
        alreadyPurchased: true
      };
    }
    
    // Create a new purchase record
    const { data, error } = await supabase
      .from('purchases')
      .insert([{
        user_id: userId,
        item_type: itemType,
        item_id: itemId,
        amount,
        currency: 'USD',
        status: 'completed', // In a real app, this would be 'pending' until payment is confirmed
        payment_id: `sim_${Date.now()}` // Simulated payment ID
      }])
      .select();
    
    if (error) throw error;
    
    return {
      success: true,
      data
    };
  } catch (error) {
    console.error('Error creating purchase:', error);
    return {
      success: false,
      message: 'Failed to complete purchase'
    };
  }
};

// Get user purchases with separate queries for book summaries and business plans
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
    // First, get all purchases for the user
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (purchasesError) {
      // If the table doesn't exist or there's another database error, return mock data
      if (purchasesError.code === '42P01' || purchasesError.message.includes('does not exist')) {
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
      
      throw purchasesError;
    }

    // If no purchases, return empty array
    if (!purchases || purchases.length === 0) {
      return {
        success: true,
        data: []
      };
    }

    // Get book summary IDs and business plan IDs
    const bookSummaryIds = purchases
      .filter(p => p.item_type === 'book-summary')
      .map(p => p.item_id);
    
    const businessPlanIds = purchases
      .filter(p => p.item_type === 'business-plan')
      .map(p => p.item_id);

    // Fetch book summaries if there are any
    let bookSummaries = [];
    if (bookSummaryIds.length > 0) {
      const { data: books, error: booksError } = await supabase
        .from('book_summaries')
        .select('id, title, author, cover_image, category')
        .in('id', bookSummaryIds);
      
      if (booksError) {
        console.error('Error fetching book summaries:', booksError);
      } else {
        bookSummaries = books || [];
      }
    }

    // Fetch business plans if there are any
    let businessPlans = [];
    if (businessPlanIds.length > 0) {
      const { data: plans, error: plansError } = await supabase
        .from('business_plans')
        .select('id, title, industry, cover_image')
        .in('id', businessPlanIds);
      
      if (plansError) {
        console.error('Error fetching business plans:', plansError);
      } else {
        businessPlans = plans || [];
      }
    }

    // Combine the data
    const enrichedPurchases = purchases.map(purchase => {
      if (purchase.item_type === 'book-summary') {
        const bookSummary = bookSummaries.find(b => b.id === purchase.item_id);
        return {
          ...purchase,
          book_summary: bookSummary || null
        };
      } else if (purchase.item_type === 'business-plan') {
        const businessPlan = businessPlans.find(b => b.id === purchase.item_id);
        return {
          ...purchase,
          business_plan: businessPlan || null
        };
      }
      return purchase;
    });

    return {
      success: true,
      data: enrichedPurchases
    };
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return {
      success: false,
      message: 'Failed to fetch user purchases',
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
  } catch (error) {
    console.error('Error checking purchase status:', error);
    return {
      success: false,
      purchased: false,
      message: 'Failed to check purchase status',
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
