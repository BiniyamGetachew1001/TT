import { supabase } from '../lib/supabase';
import type { BookSummary } from '../lib/supabase';

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
    const currentUser = getCurrentUser();

    // Use Supabase to fetch book summaries
    let query = supabase
      .from('book_summaries')
      .select('*')
      .order('created_at', { ascending: false });

    // Add category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Admin page filtering is handled by RLS policies

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching book summaries:', error);

      // Check for specific error types and provide more detailed information
      if (error.code === '42P01') {
        console.error('Table does not exist. Please check your database schema.');
      } else if (error.code === 'PGRST301') {
        console.error('Database connection error. Please check your Supabase URL and API key.');
      } else if (error.code === 'PGRST401') {
        console.error('Authentication error. Please check your Supabase API key.');
      } else if (error.message.includes('Failed to fetch')) {
        console.error('Network error. Please check your internet connection and Supabase URL.');
      } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        console.error('DNS resolution error. Please check your Supabase URL and internet connection.');
      }

      throw error;
    }

    return {
      success: true,
      data: data || []
    };
  } catch (error: any) {
    console.error('Error fetching book summaries:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch book summaries',
      data: []
    };
  }
};

export const getBookSummaryById = async (id: string) => {
  try {
    const currentUser = getCurrentUser();
    let query = supabase
      .from('book_summaries')
      .select('*')
      .eq('id', id);

    // Admin page filtering is handled by RLS policies

    const { data, error } = await query.single();

    if (error) {
      console.error('Supabase error fetching book summary:', error);

      // Check for specific error types and provide more detailed information
      if (error.code === '42P01') {
        console.error('Table does not exist. Please check your database schema.');
      } else if (error.code === 'PGRST301') {
        console.error('Database connection error. Please check your Supabase URL and API key.');
      } else if (error.code === 'PGRST401') {
        console.error('Authentication error. Please check your Supabase API key.');
      } else if (error.message.includes('Failed to fetch')) {
        console.error('Network error. Please check your internet connection and Supabase URL.');
      } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
        console.error('DNS resolution error. Please check your Supabase URL and internet connection.');
      }

      throw error;
    }

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error fetching book summary:', error);
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
      return {
        success: false,
        message: 'User not authenticated',
        data: null
      };
    }

    // Handle cover image upload if it's a data URL
    let coverImage = bookSummary.cover_image;
    if (coverImage && coverImage.startsWith('data:')) {
      const fileName = `${Date.now()}-${bookSummary.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      const { data, error } = await supabase.storage
        .from('book-covers')
        .upload(fileName, coverImage, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('book-covers')
        .getPublicUrl(fileName);

      coverImage = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('book_summaries')
      .insert([{
        ...bookSummary,
        cover_image: coverImage,

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error creating book summary:', error);
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
      return {
        success: false,
        message: 'User not authenticated',
        data: null
      };
    }

    // Handle cover image upload if it's a data URL
    let coverImage = bookSummary.cover_image;
    if (coverImage && coverImage.startsWith('data:')) {
      const fileName = `${Date.now()}-${bookSummary.title?.replace(/\s+/g, '-').toLowerCase() || id}.jpg`;
      const { data, error } = await supabase.storage
        .from('book-covers')
        .upload(fileName, coverImage, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('book-covers')
        .getPublicUrl(fileName);

      coverImage = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('book_summaries')
      .update({
        ...bookSummary,
        cover_image: coverImage,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error updating book summary:', error);
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
      return {
        success: false,
        message: 'User not authenticated'
      };
    }

    const { error } = await supabase
      .from('book_summaries')
      .delete()
      .eq('id', id)


    if (error) throw error;

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

// For backward compatibility with code that might still use the mock data functions
export const getUserReadingProgress = (bookId: string): number => {
  const progress = localStorage.getItem(`book-progress-${bookId}`);
  return progress ? parseInt(progress, 10) : 0;
};

export const setUserReadingProgress = (bookId: string, progress: number): void => {
  localStorage.setItem(`book-progress-${bookId}`, progress.toString());
};
