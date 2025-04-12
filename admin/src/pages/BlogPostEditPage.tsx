import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BlogPostForm from '../components/BlogPostForm';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../lib/supabase';

interface BlogPostEditPageProps {
  readOnly?: boolean;
}

const BlogPostEditPage: React.FC<BlogPostEditPageProps> = ({ readOnly = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blogPost, setBlogPost] = useState<Partial<BlogPost> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNewPost = id === 'new';

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (isNewPost) {
          setBlogPost({
            title: '',
            excerpt: '',
            content: '',
            cover_image: '',
            category: '',
            tags: [],
            status: 'draft',
            author_id: '00000000-0000-0000-0000-000000000000' // Use the admin user ID
          });
        } else if (id) {
          // Temporarily use a simpler query until the schema is set up
          const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;

          if (!data) {
            throw new Error('Blog post not found');
          }

          // Transform the data to match the form fields
          setBlogPost({
            ...data,
            coverImage: data.cover_image,
            publishedAt: data.published_at,
            authorId: data.author_id
          });
        }
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError(err.message || 'Failed to load blog post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, isNewPost, user]);

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    setError(null);

    try {
      console.log('Form data received:', formData);
      console.log('Cover image URL:', formData.coverImage);

      // Transform the form data to match the database schema
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        status: formData.status,
        cover_image: formData.coverImage,
        // Use the admin user ID
        author_id: '00000000-0000-0000-0000-000000000000',
        published_at: formData.status === 'published' ? new Date().toISOString() : null
      };

      console.log('Post data to save:', postData);

      if (isNewPost) {
        // Create a new blog post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
      } else if (id) {
        // Update an existing blog post
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
      }

      // Navigate back to the blog posts list
      navigate('/blog-posts');
    } catch (err: any) {
      console.error('Error saving blog post:', err);
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
            {isNewPost ? 'Create New Blog Post' : readOnly ? 'View Blog Post' : 'Edit Blog Post'}
          </h1>
          <p className="text-gray-400">
            {isNewPost ? 'Add a new blog post to your site' : readOnly ? 'View the details of this blog post' : 'Update your blog post content'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6 flex items-center">
          <AlertCircle className="text-red-400 mr-3" size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="admin-card">
        <BlogPostForm
          initialData={blogPost}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default BlogPostEditPage;
