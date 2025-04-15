import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, FileText } from 'lucide-react';
import { getUserPurchases, getMockUserPurchases } from '../services/purchaseService';
import { useAuth } from '../contexts/AuthContext';

const PurchasesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Use real data from Supabase
        const response = await getUserPurchases(user.id);
        if (response.success) {
          setPurchases(response.data);
        } else {
          setError(response.message || 'Failed to fetch purchases');
        }
      } catch (err) {
        setError('An error occurred while fetching your purchases');
        console.error('Error fetching purchases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [isAuthenticated, user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Please log in to view your purchases
        </h2>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-[#c9a52c] text-[#2d1e14] font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
        >
          Log In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          {error}
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-white rounded-md hover:bg-[#3a2819] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 gold-text">
          My Purchases
        </h1>
        <p className="text-gray-400">
          View and access all your purchased content
        </p>
      </div>

      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">
            You haven't made any purchases yet
          </h2>
          <p className="text-gray-400 mb-6">
            Explore our book summaries and business plans to find valuable content
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/book-summaries"
              className="inline-flex items-center px-6 py-3 bg-[#c9a52c] text-[#2d1e14] font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
            >
              <Book size={18} className="mr-2" />
              Book Summaries
            </Link>
            <Link
              to="/business-plans"
              className="inline-flex items-center px-6 py-3 border border-[#c9a52c] text-[#c9a52c] font-medium rounded-md hover:bg-[#3a2819] transition-colors"
            >
              <FileText size={18} className="mr-2" />
              Business Plans
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Book Summaries
            </h2>
            <div className="border-b border-[#7a4528] mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases
                .filter(purchase => purchase.item_type === 'book-summary')
                .map(purchase => (
                  <div key={purchase.id} className="bg-[#3a2819] rounded-lg overflow-hidden border border-[#7a4528]/30 flex flex-col h-full">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={purchase.book_summary?.cover_image || '/placeholder-book.jpg'}
                        alt={purchase.book_summary?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-book.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-bold mb-1">
                        {purchase.book_summary?.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        By {purchase.book_summary?.author}
                      </p>
                      <div className="flex justify-between items-center mt-auto mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#c9a52c]/20 text-[#c9a52c]">
                          {purchase.book_summary?.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          Purchased on {formatDate(purchase.created_at)}
                        </span>
                      </div>
                      <Link
                        to={`/reading/${purchase.item_id}`}
                        className="block w-full py-2 bg-[#c9a52c] text-[#2d1e14] text-center font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
                      >
                        Read Now
                      </Link>
                    </div>
                  </div>
                ))}
              {purchases.filter(purchase => purchase.item_type === 'book-summary').length === 0 && (
                <div className="col-span-full text-center py-4">
                  <p className="text-gray-400">
                    No book summaries purchased yet
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Business Plans
            </h2>
            <div className="border-b border-[#7a4528] mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases
                .filter(purchase => purchase.item_type === 'business-plan')
                .map(purchase => (
                  <div key={purchase.id} className="bg-[#3a2819] rounded-lg overflow-hidden border border-[#7a4528]/30 flex flex-col h-full">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={purchase.business_plan?.cover_image || '/placeholder-business.jpg'}
                        alt={purchase.business_plan?.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-business.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-bold mb-1">
                        {purchase.business_plan?.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {purchase.business_plan?.industry}
                      </p>
                      <div className="flex justify-between items-center mt-auto mb-4">
                        <span className="text-sm text-gray-300">
                          ${purchase.amount.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400">
                          Purchased on {formatDate(purchase.created_at)}
                        </span>
                      </div>
                      <Link
                        to={`/business-plans/${purchase.item_id}`}
                        className="block w-full py-2 bg-[#c9a52c] text-[#2d1e14] text-center font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
                      >
                        View Plan
                      </Link>
                    </div>
                  </div>
                ))}
              {purchases.filter(purchase => purchase.item_type === 'business-plan').length === 0 && (
                <div className="col-span-full text-center py-4">
                  <p className="text-gray-400">
                    No business plans purchased yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PurchasesPage;
