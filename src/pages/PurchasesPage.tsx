import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, FileText, Search, Calendar, DollarSign, ShoppingCart, Filter } from 'lucide-react';
import { getUserPurchases } from '../services/purchaseService';
import { useAuth } from '../contexts/AuthContext';
import PurchaseDetailModal from '../components/PurchaseDetailModal';

const PurchasesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for purchase details modal
  const [selectedPurchase, setSelectedPurchase] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Stats
  const [totalSpent, setTotalSpent] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [planCount, setPlanCount] = useState(0);

  // Filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');
  const [activeFilter, setActiveFilter] = useState('all');

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

          // Calculate stats
          const books = response.data.filter(p => p.item_type === 'book-summary');
          const plans = response.data.filter(p => p.item_type === 'business-plan');

          setBookCount(books.length);
          setPlanCount(plans.length);

          const total = response.data.reduce((sum, purchase) => sum + purchase.amount, 0);
          setTotalSpent(total);
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

  // Open purchase detail modal
  const handleOpenPurchaseDetail = (purchase: any) => {
    setSelectedPurchase(purchase);
    setIsDetailModalOpen(true);
  };

  // Filter and sort purchases
  const getFilteredAndSortedPurchases = () => {
    // First apply type filter
    let filtered = [...purchases];

    if (activeFilter !== 'all') {
      filtered = filtered.filter(purchase => purchase.item_type === activeFilter);
    }

    // Then apply search filter
    if (searchTerm) {
      filtered = filtered.filter(purchase => {
        const searchLower = searchTerm.toLowerCase();

        // Get the appropriate item based on type
        const item = purchase.item_type === 'book-summary'
          ? purchase.book_summary
          : purchase.business_plan;

        if (!item) return false;

        // Search in different fields based on item type
        if (purchase.item_type === 'book-summary') {
          return (
            item.title?.toLowerCase().includes(searchLower) ||
            item.author?.toLowerCase().includes(searchLower) ||
            item.category?.toLowerCase().includes(searchLower)
          );
        } else {
          return (
            item.title?.toLowerCase().includes(searchLower) ||
            item.industry?.toLowerCase().includes(searchLower)
          );
        }
      });
    }

    // Finally apply sorting
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'price-asc':
          return a.amount - b.amount;
        case 'price-desc':
          return b.amount - a.amount;
        case 'title-asc':
          const titleA = a.item_type === 'book-summary'
            ? a.book_summary?.title || ''
            : a.business_plan?.title || '';
          const titleB = b.item_type === 'book-summary'
            ? b.book_summary?.title || ''
            : b.business_plan?.title || '';
          return titleA.localeCompare(titleB);
        case 'title-desc':
          const titleC = a.item_type === 'book-summary'
            ? a.book_summary?.title || ''
            : a.business_plan?.title || '';
          const titleD = b.item_type === 'book-summary'
            ? b.book_summary?.title || ''
            : b.business_plan?.title || '';
          return titleD.localeCompare(titleC);
        default:
          return 0;
      }
    });
  };

  // Get filtered purchases
  const filteredPurchases = getFilteredAndSortedPurchases();
  const filteredBookSummaries = filteredPurchases.filter(p => p.item_type === 'book-summary');
  const filteredBusinessPlans = filteredPurchases.filter(p => p.item_type === 'business-plan');

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

      {/* Search and Filter Controls */}
      {purchases.length > 0 && (
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 pl-10 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="title-asc">Title: A-Z</option>
              <option value="title-desc">Title: Z-A</option>
            </select>

            <div className="flex items-center gap-2 bg-[#2d1e14] border border-[#7a4528]/50 rounded-md px-3">
              <Filter size={16} className="text-gray-400" />
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="bg-transparent border-none text-white focus:outline-none py-2"
              >
                <option value="all">All Types</option>
                <option value="book-summary">Books Only</option>
                <option value="business-plan">Business Plans Only</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {purchases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#3a2819] rounded-lg p-6 border border-[#7a4528]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Purchases</p>
                <h3 className="text-2xl font-bold mt-1">{purchases.length}</h3>
              </div>
              <div className="bg-[#c9a52c]/20 p-3 rounded-full">
                <ShoppingCart size={24} className="text-[#c9a52c]" />
              </div>
            </div>
          </div>

          <div className="bg-[#3a2819] rounded-lg p-6 border border-[#7a4528]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Spent</p>
                <h3 className="text-2xl font-bold mt-1">${totalSpent.toFixed(2)}</h3>
              </div>
              <div className="bg-[#c9a52c]/20 p-3 rounded-full">
                <DollarSign size={24} className="text-[#c9a52c]" />
              </div>
            </div>
          </div>

          <div className="bg-[#3a2819] rounded-lg p-6 border border-[#7a4528]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Latest Purchase</p>
                <h3 className="text-lg font-bold mt-1">
                  {purchases.length > 0 ? formatDate(purchases[0].created_at) : 'N/A'}
                </h3>
              </div>
              <div className="bg-[#c9a52c]/20 p-3 rounded-full">
                <Calendar size={24} className="text-[#c9a52c]" />
              </div>
            </div>
          </div>
        </div>
      )}

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
      ) : filteredPurchases.length === 0 ? (
        <div className="text-center py-12 bg-[#2d1e14] rounded-lg border border-[#7a4528]/30 p-6">
          <h2 className="text-xl font-semibold mb-2">
            No results found
          </h2>
          <p className="text-gray-400 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSortOption('date-desc');
              setActiveFilter('all');
            }}
            className="inline-flex items-center px-6 py-3 bg-[#c9a52c] text-[#2d1e14] font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">
              Book Summaries
            </h2>
            <div className="border-b border-[#7a4528] mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookSummaries.map(purchase => (
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
                      <div className="flex gap-2">
                        <Link
                          to={`/reading/${purchase.item_id}`}
                          className="flex-1 py-2 bg-[#c9a52c] text-[#2d1e14] text-center font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
                        >
                          Read Now
                        </Link>
                        <button
                          onClick={() => handleOpenPurchaseDetail(purchase)}
                          className="px-3 py-2 border border-[#7a4528] rounded-md hover:bg-[#4a3829] transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {filteredBookSummaries.length === 0 && (
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
              {filteredBusinessPlans.map(purchase => (
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
                      <div className="flex gap-2">
                        <Link
                          to={`/business-plans/${purchase.item_id}`}
                          className="flex-1 py-2 bg-[#c9a52c] text-[#2d1e14] text-center font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
                        >
                          View Plan
                        </Link>
                        <button
                          onClick={() => handleOpenPurchaseDetail(purchase)}
                          className="px-3 py-2 border border-[#7a4528] rounded-md hover:bg-[#4a3829] transition-colors"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              {filteredBusinessPlans.length === 0 && (
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

      {/* Purchase Detail Modal */}
      <PurchaseDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        purchase={selectedPurchase}
      />
    </div>
  );
};

export default PurchasesPage;
