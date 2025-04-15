import { supabase } from '../lib/supabase';
import type { BookSummary } from '../lib/supabase';
import { mockSummaries } from '../data/mockData';

export const getAllBookSummaries = async (category?: string) => {
  try {
    // Use Supabase to fetch book summaries
    let query = supabase
      .from('book_summaries')
      .select('*')
      .order('created_at', { ascending: false });

    // Add category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error fetching book summaries:', error);

      // If the table doesn't exist or there's another database error, return mock data
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('Using mock data as fallback');
        const filteredData = category && category !== 'all'
          ? mockSummaries.filter(summary => summary.category === category)
          : mockSummaries;

        return {
          success: true,
          data: filteredData.map(summary => ({
            id: summary.id.toString(),
            title: summary.title,
            author: summary.author,
            description: summary.description,
            category: summary.category,
            cover_image: summary.coverImage,
            read_time: summary.readTime,
            price: summary.isPremium ? 9.99 : 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })) as BookSummary[]
        };
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
    const { data, error } = await supabase
      .from('book_summaries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // If the table doesn't exist or there's another database error, return mock data
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('Using mock data as fallback for book detail');
        const mockId = parseInt(id, 10);
        const mockSummary = mockSummaries.find(summary => summary.id === mockId);

        if (mockSummary) {
          return {
            success: true,
            data: {
              id: mockSummary.id.toString(),
              title: mockSummary.title,
              author: mockSummary.author,
              description: mockSummary.description,
              category: mockSummary.category,
              cover_image: mockSummary.coverImage,
              read_time: mockSummary.readTime,
              price: mockSummary.isPremium ? 9.99 : 0,
              content: mockSummary.content,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as BookSummary
          };
        }
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
      .insert([{ ...bookSummary, cover_image: coverImage }])
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
      .update({ ...bookSummary, cover_image: coverImage, updated_at: new Date() })
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
    const { error } = await supabase
      .from('book_summaries')
      .delete()
      .eq('id', id);

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
