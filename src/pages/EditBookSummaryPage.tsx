import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BookSummaryForm from '../components/forms/BookSummaryForm';
import { getBookSummaryById } from '../services/bookSummaryService';
import { BookSummary } from '../services/BookSummaryService';

const EditBookSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [bookSummary, setBookSummary] = useState<BookSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookSummary = async () => {
      if (!id) {
        setError('Book summary ID is required');
        setLoading(false);
        return;
      }

      try {
        const summary = await getBookSummaryById(id);
        setBookSummary(summary);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch book summary');
      } finally {
        setLoading(false);
      }
    };

    fetchBookSummary();
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

  if (error || !bookSummary) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-4">
          {error || 'Book summary not found'}
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
          Edit Book Summary: {bookSummary.title}
        </h1>

        <BookSummaryForm 
          bookSummary={bookSummary}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditBookSummaryPage;
