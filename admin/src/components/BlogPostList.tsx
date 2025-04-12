import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';

import type { BlogPost } from '../lib/supabase';

interface BlogPostListProps {
  posts: (BlogPost & { author?: { name: string, email: string } })[];
  onDelete: (id: string) => void;
}

const BlogPostList: React.FC<BlogPostListProps> = ({ posts, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (postToDelete) {
      onDelete(postToDelete);
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = filterCategory ? post.category === filterCategory : true;
    const matchesStatus = filterStatus ? post.status === filterStatus : true;
    const matchesSearch = searchTerm
      ? post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const categories = [...new Set(posts.map(post => post.category))];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-grow min-w-[200px]">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input w-full"
          />
        </div>

        <div className="min-w-[150px]">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-select w-full"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="min-w-[150px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-select w-full"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <Link
          to="/blog-posts/new"
          className="gold-button ml-auto"
        >
          Add New Post
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Published Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="font-medium">
                      {post.title}
                    </div>
                    <div className="text-sm text-gray-400">
                      {post.excerpt && post.excerpt.length > 100
                        ? `${post.excerpt.substring(0, 100)}...`
                        : post.excerpt}
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-info">
                      {post.category}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${post.status === 'published' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td>{formatDate(post.published_at)}</td>
                  <td>
                    <div className="flex space-x-2">
                      <Link
                        to={`/blog-posts/view/${post.id}`}
                        className="p-1.5 glass-button text-blue-400 hover:text-blue-300"
                        title="View"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/blog-posts/edit/${post.id}`}
                        className="p-1.5 glass-button text-[#c9a52c] hover:text-[#d9b53c]"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(post.id)}
                        className="p-1.5 glass-button text-red-400 hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  No blog posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostList;
