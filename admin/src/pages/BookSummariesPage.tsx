import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, DollarSign, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BookSummary } from '../lib/supabase';

// Mock data for book summaries
const mockBookSummaries = [
  {
    id: '1',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    description: 'Timeless lessons on wealth, greed, and happiness',
    coverImage: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&w=300&h=400',
    readTime: '15 min read',
    category: 'Finance',
    price: 9.99,
    createdAt: '2023-06-15T10:00:00Z',
    updatedAt: '2023-06-20T14:30:00Z'
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    coverImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&h=400',
    readTime: '18 min read',
    category: 'Self-Development',
    price: 9.99,
    createdAt: '2023-06-10T09:15:00Z',
    updatedAt: '2023-06-18T11:45:00Z'
  },
  {
    id: '3',
    title: 'Zero to One',
    author: 'Peter Thiel',
    description: 'Notes on Startups, or How to Build the Future',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=300&h=400',
    readTime: '12 min read',
    category: 'Startups',
    price: 9.99,
    createdAt: '2023-06-05T14:20:00Z',
    updatedAt: '2023-06-12T16:10:00Z'
  },
  {
    id: '4',
    title: 'Deep Work',
    author: 'Cal Newport',
    description: 'Rules for Focused Success in a Distracted World',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=300&h=400',
    readTime: '14 min read',
    category: 'Productivity',
    price: 9.99,
    createdAt: '2023-05-28T08:30:00Z',
    updatedAt: '2023-06-05T10:20:00Z'
  },
  {
    id: '5',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=300&h=400',
    readTime: '16 min read',
    category: 'Entrepreneurship',
    price: 9.99,
    createdAt: '2023-05-20T11:45:00Z',
    updatedAt: '2023-06-02T13:15:00Z'
  }
];

const BookSummariesPage: React.FC = () => {
  const [bookSummaries, setBookSummaries] = useState<BookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookSummaries = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('book_summaries')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setBookSummaries(data || []);
      } catch (err: any) {
        console.error('Error fetching book summaries:', err);
        // Check if the error is because the table doesn't exist
        if (err.code === '42P01') {
          setError('The book_summaries table does not exist. Please run the SQL scripts to create it.');
        } else {
          setError(err.message || 'Failed to load book summaries');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookSummaries();
  }, []);

  const handleDeleteClick = (id: string) => {
    setBookToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('book_summaries')
        .delete()
        .eq('id', bookToDelete);

      if (error) throw error;

      // Update local state
      setBookSummaries(prevBooks => prevBooks.filter(book => book.id !== bookToDelete));
      setDeleteModalOpen(false);
      setBookToDelete(null);
    } catch (err: any) {
      console.error('Error deleting book summary:', err);
      alert('Failed to delete book summary: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter book summaries based on search term and category
  const filteredBooks = bookSummaries.filter(book => {
    const matchesSearch = searchTerm
      ? book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesCategory = filterCategory
      ? book.category === filterCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(bookSummaries.map(book => book.category))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text">Book Summaries</h1>
          <p className="text-gray-400">Manage your book summary content</p>
        </div>
        <Link to="/book-summaries/new" className="gold-button flex items-center mt-4 sm:mt-0">
          <Plus size={18} className="mr-2" />
          Add New Book
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search books..."
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
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="admin-card mb-6 bg-red-900/30 border border-red-500/50">
          <div className="flex items-center">
            <AlertCircle className="text-red-400 mr-3" size={24} />
            <div>
              <h3 className="font-medium text-red-400">Error loading book summaries</h3>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Book Summaries List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <tr key={book.id}>
                    <td className="flex items-center">
                      <img
                        src={book.cover_image || '/placeholder-book.jpg'}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded mr-3"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-book.jpg';
                        }}
                      />
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-400">{book.read_time}</div>
                      </div>
                    </td>
                    <td>{book.author}</td>
                    <td>
                      <span className="admin-badge admin-badge-info">
                        {book.category}
                      </span>
                    </td>
                    <td>${book.price.toFixed(2)}</td>
                    <td>{formatDate(book.updated_at)}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Link
                          to={`/book-summaries/view/${book.id}`}
                          className="p-1.5 glass-button text-blue-400 hover:text-blue-300"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/book-summaries/edit/${book.id}`}
                          className="p-1.5 glass-button text-[#c9a52c] hover:text-[#d9b53c]"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(book.id)}
                          className="p-1.5 glass-button text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <Link
                          to={`/book-summaries/pricing/${book.id}`}
                          className="p-1.5 glass-button text-green-400 hover:text-green-300"
                          title="Set Price"
                        >
                          <DollarSign size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    No book summaries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete this book summary? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
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

export default BookSummariesPage;
