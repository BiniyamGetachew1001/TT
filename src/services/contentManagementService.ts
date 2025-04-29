import { BookSummary } from './BookSummaryService';
import { BusinessPlan } from './businessPlanService';
import { BlogPost } from './blogService';
import { mockSummaries, mockBlogPosts, mockBusinessPlans } from '../data/mockData';

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

// Book Summaries Management
export const createBookSummary = async (bookSummary: Omit<BookSummary, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Create a mock book summary with a unique ID
    const mockId = Date.now().toString();
    const newBookSummary = {
      id: mockId,
      ...bookSummary,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to localStorage cache
    const cachedData = localStorage.getItem('cached_book_summaries');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      parsed.push(newBookSummary);
      localStorage.setItem('cached_book_summaries', JSON.stringify(parsed));
    } else {
      localStorage.setItem('cached_book_summaries', JSON.stringify([newBookSummary]));
    }

    return {
      success: true,
      data: newBookSummary
    };
  } catch (error: any) {
    console.error('Error creating book summary:', error);
    return {
      success: false,
      message: error.message || 'Failed to create book summary'
    };
  }
};

export const updateBookSummary = async (id: string, updates: Partial<BookSummary>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Get existing data from cache
    const cachedData = localStorage.getItem('cached_book_summaries');
    if (!cachedData) {
      return {
        success: false,
        message: 'Book summary not found in cache'
      };
    }

    const parsed = JSON.parse(cachedData);
    const index = parsed.findIndex((item: any) => item.id === id);

    if (index === -1) {
      return {
        success: false,
        message: 'Book summary not found'
      };
    }

    // Update the book summary
    const updatedSummary = {
      ...parsed[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update in cache
    parsed[index] = updatedSummary;
    localStorage.setItem('cached_book_summaries', JSON.stringify(parsed));

    return {
      success: true,
      data: updatedSummary
    };
  } catch (error: any) {
    console.error('Error updating book summary:', error);
    return {
      success: false,
      message: error.message || 'Failed to update book summary'
    };
  }
};

export const deleteBookSummary = async (id: string) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Get existing data from cache
    const cachedData = localStorage.getItem('cached_book_summaries');
    if (!cachedData) {
      return {
        success: false,
        message: 'Book summary not found in cache'
      };
    }

    const parsed = JSON.parse(cachedData);
    const index = parsed.findIndex((item: any) => item.id === id);

    if (index === -1) {
      return {
        success: false,
        message: 'Book summary not found'
      };
    }

    // Remove from cache
    parsed.splice(index, 1);
    localStorage.setItem('cached_book_summaries', JSON.stringify(parsed));

    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting book summary:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete book summary'
    };
  }
};

// Business Plans Management
export const createBusinessPlan = async (businessPlan: Omit<BusinessPlan, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Create a mock business plan with a unique ID
    const mockId = Date.now().toString();
    const newBusinessPlan = {
      id: mockId,
      ...businessPlan,
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

    return {
      success: true,
      data: newBusinessPlan
    };
  } catch (error: any) {
    console.error('Error creating business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to create business plan'
    };
  }
};

export const updateBusinessPlan = async (id: string, updates: Partial<BusinessPlan>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

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

    // Update the business plan
    const updatedPlan = {
      ...parsed[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update in cache
    parsed[index] = updatedPlan;
    localStorage.setItem('cached_business_plans', JSON.stringify(parsed));

    return {
      success: true,
      data: updatedPlan
    };
  } catch (error: any) {
    console.error('Error updating business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to update business plan'
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

    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete business plan'
    };
  }
};

// Blog Posts Management
export const createBlogPost = async (blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Create a mock blog post with a unique ID
    const mockId = Date.now().toString();
    const newBlogPost = {
      id: mockId,
      ...blogPost,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: { name: currentUser.name || 'Admin' }
    };

    // Add to localStorage cache
    const cachedData = localStorage.getItem('cached_blog_posts');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      parsed.push(newBlogPost);
      localStorage.setItem('cached_blog_posts', JSON.stringify(parsed));
    } else {
      localStorage.setItem('cached_blog_posts', JSON.stringify([newBlogPost]));
    }

    return {
      success: true,
      data: newBlogPost
    };
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return {
      success: false,
      message: error.message || 'Failed to create blog post'
    };
  }
};

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Get existing data from cache
    const cachedData = localStorage.getItem('cached_blog_posts');
    if (!cachedData) {
      return {
        success: false,
        message: 'Blog post not found in cache'
      };
    }

    const parsed = JSON.parse(cachedData);
    const index = parsed.findIndex((item: any) => item.id.toString() === id);

    if (index === -1) {
      return {
        success: false,
        message: 'Blog post not found'
      };
    }

    // Update the blog post
    const updatedPost = {
      ...parsed[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update in cache
    parsed[index] = updatedPost;
    localStorage.setItem('cached_blog_posts', JSON.stringify(parsed));

    return {
      success: true,
      data: updatedPost
    };
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return {
      success: false,
      message: error.message || 'Failed to update blog post'
    };
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    // Get existing data from cache
    const cachedData = localStorage.getItem('cached_blog_posts');
    if (!cachedData) {
      return {
        success: false,
        message: 'Blog post not found in cache'
      };
    }

    const parsed = JSON.parse(cachedData);
    const index = parsed.findIndex((item: any) => item.id.toString() === id);

    if (index === -1) {
      return {
        success: false,
        message: 'Blog post not found'
      };
    }

    // Remove from cache
    parsed.splice(index, 1);
    localStorage.setItem('cached_blog_posts', JSON.stringify(parsed));

    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete blog post'
    };
  }
};
