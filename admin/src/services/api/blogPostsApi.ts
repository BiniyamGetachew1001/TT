import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../lib/supabase';

export const blogPostsApi = {
  // Get all blog posts
  async getAllBlogPosts() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(id, name, email)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get a single blog post by ID
  async getBlogPostById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id(id, name, email)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Create a new blog post
  async createBlogPost(blogPost: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([blogPost])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update an existing blog post
  async updateBlogPost(id: string, blogPost: Partial<BlogPost>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(blogPost)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Delete a blog post
  async deleteBlogPost(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },
  
  // Publish a blog post
  async publishBlogPost(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Unpublish a blog post
  async unpublishBlogPost(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'draft',
        published_at: null
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }
};
