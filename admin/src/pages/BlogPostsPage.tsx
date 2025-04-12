import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BlogPostList from '../components/BlogPostList';

// Mock data for blog posts
const mockBlogPosts = [
  {
    id: '1',
    title: 'How to Start a Successful Business in 2023',
    excerpt: 'Learn the essential steps to launch a thriving business in today\'s competitive market.',
    category: 'Entrepreneurship',
    status: 'published',
    publishedAt: '2023-07-10T12:00:00Z',
    author: { name: 'John Doe', id: 'user1' }
  },
  {
    id: '2',
    title: 'The Power of Compound Interest: Building Wealth Over Time',
    excerpt: 'Discover how compound interest can transform your financial future with consistent investments.',
    category: 'Finance',
    status: 'published',
    publishedAt: '2023-07-05T10:30:00Z',
    author: { name: 'Jane Smith', id: 'user2' }
  },
  {
    id: '3',
    title: '10 Essential Marketing Strategies for Small Businesses',
    excerpt: 'Effective marketing tactics that don\'t require a massive budget but deliver real results.',
    category: 'Marketing',
    status: 'draft',
    publishedAt: null,
    author: { name: 'Bob Johnson', id: 'user3' }
  },
  {
    id: '4',
    title: 'How to Build a Strong Company Culture',
    excerpt: 'Learn how to create a positive work environment that attracts and retains top talent.',
    category: 'Business',
    status: 'published',
    publishedAt: '2023-06-28T14:15:00Z',
    author: { name: 'Alice Brown', id: 'user4' }
  },
  {
    id: '5',
    title: 'The Future of E-commerce: Trends to Watch',
    excerpt: 'Stay ahead of the curve with these emerging e-commerce trends that are shaping the industry.',
    category: 'Technology',
    status: 'draft',
    publishedAt: null,
    author: { name: 'John Doe', id: 'user1' }
  }
];

const BlogPostsPage: React.FC = () => {
  const { supabase } = useAuth();
  const [blogPosts, setBlogPosts] = useState(mockBlogPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  useEffect(() => {
    // In a real implementation, you would fetch actual data from the API
    // For now, we'll use the mock data
    const fetchBlogPosts = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBlogPosts(mockBlogPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogPosts();
  }, [supabase]);
  
  const handleDeletePost = async (id: string) => {
    // In a real implementation, you would call the API to delete the post
    // For now, we'll just update the local state
    setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };
  
  // Filter posts based on search term, category, and status
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesCategory = filterCategory
      ? post.category === filterCategory
      : true;
    
    const matchesStatus = filterStatus
      ? post.status === filterStatus
      : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Get unique categories for filter dropdown
  const categories = [...new Set(blogPosts.map(post => post.category))];
  
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text">Blog Posts</h1>
          <p className="text-gray-400">Manage your blog content</p>
        </div>
        <Link to="/blog-posts/new" className="gold-button flex items-center mt-4 sm:mt-0">
          <Plus size={18} className="mr-2" />
          Add New Post
        </Link>
      </div>
      
      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>
      
      {/* Blog Post List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
        </div>
      ) : (
        <BlogPostList posts={filteredPosts} onDelete={handleDeletePost} />
      )}
    </div>
  );
};

export default BlogPostsPage;
