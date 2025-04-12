import api from './api';

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
  try {
    const response = await api.get(`/api/purchases/user/${userId}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to fetch purchases',
      data: []
    };
  }
};

export const checkPurchaseStatus = async (userId: string, itemType: string, itemId: string) => {
  try {
    const response = await api.get(`/api/purchases/check/${userId}/${itemType}/${itemId}`);
    
    return {
      success: true,
      purchased: response.data.purchased,
      data: response.data.purchaseDetails
    };
  } catch (error: any) {
    return {
      success: false,
      purchased: false,
      message: error.response?.data?.error || 'Failed to check purchase status'
    };
  }
};

// Mock data for development
export const getMockUserPurchases = () => {
  return {
    success: true,
    data: [
      {
        id: '1',
        userId: 'user123',
        itemType: 'book-summary',
        itemId: 'book1',
        amount: 9.99,
        currency: 'USD',
        status: 'completed',
        createdAt: new Date().toISOString(),
        book: {
          id: 'book1',
          title: 'The Psychology of Money',
          author: 'Morgan Housel',
          coverImage: '/placeholder-book.jpg',
          category: 'Finance'
        }
      },
      {
        id: '2',
        userId: 'user123',
        itemType: 'business-plan',
        itemId: 'plan1',
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        createdAt: new Date().toISOString(),
        plan: {
          id: 'plan1',
          title: 'E-commerce Platform Business Plan',
          industry: 'Technology',
          coverImage: '/placeholder-business.jpg'
        }
      }
    ]
  };
};

export const getMockPurchaseStatus = (itemType: string, itemId: string) => {
  // For demo purposes, let's say book1 and plan1 are purchased
  const purchasedItems = ['book1', 'plan1'];
  
  return {
    success: true,
    purchased: purchasedItems.includes(itemId),
    data: purchasedItems.includes(itemId) ? {
      id: 'purchase123',
      userId: 'user123',
      itemType,
      itemId,
      amount: itemType === 'book-summary' ? 9.99 : 29.99,
      status: 'completed',
      createdAt: new Date().toISOString()
    } : null
  };
};
