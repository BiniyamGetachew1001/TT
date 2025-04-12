import api from './api';

export const getAllBlogPosts = async (category?: string) => {
  try {
    const params = category ? { category } : {};
    const response = await api.get('/blog-posts', { params });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to fetch blog posts',
      data: []
    };
  }
};

export const getBlogPostById = async (id: string) => {
  try {
    const response = await api.get(`/blog-posts/${id}`);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to fetch blog post',
      data: null
    };
  }
};

export const createBlogPost = async (postData: any) => {
  try {
    const response = await api.post('/blog-posts', postData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to create blog post'
    };
  }
};

export const updateBlogPost = async (id: string, postData: any) => {
  try {
    const response = await api.put(`/blog-posts/${id}`, postData);
    
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to update blog post'
    };
  }
};

export const deleteBlogPost = async (id: string) => {
  try {
    await api.delete(`/blog-posts/${id}`);
    
    return {
      success: true
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to delete blog post'
    };
  }
};
