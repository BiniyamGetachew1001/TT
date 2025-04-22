import { supabase } from '../lib/supabase';
import type { BookSummary, BusinessPlan, BlogPost } from '../lib/supabase';

// Book Summaries Management
export const createBookSummary = async (bookSummary: Omit<BookSummary, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('book_summaries')
      .insert([{
        ...bookSummary,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
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
    const { data, error } = await supabase
      .from('book_summaries')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
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

// Business Plans Management
export const createBusinessPlan = async (businessPlan: Omit<BusinessPlan, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await supabase
      .from('business_plans')
      .insert([{
        ...businessPlan,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
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
    const { data, error } = await supabase
      .from('business_plans')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
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
    const { error } = await supabase
      .from('business_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;

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
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...blogPost,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
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
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
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
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;

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
