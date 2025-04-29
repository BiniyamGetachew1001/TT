import api from './api';
import { mockBlogPosts } from '../data/mockData';

// Define BlogPost type locally since we removed the Supabase import
export type BlogPost = {
  id: string | number;
  title: string;
  excerpt?: string;
  content: string;
  category: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string | null;
  coverImage?: string;
  author?: { name: string };
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

export const getAllBlogPosts = async (category?: string) => {
  try {
    const currentUser = getCurrentUser();
    const isAdminPage = window.location.pathname.includes('/admin');

    console.log('Using mock data for blog posts');

    // Filter posts based on status if not on admin page
    let filteredPosts = [...mockBlogPosts];

    if (!isAdminPage) {
      filteredPosts = filteredPosts.filter(post => post.status === 'published');
    }

    // Add category filter if provided
    if (category) {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    // Cache the data for offline use
    localStorage.setItem('cached_blog_posts', JSON.stringify(filteredPosts));

    return {
      success: true,
      data: filteredPosts
    };
  } catch (error: any) {
    console.error('Error fetching mock blog posts:', error);

    // Try to use cached data as a last resort
    try {
      const cachedData = localStorage.getItem('cached_blog_posts');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        return {
          success: true,
          data: parsed,
          offline: true,
          message: 'Using cached data due to error'
        };
      }
    } catch (cacheError) {
      console.error('Error reading cached data:', cacheError);
    }

    return {
      success: false,
      message: error.message || 'Failed to fetch blog posts',
      data: []
    };
  }
};

export const getBlogPostById = async (id: string) => {
  try {
    console.log('Using mock data for blog post by ID:', id);

    // Find the blog post in mock data
    const post = mockBlogPosts.find(post => post.id.toString() === id);

    if (!post) {
      throw new Error('Blog post not found');
    }

    // Cache this individual blog post for offline access
    const cachedData = localStorage.getItem('cached_blog_posts');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      const index = parsed.findIndex((item: any) => item.id.toString() === id);
      if (index >= 0) {
        parsed[index] = post;
      } else {
        parsed.push(post);
      }
      localStorage.setItem('cached_blog_posts', JSON.stringify(parsed));
    } else {
      // Create a new cache with just this blog post
      localStorage.setItem('cached_blog_posts', JSON.stringify([post]));
    }

    return {
      success: true,
      data: post
    };
  } catch (error: any) {
    console.error('Error fetching mock blog post:', error);

    // Try to use cached data as a last resort
    try {
      const cachedData = localStorage.getItem('cached_blog_posts');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        const post = parsed.find((item: any) => item.id.toString() === id);
        if (post) {
          return {
            success: true,
            data: post,
            offline: true,
            message: 'Using cached data due to error'
          };
        }
      }
    } catch (cacheError) {
      console.error('Error reading cached data:', cacheError);
    }

    return {
      success: false,
      message: error.message || 'Failed to fetch blog post',
      data: null
    };
  }
};

// These functions are kept for backward compatibility
export const getMockBlogPosts = async (category?: string) => {
  return await getAllBlogPosts(category);
};

export const getMockBlogPostById = async (id: string) => {
  return await getBlogPostById(id);
};
