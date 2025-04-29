import { mockBusinessPlans } from '../data/mockData';

// Define BusinessPlan type locally since we removed the Supabase import
export type BusinessPlan = {
  id: string | number;
  title: string;
  description?: string;
  industry: string;
  content?: string;
  cover_image?: string;
  coverImage?: string; // For compatibility with mock data
  read_time?: string;
  readTime?: string; // For compatibility with mock data
  price?: number;
  isPremium?: boolean; // For compatibility with mock data
  author?: string;
  created_at?: string;
  updated_at?: string;
};

// Get the current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  }
  return null;
};

export const getAllBusinessPlans = async (industry?: string) => {
  try {
    console.log('Using mock data for business plans');

    // Convert mock data to match the expected format
    const formattedData = mockBusinessPlans.map(plan => ({
      id: plan.id.toString(),
      title: plan.title,
      industry: plan.industry,
      description: plan.description,
      content: plan.content,
      cover_image: plan.coverImage,
      read_time: plan.readTime,
      price: plan.isPremium ? plan.price : 0,
      author: 'Admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Apply industry filter if provided
    const filteredData = industry
      ? formattedData.filter(item => item.industry === industry)
      : formattedData;

    // Cache the data for offline use
    localStorage.setItem('cached_business_plans', JSON.stringify(filteredData));

    return {
      success: true,
      data: filteredData
    };
  } catch (error: any) {
    console.error('Error fetching mock business plans:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch business plans',
      data: []
    };
  }
};

export const getBusinessPlanById = async (id: string) => {
  try {
    console.log('Using mock data for business plan by ID:', id);

    // Find the business plan in mock data
    const plan = mockBusinessPlans.find(plan => plan.id.toString() === id);

    if (!plan) {
      throw new Error('Business plan not found');
    }

    // Convert to expected format
    const formattedData = {
      id: plan.id.toString(),
      title: plan.title,
      industry: plan.industry,
      description: plan.description,
      content: plan.content,
      cover_image: plan.coverImage,
      read_time: plan.readTime,
      price: plan.isPremium ? plan.price : 0,
      author: 'Admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Cache this individual business plan for offline access
    const cachedData = localStorage.getItem('cached_business_plans');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      const index = parsed.findIndex((item: any) => item.id === id);
      if (index >= 0) {
        parsed[index] = formattedData;
      } else {
        parsed.push(formattedData);
      }
      localStorage.setItem('cached_business_plans', JSON.stringify(parsed));
    } else {
      // Create a new cache with just this business plan
      localStorage.setItem('cached_business_plans', JSON.stringify([formattedData]));
    }

    return {
      success: true,
      data: formattedData
    };
  } catch (error: any) {
    console.error('Error fetching mock business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch business plan',
      data: null
    };
  }
};

export const createBusinessPlan = async (businessPlan: Omit<BusinessPlan, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated',
        data: null
      };
    }

    console.log('Creating mock business plan with user:', currentUser.email, 'Role:', currentUser.role);

    // Generate a mock ID (timestamp-based for uniqueness)
    const mockId = Date.now().toString();

    // Use the provided cover image or a default one
    let coverImage = businessPlan.cover_image;
    if (!coverImage) {
      coverImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop";
    }

    // Create the new business plan with mock data
    const newBusinessPlan = {
      id: mockId,
      ...businessPlan,
      cover_image: coverImage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to localStorage cache
    const cachedData = localStorage.getItem('cached_business_plans');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      parsed.push(newBusinessPlan);
      localStorage.setItem('cached_business_plans', JSON.stringify(parsed));
    } else {
      localStorage.setItem('cached_business_plans', JSON.stringify([newBusinessPlan]));
    }

    console.log('Mock business plan created successfully:', newBusinessPlan);
    return {
      success: true,
      data: newBusinessPlan
    };
  } catch (error: any) {
    console.error('Error creating mock business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to create business plan',
      data: null
    };
  }
};

export const updateBusinessPlan = async (id: string, businessPlan: Partial<BusinessPlan>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated',
        data: null
      };
    }

    console.log('Updating mock business plan with user:', currentUser.email, 'Role:', currentUser.role);

    // Use the provided cover image or keep the existing one
    let coverImage = businessPlan.cover_image;

    // Get existing data from cache
    const cachedData = localStorage.getItem('cached_business_plans');
    if (!cachedData) {
      return {
        success: false,
        message: 'Business plan not found in cache',
        data: null
      };
    }

    const parsed = JSON.parse(cachedData);
    const index = parsed.findIndex((item: any) => item.id === id);

    if (index === -1) {
      return {
        success: false,
        message: 'Business plan not found',
        data: null
      };
    }

    // Update the business plan
    const updatedPlan = {
      ...parsed[index],
      ...businessPlan,
      cover_image: coverImage || parsed[index].cover_image,
      updated_at: new Date().toISOString()
    };

    // Update in cache
    parsed[index] = updatedPlan;
    localStorage.setItem('cached_business_plans', JSON.stringify(parsed));

    console.log('Mock business plan updated successfully:', updatedPlan);
    return {
      success: true,
      data: updatedPlan
    };
  } catch (error: any) {
    console.error('Error updating mock business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to update business plan',
      data: null
    };
  }
};

export const deleteBusinessPlan = async (id: string) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    console.log('Deleting mock business plan with user:', currentUser.email, 'Role:', currentUser.role);

    // Get existing data from cache
    const cachedData = localStorage.getItem('cached_business_plans');
    if (!cachedData) {
      return {
        success: false,
        message: 'Business plan not found in cache'
      };
    }

    const parsed = JSON.parse(cachedData);
    const index = parsed.findIndex((item: any) => item.id === id);

    if (index === -1) {
      return {
        success: false,
        message: 'Business plan not found'
      };
    }

    // Remove from cache
    parsed.splice(index, 1);
    localStorage.setItem('cached_business_plans', JSON.stringify(parsed));

    console.log('Mock business plan deleted successfully');
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting mock business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete business plan'
    };
  }
};
