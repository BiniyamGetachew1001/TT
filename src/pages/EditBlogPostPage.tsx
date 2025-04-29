import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BlogPostForm from '../components/forms/BlogPostForm';
import { getBlogPostById } from '../services/blogService';
import { BlogPost } from '../services/blogService';

const EditBlogPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) {
        setError('Blog post ID is required');
        setLoading(false);
        return;
      }

      try {
        const post = await getBlogPostById(id);
        setBlogPost(post);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const handleSuccess = () => {
    navigate('/admin/content');
  };

  const handleCancel = () => {
    navigate('/admin/content');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-4">
          {error || 'Blog post not found'}
        </div>
        <Link 
          to="/admin/content" 
          className="text-gray-400 hover:text-white flex items-center transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Content Management
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link 
          to="/admin/content" 
          className="text-gray-400 hover:text-white flex items-center transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Content Management
        </Link>
      </div>

      <div className="bg-[#2d1e14] rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6 text-white border-b border-[#7a4528]/30 pb-4">
          Edit Blog Post: {blogPost.title}
        </h1>

        <BlogPostForm 
          blogPost={blogPost}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditBlogPostPage;
