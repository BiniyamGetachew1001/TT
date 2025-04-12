import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogPostById, getMockBlogPostById } from '../services/blogService';
import BlogPostDetail from '../components/BlogPostDetail';

const BlogPostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // For development, use mock data
        const response = getMockBlogPostById(id);
        // In production, use this:
        // const response = await getBlogPostById(id);
        if (response.success) {
          setPost(response.data);
        } else {
          setError(response.message || 'Failed to fetch blog post');
        }
      } catch (err) {
        setError('An error occurred while fetching the blog post');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-6xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          {error || 'Blog post not found'}
        </h2>
        <p className="text-gray-400">
          The blog post you're looking for could not be found or is no longer available.
        </p>
      </div>
    );
  }

  return <BlogPostDetail post={post} />;
};

export default BlogPostDetailPage;
