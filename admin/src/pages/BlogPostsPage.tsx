import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BlogPostList from '../components/BlogPostList';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../lib/supabase';

const BlogPostsPage: React.FC = () => {
  const { user } = useAuth();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Temporarily use a simpler query until the schema is set up
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setBlogPosts(data || []);
      } catch (err: any) {
        console.error('Error fetching blog posts:', err);
        // Check if the error is because the table doesn't exist
        if (err.code === '42P01') {
          setError('The blog_posts table does not exist. Please run the SQL scripts to create it.');
        } else {
          setError(err.message || 'Failed to load blog posts');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleDeletePost = async (id: string) => {
    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setBlogPosts(prevPosts => prevPosts.filter(post => post.id !== id));
    } catch (err: any) {
      console.error('Error deleting blog post:', err);
      alert('Failed to delete blog post: ' + err.message);
    } finally {
      setIsLoading(false);
    }
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
  const categories = [...new Set(blogPosts.map(post => post.category).filter(Boolean))];

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

      {/* Error Message */}
      {error && (
        <div className="admin-card mb-6 bg-red-900/30 border border-red-500/50">
          <div className="flex items-center">
            <AlertCircle className="text-red-400 mr-3" size={24} />
            <div>
              <h3 className="font-medium text-red-400">Error loading blog posts</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

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
