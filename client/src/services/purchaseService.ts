import api from './api';

export const purchaseBook = async (userId: string, bookId: string, amount: number) => {
  try {
    const response = await api.post('/purchases', {
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
    const response = await api.post('/purchases', {
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
    const response = await api.get(`/purchases/user/${userId}`);
    
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
    const response = await api.get(`/purchases/check/${userId}/${itemType}/${itemId}`);
    
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
