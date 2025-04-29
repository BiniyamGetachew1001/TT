import { mockSummaries } from '../data/mockData';

// Define BookSummary type locally since we removed the Supabase import
export type BookSummary = {
  id: string | number;
  title: string;
  author: string;
  description?: string;
  content?: string;
  cover_image?: string;
  coverImage?: string; // For compatibility with mock data
  read_time?: string;
  readTime?: string; // For compatibility with mock data
  category?: string;
  price?: number;
  isPremium?: boolean; // For compatibility with mock data
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

export const getAllBookSummaries = async (category?: string) => {
  try {
    // Check if browser is offline
    if (!navigator.onLine) {
      console.warn('Browser is offline, returning cached data for book summaries');
      // Return cached data from localStorage
      const cachedData = localStorage.getItem('cached_book_summaries');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        // Apply category filter if needed
        const filtered = category && category !== 'all'
          ? parsed.filter((item: any) => item.category === category)
          : parsed;
        return {
          success: true,
          data: filtered,
          offline: true
        };
      }
      // If no cached data, return empty array
      return {
        success: true,
        data: [],
        offline: true,
        message: 'No cached data available while offline'
      };
    }

    console.log('Using mock data for book summaries');
    
    // Convert mock data to match the expected format
    const formattedData = mockSummaries.map(summary => ({
      id: summary.id.toString(),
      title: summary.title,
      author: summary.author,
      description: summary.description,
      content: summary.content,
      cover_image: summary.coverImage,
      read_time: summary.readTime,
      category: summary.category,
      price: summary.isPremium ? 9.99 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Apply category filter if provided
    const filteredData = category && category !== 'all'
      ? formattedData.filter(item => item.category === category)
      : formattedData;
    
    // Cache the data for offline use
    localStorage.setItem('cached_book_summaries', JSON.stringify(filteredData));
    
    return {
      success: true,
      data: filteredData
    };
  } catch (error: any) {
    console.error('Error fetching mock book summaries:', error);
    
    // Try to use cached data as a last resort
    try {
      const cachedData = localStorage.getItem('cached_book_summaries');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        // Apply category filter if needed
        const filtered = category && category !== 'all'
          ? parsed.filter((item: any) => item.category === category)
          : parsed;
        return {
          success: true,
          data: filtered,
          offline: true,
          message: 'Using cached data due to connection error'
        };
      }
    } catch (cacheError) {
      console.error('Error reading cached data:', cacheError);
    }
    
    return {
      success: false,
      message: error.message || 'Failed to fetch book summaries',
      data: []
    };
  }
};

export const getBookSummaryById = async (id: string) => {
  try {
    // Check if browser is offline
    if (!navigator.onLine) {
      console.warn('Browser is offline, trying to retrieve book summary from cache');
      // Try to get the book summary from cached data
      const cachedData = localStorage.getItem('cached_book_summaries');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const bookSummary = parsed.find((item: any) => item.id === id);
        if (bookSummary) {
          return {
            success: true,
            data: bookSummary,
            offline: true
          };
        } else {
          return {
            success: false,
            message: 'Book summary not found in cache',
            data: null,
            offline: true
          };
        }
      }
      return {
        success: false,
        message: 'No cached data available while offline',
        data: null,
        offline: true
      };
    }

    console.log('Using mock data for book summary by ID:', id);
    
    // Find the book summary in mock data
    const summary = mockSummaries.find(summary => summary.id.toString() === id);
    
    if (!summary) {
      throw new Error('Book summary not found');
    }
    
    // Convert to expected format
    const formattedData = {
      id: summary.id.toString(),
      title: summary.title,
      author: summary.author,
      description: summary.description,
      content: summary.content,
      cover_image: summary.coverImage,
      read_time: summary.readTime,
      category: summary.category,
      price: summary.isPremium ? 9.99 : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Cache this individual book summary for offline access
    const cachedData = localStorage.getItem('cached_book_summaries');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      const index = parsed.findIndex((item: any) => item.id === id);
      if (index >= 0) {
        parsed[index] = formattedData;
      } else {
        parsed.push(formattedData);
      }
      localStorage.setItem('cached_book_summaries', JSON.stringify(parsed));
    } else {
      // Create a new cache with just this book summary
      localStorage.setItem('cached_book_summaries', JSON.stringify([formattedData]));
    }
    
    return {
      success: true,
      data: formattedData
    };
  } catch (error: any) {
    console.error('Error fetching mock book summary:', error);
    
    // Try to use cached data as a last resort
    try {
      const cachedData = localStorage.getItem('cached_book_summaries');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const bookSummary = parsed.find((item: any) => item.id === id);
        if (bookSummary) {
          return {
            success: true,
            data: bookSummary,
            offline: true,
            message: 'Using cached data due to connection error'
          };
        }
      }
    } catch (cacheError) {
      console.error('Error reading cached data:', cacheError);
    }
    
    return {
      success: false,
      message: error.message || 'Failed to fetch book summary',
      data: null
    };
  }
};

export const createBookSummary = async (bookSummary: Omit<BookSummary, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('Authentication required: No user found in localStorage');
      return {
        success: false,
        message: 'Authentication required. Please log in first.',
        data: null
      };
    }

    console.log('Creating mock book summary with user:', currentUser.email, 'Role:', currentUser.role);

    // Generate a mock ID (timestamp-based for uniqueness)
    const mockId = Date.now().toString();
    
    // Use the provided cover image or a default one
    let coverImage = bookSummary.cover_image;
    if (!coverImage) {
      coverImage = "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop";
    }
    
    // Create the new book summary with mock data
    const newBookSummary = {
      id: mockId,
      ...bookSummary,
      cover_image: coverImage,
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
    
    console.log('Mock book summary created successfully:', newBookSummary);
    return {
      success: true,
      data: newBookSummary
    };
  } catch (error: any) {
    console.error('Error creating mock book summary:', error);
    return {
      success: false,
      message: error.message || 'Failed to create book summary',
      data: null
    };
  }
};

export const updateBookSummary = async (id: string, bookSummary: Partial<BookSummary>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('Authentication required: No user found in localStorage');
      return {
        success: false,
        message: 'Authentication required. Please log in first.',
        data: null
      };
    }

    console.log('Updating mock book summary with user:', currentUser.email, 'Role:', currentUser.role);

    // Use the provided cover image or keep the existing one
    let coverImage = bookSummary.cover_image;
    
    // Get existing data from cache
    const cachedData = localStorage.getItem('cached_book_summaries');
    if (!cachedData) {
      return {
        success: false,
        message: 'Book summary not found in cache',
        data: null
      };
    }
    
    const parsed = JSON.parse(cachedData);
    const index = parsed.findIndex((item: any) => item.id === id);
    
    if (index === -1) {
      return {
        success: false,
        message: 'Book summary not found',
        data: null
      };
    }
    
    // Update the book summary
    const updatedSummary = {
      ...parsed[index],
      ...bookSummary,
      cover_image: coverImage || parsed[index].cover_image,
      updated_at: new Date().toISOString()
    };
    
    // Update in cache
    parsed[index] = updatedSummary;
    localStorage.setItem('cached_book_summaries', JSON.stringify(parsed));
    
    console.log('Mock book summary updated successfully:', updatedSummary);
    return {
      success: true,
      data: updatedSummary
    };
  } catch (error: any) {
    console.error('Error updating mock book summary:', error);
    return {
      success: false,
      message: error.message || 'Failed to update book summary',
      data: null
    };
  }
};

export const deleteBookSummary = async (id: string) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error('Authentication required: No user found in localStorage');
      return {
        success: false,
        message: 'Authentication required. Please log in first.'
      };
    }

    console.log('Deleting mock book summary with user:', currentUser.email, 'Role:', currentUser.role);

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
    
    console.log('Mock book summary deleted successfully');
    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting mock book summary:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete book summary'
    };
  }
};

// For backward compatibility with code that might still use the mock data functions
export const getUserReadingProgress = (bookId: string): number => {
  const progress = localStorage.getItem(`book-progress-${bookId}`);
  return progress ? parseInt(progress, 10) : 0;
};

export const setUserReadingProgress = (bookId: string, progress: number): void => {
  localStorage.setItem(`book-progress-${bookId}`, progress.toString());
};
