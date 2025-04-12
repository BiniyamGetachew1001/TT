import React, { useState, useEffect } from 'react';
import { getAllBlogPosts } from '../services/blogService';
import BlogPostCard from '../components/BlogPostCard';

const BLOG_CATEGORIES = [
  'Business',
  'Entrepreneurship',
  'Finance',
  'Marketing',
  'Self-Development',
  'Technology',
  'Other'
];

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Use real data from Supabase
        const response = await getAllBlogPosts(filterCategory);
        if (response.success) {
          setPosts(response.data);
        } else {
          setError(response.message || 'Failed to fetch blog posts');
        }
      } catch (err) {
        setError('An error occurred while fetching blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filterCategory]);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 gold-text">
          Blog
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore our latest articles on business, entrepreneurship, and personal development
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex-grow min-w-[200px]">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-[#3a2819] border border-[#7a4528]/50 rounded-md focus:outline-none focus:border-[#c9a52c]/50"
          />
        </div>

        <div className="min-w-[150px]">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-2 bg-[#3a2819] border border-[#7a4528]/50 rounded-md focus:outline-none focus:border-[#c9a52c]/50"
          >
            <option value="">All Categories</option>
            {BLOG_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div key={post.id}>
              <BlogPostCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p>No blog posts found</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
