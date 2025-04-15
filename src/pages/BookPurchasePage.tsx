import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BookPurchase from '../components/BookPurchase';
import { checkPurchaseStatus } from '../services/purchaseService';
import { getBookSummaryById } from '../services/bookSummaryService';
import { useAuth } from '../contexts/AuthContext';
import { BookSummary } from '../lib/supabase';



const BookPurchasePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState<BookSummary | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch book details
        const result = await getBookSummaryById(id);
        if (result.success && result.data) {
          setBook(result.data);
        } else {
          setError(result.message || 'Failed to load book details');
        }

        // Check if user has already purchased this book
        if (isAuthenticated && user) {
          const purchaseStatus = await checkPurchaseStatus(user.id, 'book-summary', id);
          setIsPurchased(purchaseStatus.purchased);
        }
      } catch (err) {
        setError('An error occurred while loading the book details');
        console.error('Error loading book purchase page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAuthenticated, user]);

  const handlePurchaseComplete = () => {
    setIsPurchased(true);
    // Optionally redirect to reading page after successful purchase
    setTimeout(() => {
      navigate(`/reading/${id}`);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-6xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          {error || 'Book not found'}
        </h2>
        <button
          onClick={() => navigate('/book-summaries')}
          className="mt-4 px-4 py-2 border border-white rounded-md hover:bg-[#3a2819] transition-colors"
        >
          Back to Book Summaries
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-6">
        <button
          className="flex items-center text-white hover:text-[#c9a52c] transition-colors"
          onClick={() => navigate(`/books/${id}`)}
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Book Details
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 gold-text">
        Purchase Book Summary
      </h1>

      <BookPurchase
        book={{
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          coverImage: book.cover_image || '',
          category: book.category,
          readTime: book.read_time,
          price: book.price
        }}
        isPurchased={isPurchased}
        onPurchaseComplete={handlePurchaseComplete}
      />
    </div>
  );
};

export default BookPurchasePage;
