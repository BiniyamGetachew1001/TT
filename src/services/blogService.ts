import api from './api';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../lib/supabase';

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

export const getAllBlogPosts = async (category?: string) => {
  try {
    const currentUser = getCurrentUser();
    const isAdminPage = window.location.pathname.includes('/admin');

    // Use Supabase to fetch blog posts
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // Only filter by published status if not on admin page
    if (!isAdminPage) {
      query = query.eq('status', 'published');
    }

    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }

    // If we have a current user and we're in the admin page, filter by author_id
    if (currentUser && isAdminPage) {
      query = query.eq('author_id', currentUser.id);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Log the data received from Supabase
    console.log('Blog posts from Supabase:', data);

    // Transform the data to match the expected format
    const transformedData = data.map((post: BlogPost) => {
      console.log('Processing post:', post.id, 'Cover image:', post.cover_image);
      return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags,
      status: post.status,
      publishedAt: post.published_at,
      coverImage: post.cover_image,
      author: { name: 'Admin' } // Since we don't have author name in the current setup
    };
    });

    return {
      success: true,
      data: transformedData
    };
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch blog posts',
      data: []
    };
  }
};

export const getBlogPostById = async (id: string) => {
  try {
    const currentUser = getCurrentUser();
    const isAdminPage = window.location.pathname.includes('/admin');

    // Use Supabase to fetch a single blog post
    let query = supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id);

    // If we have a current user and we're in the admin page, filter by author_id
    if (currentUser && isAdminPage) {
      query = query.eq('author_id', currentUser.id);
    }

    const { data, error } = await query.single();

    if (error) throw error;

    if (!data) {
      throw new Error('Blog post not found');
    }

    // Transform the data to match the expected format
    const transformedData = {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags: data.tags,
      status: data.status,
      publishedAt: data.published_at,
      coverImage: data.cover_image,
      author: { name: 'Admin' } // Since we don't have author name in the current setup
    };

    return {
      success: true,
      data: transformedData
    };
  } catch (error: any) {
    console.error('Error fetching blog post:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch blog post',
      data: null
    };
  }
};

// These functions are kept for backward compatibility but now use real data from Supabase
export const getMockBlogPosts = async (category?: string) => {
  return await getAllBlogPosts(category);
};

export const getMockBlogPostById = async (id: string) => {
  return await getBlogPostById(id);
};
