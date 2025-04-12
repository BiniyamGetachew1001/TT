import api from './api';

export const getAllBlogPosts = async (category?: string) => {
  try {
    const params = category ? { category } : {};
    const response = await api.get('/api/blog-posts', { params });
    
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
    const response = await api.get(`/api/blog-posts/${id}`);
    
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

// Mock data for development
export const getMockBlogPosts = () => {
  return {
    success: true,
    data: [
      {
        id: '1',
        title: 'How to Start a Successful Business in 2023',
        excerpt: 'Learn the essential steps to launch a thriving business in today\'s competitive market.',
        coverImage: '/placeholder-blog.jpg',
        category: 'Entrepreneurship',
        publishedAt: new Date().toISOString(),
        author: {
          name: 'John Smith'
        },
        tags: ['business', 'startup', 'entrepreneurship']
      },
      {
        id: '2',
        title: 'The Power of Compound Interest: Building Wealth Over Time',
        excerpt: 'Discover how compound interest can transform your financial future with consistent investments.',
        coverImage: '/placeholder-blog.jpg',
        category: 'Finance',
        publishedAt: new Date().toISOString(),
        author: {
          name: 'Sarah Johnson'
        },
        tags: ['finance', 'investing', 'wealth']
      },
      {
        id: '3',
        title: '10 Essential Marketing Strategies for Small Businesses',
        excerpt: 'Effective marketing tactics that don\'t require a massive budget but deliver real results.',
        coverImage: '/placeholder-blog.jpg',
        category: 'Marketing',
        publishedAt: new Date().toISOString(),
        author: {
          name: 'Michael Brown'
        },
        tags: ['marketing', 'small business', 'strategy']
      }
    ]
  };
};

export const getMockBlogPostById = (id: string) => {
  const posts = getMockBlogPosts().data;
  const post = posts.find(p => p.id === id);
  
  if (!post) {
    return {
      success: false,
      message: 'Blog post not found',
      data: null
    };
  }
  
  return {
    success: true,
    data: {
      ...post,
      content: `
        <h2>Introduction</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.</p>
        
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        
        <h2>Main Points</h2>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        
        <ul>
          <li>Point one about the topic</li>
          <li>Another important consideration</li>
          <li>Final key insight</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>In conclusion, this topic is essential for understanding modern business practices and can help you achieve better results in your professional endeavors.</p>
      `
    }
  };
};
