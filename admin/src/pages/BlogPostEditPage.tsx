import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BlogPostForm from '../components/BlogPostForm';

// Mock data for a single blog post
const mockBlogPost = {
  id: '1',
  title: 'How to Start a Successful Business in 2023',
  excerpt: 'Learn the essential steps to launch a thriving business in today\'s competitive market.',
  content: '<h2>Introduction</h2><p>Starting a business can be both exciting and challenging. This guide will walk you through the essential steps to launch a successful business in 2023.</p><h2>Market Research</h2><p>Before diving in, it\'s crucial to understand your target market. Conduct thorough research to identify customer needs and pain points.</p><h2>Business Plan</h2><p>A solid business plan serves as your roadmap. It should outline your business goals, strategies, and financial projections.</p><h2>Funding</h2><p>Explore various funding options such as bootstrapping, loans, investors, or crowdfunding to get your business off the ground.</p><h2>Legal Structure</h2><p>Choose the right legal structure for your business (sole proprietorship, LLC, corporation) based on your needs and goals.</p><h2>Conclusion</h2><p>Starting a business requires careful planning and execution. By following these steps, you\'ll be well on your way to building a successful venture in 2023.</p>',
  coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&h=675',
  category: 'Entrepreneurship',
  tags: ['business', 'startup', 'entrepreneurship'],
  status: 'published',
  publishedAt: '2023-07-10T12:00:00Z',
  authorId: 'user1'
};

const BlogPostEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { supabase } = useAuth();
  const [blogPost, setBlogPost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isNewPost = id === 'new';
  
  useEffect(() => {
    // In a real implementation, you would fetch actual data from the API
    // For now, we'll use the mock data
    const fetchBlogPost = async () => {
      try {
        if (isNewPost) {
          setBlogPost({
            title: '',
            excerpt: '',
            content: '',
            coverImage: '',
            category: '',
            tags: [],
            status: 'draft',
            authorId: 'user1' // In a real app, this would be the current user's ID
          });
        } else {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setBlogPost(mockBlogPost);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogPost();
  }, [id, isNewPost, supabase]);
  
  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    setError(null);
    
    try {
      // In a real implementation, you would call the API to save the post
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate back to the blog posts list
      navigate('/blog-posts');
    } catch (err: any) {
      setError(err.message || 'Failed to save blog post');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-card p-6 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-4">{error}</h2>
        <button
          onClick={() => navigate('/blog-posts')}
          className="secondary-button"
        >
          Back to Blog Posts
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/blog-posts')}
          className="glass-button p-2 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold gold-text">
            {isNewPost ? 'Create New Blog Post' : 'Edit Blog Post'}
          </h1>
          <p className="text-gray-400">
            {isNewPost ? 'Add a new blog post to your site' : 'Update your blog post content'}
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="admin-card">
        <BlogPostForm
          initialData={blogPost}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
};

export default BlogPostEditPage;
