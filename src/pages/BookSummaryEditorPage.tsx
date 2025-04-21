import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookSummary } from '../lib/supabase';
import { getBookSummaryById } from '../services/bookSummaryService';
import BookSummaryForm from '../components/forms/BookSummaryForm';
import { ArrowLeft } from 'lucide-react';

/**
 * BookSummaryEditorPage
 * 
 * A dedicated page for creating or editing book summaries
 */
const BookSummaryEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [bookSummary, setBookSummary] = useState<BookSummary | null>(null);
  const [loading, setLoading] = useState(id ? true : false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have an ID, fetch the book summary
    if (id) {
      const fetchBookSummary = async () => {
        setLoading(true);
        try {
          const result = await getBookSummaryById(id);
          if (result.success) {
            setBookSummary(result.data);
          } else {
            setError(result.message || 'Failed to fetch book summary');
          }
        } catch (err: any) {
          setError(err.message || 'An error occurred');
        } finally {
          setLoading(false);
        }
      };

      fetchBookSummary();
    }
  }, [id]);

  // Handle form success
  const handleSuccess = () => {
    // Navigate back to content management page
    navigate('/admin/content?tab=book-summaries');
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/content?tab=book-summaries');
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  // Show login option for non-admin users
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 gold-text">
            Admin Access Required
          </h2>
          <p className="text-gray-300 mb-6">
            You need admin privileges to access this page.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="gold-button inline-flex items-center"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/admin/content?tab=book-summaries')}
            className="mr-4 p-2 hover:bg-[#3a2819] rounded-full transition-colors"
            aria-label="Back to content management"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">
            {id ? 'Edit Book Summary' : 'Add New Book Summary'}
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
          </div>
        ) : (
          /* Book Summary Form */
          <div className="bg-[#2d1e14] rounded-lg p-6 shadow-lg">
            <BookSummaryForm
              bookSummary={bookSummary || undefined}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSummaryEditorPage;
