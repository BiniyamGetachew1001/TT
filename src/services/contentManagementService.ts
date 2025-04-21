import { supabase } from '../lib/supabase';
import type { BookSummary, BusinessPlan, BlogPost } from '../lib/supabase';
import { createActivityLog } from './activityLogService';

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

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: 'create',
    //   item_type: 'book-summary',
    //   item_id: data[0].id,
    //   item_title: data[0].title,
    //   user_email: 'admin@example.com' // Replace with actual user email when available
    // });

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

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: 'update',
    //   item_type: 'book-summary',
    //   item_id: data[0].id,
    //   item_title: data[0].title,
    //   user_email: 'admin@example.com' // Replace with actual user email when available
    // });

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

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: 'delete',
    //   item_type: 'book-summary',
    //   item_id: id,
    //   user_email: 'admin@example.com' // Replace with actual user email when available
    // });

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

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: 'create',
    //   item_type: 'business-plan',
    //   item_id: data[0].id,
    //   item_title: data[0].title,
    //   user_email: 'admin@example.com' // Replace with actual user email when available
    // });

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

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: 'update',
    //   item_type: 'business-plan',
    //   item_id: data[0].id,
    //   item_title: data[0].title,
    //   user_email: 'admin@example.com' // Replace with actual user email when available
    // });

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

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: 'delete',
    //   item_type: 'business-plan',
    //   item_id: id,
    //   user_email: 'admin@example.com' // Replace with actual user email when available
    // });

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
    // Handle scheduled posts
    let postData = { ...blogPost };

    // If it's a scheduled post, ensure the status is set correctly
    if (postData.status === 'scheduled' && postData.scheduled_for) {
      // Keep status as 'scheduled' and ensure published_at is null
      postData.published_at = null;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...postData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: 'create',
    //   item_type: 'blog-post',
    //   item_id: data[0].id,
    //   item_title: data[0].title,
    //   user_email: 'admin@example.com' // Replace with actual user email when available
    // });

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
    // Handle scheduled posts
    let postUpdates = { ...updates };

    // If it's a scheduled post, ensure the status is set correctly
    if (postUpdates.status === 'scheduled' && postUpdates.scheduled_for) {
      // Keep status as 'scheduled' and ensure published_at is null
      postUpdates.published_at = null;
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...postUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Determine the action type based on the update
    let actionType: 'update' | 'publish' | 'archive' | 'schedule' = 'update';
    if (postUpdates.status === 'published') {
      actionType = 'publish';
    } else if (postUpdates.status === 'archived') {
      actionType = 'archive';
    } else if (postUpdates.status === 'scheduled') {
      actionType = 'schedule';
    }

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: actionType,
    //   item_type: 'blog-post',
    //   item_id: data[0].id,
    //   item_title: data[0].title,
    //   user_email: 'admin@example.com', // Replace with actual user email when available
    //   details: actionType === 'schedule' && postUpdates.scheduled_for
    //     ? `Scheduled for ${new Date(postUpdates.scheduled_for).toLocaleString()}`
    //     : undefined
    // });

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

// Function to check and publish scheduled posts
export const checkScheduledPosts = async () => {
  try {
    const now = new Date().toISOString();

    // Find all scheduled posts that should be published now
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'scheduled')
      .lt('scheduled_for', now);

    if (error) throw error;

    if (data && data.length > 0) {
      // Update each post to published status
      const updatePromises = data.map(post => {
        return supabase
          .from('blog_posts')
          .update({
            status: 'published',
            published_at: now,
            updated_at: now
          })
          .eq('id', post.id);
      });

      await Promise.all(updatePromises);

      return {
        success: true,
        message: `Published ${data.length} scheduled posts`,
        data
      };
    }

    return {
      success: true,
      message: 'No scheduled posts to publish',
      data: []
    };
  } catch (error: any) {
    console.error('Error checking scheduled posts:', error);
    return {
      success: false,
      message: error.message || 'Failed to check scheduled posts'
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

    // Log activity - temporarily disabled until table is created
    // await createActivityLog({
    //   action: 'delete',
    //   item_type: 'blog-post',
    //   item_id: id,
    //   user_email: 'admin@example.com' // Replace with actual user email when available
    // });

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
