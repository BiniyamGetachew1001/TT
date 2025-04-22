import { supabase } from '../lib/supabase';
import type { BlogPost } from '../lib/supabase';
import { createActivityLog } from '../services/activityLogService';

export class BlogPostModel {
  // Static methods for collection operations
  static async getAll(category?: string): Promise<{ success: boolean; data: BlogPost[]; message?: string }> {
    try {
      // Use Supabase to fetch blog posts
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      // Add category filter if provided
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch blog posts',
        data: []
      };
    }
  }

  static async getById(id: string): Promise<{ success: boolean; data: BlogPost | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data
      };
    } catch (error: any) {
      console.error('Error fetching blog post:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch blog post',
        data: null
      };
    }
  }

  static async create(blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: BlogPost | null; message?: string }> {
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

      // Log activity
      await createActivityLog({
        action: 'create',
        item_type: 'blog-post',
        item_id: data[0].id,
        item_title: data[0].title,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

      return {
        success: true,
        data: data[0]
      };
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      return {
        success: false,
        message: error.message || 'Failed to create blog post',
        data: null
      };
    }
  }

  // Check and publish scheduled posts
  static async publishScheduledPosts(): Promise<{ success: boolean; message: string; data: BlogPost[] }> {
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
        message: error.message || 'Failed to check scheduled posts',
        data: []
      };
    }
  }

  // Instance methods for specific blog post operations
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  async update(updates: Partial<BlogPost>): Promise<{ success: boolean; data: BlogPost | null; message?: string }> {
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
        .eq('id', this.id)
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

      // Log activity
      await createActivityLog({
        action: actionType,
        item_type: 'blog-post',
        item_id: data[0].id,
        item_title: data[0].title,
        user_email: 'admin@example.com', // Replace with actual user email when available
        details: actionType === 'schedule' && postUpdates.scheduled_for
          ? `Scheduled for ${new Date(postUpdates.scheduled_for).toLocaleString()}`
          : undefined
      });

      return {
        success: true,
        data: data[0]
      };
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      return {
        success: false,
        message: error.message || 'Failed to update blog post',
        data: null
      };
    }
  }

  async publish(): Promise<{ success: boolean; data: BlogPost | null; message?: string }> {
    return this.update({
      status: 'published',
      published_at: new Date().toISOString(),
      scheduled_for: null
    });
  }

  async schedule(scheduledDate: string): Promise<{ success: boolean; data: BlogPost | null; message?: string }> {
    return this.update({
      status: 'scheduled',
      published_at: null,
      scheduled_for: scheduledDate
    });
  }

  async archive(): Promise<{ success: boolean; data: BlogPost | null; message?: string }> {
    return this.update({
      status: 'archived'
    });
  }

  async delete(): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', this.id);

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'delete',
        item_type: 'blog-post',
        item_id: this.id,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

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
  }
}
