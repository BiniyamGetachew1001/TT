import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/simple-tabs';
import { Book, FileText, Newspaper, Plus, Search, Trash2, Edit, Eye, ShoppingCart, User, Calendar } from 'lucide-react';
import ActivityLog from '../components/ui/activity-log';
import FilterBar from '../components/ui/filter-bar';
import { getAllBookSummaries } from '../services/bookSummaryService';
import { getAllBusinessPlans } from '../services/businessPlanService';
import { getAllBlogPosts } from '../services/blogService';
import { getAllPurchases, updatePurchaseStatus } from '../services/purchaseService';
import { deleteBookSummary, deleteBusinessPlan, deleteBlogPost, updateBlogPost } from '../services/contentManagementService';
import { BookSummary, BusinessPlan, BlogPost, Purchase } from '../lib/supabase';
import Modal from '../components/ui/modal';
import BookSummaryForm from '../components/forms/BookSummaryForm';
import BusinessPlanForm from '../components/forms/BusinessPlanForm';
import BlogPostForm from '../components/forms/BlogPostForm';

const ContentManagementPage: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();
  const [bookSummaries, setBookSummaries] = useState<BookSummary[]>([]);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering and sorting states
  const [bookFilter, setBookFilter] = useState('');
  const [bookSort, setBookSort] = useState('title');
  const [bookSortDirection, setBookSortDirection] = useState<'asc' | 'desc'>('asc');

  const [businessFilter, setBusinessFilter] = useState('');
  const [businessSort, setBusinessSort] = useState('title');
  const [businessSortDirection, setBusinessSortDirection] = useState<'asc' | 'desc'>('asc');

  const [blogFilter, setBlogFilter] = useState('');
  const [blogSort, setBlogSort] = useState('title');
  const [blogSortDirection, setBlogSortDirection] = useState<'asc' | 'desc'>('asc');

  const [purchaseFilter, setPurchaseFilter] = useState('');
  const [purchaseSort, setPurchaseSort] = useState('created_at');
  const [purchaseSortDirection, setPurchaseSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'book' | 'business' | 'blog' | null>(null);
  const [editItem, setEditItem] = useState<BookSummary | BusinessPlan | BlogPost | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'book' | 'business' | 'blog'} | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // State for bulk actions
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>([]);
  const [selectedBlogIds, setSelectedBlogIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch book summaries
        const bookResult = await getAllBookSummaries();
        if (bookResult.success) {
          setBookSummaries(bookResult.data);
        } else {
          setError(bookResult.message || 'Failed to fetch book summaries');
        }

        // Fetch business plans
        const planResult = await getAllBusinessPlans();
        if (planResult.success) {
          setBusinessPlans(planResult.data);
        } else {
          setError(planResult.message || 'Failed to fetch business plans');
        }

        // Fetch blog posts
        const blogResult = await getAllBlogPosts();
        if (blogResult.success) {
          // Type assertion to handle the mismatch
          setBlogPosts(blogResult.data as unknown as BlogPost[]);
        } else {
          setError(blogResult.message || 'Failed to fetch blog posts');
        }

        // Fetch purchases
        const purchasesResult = await getAllPurchases();
        if (purchasesResult.success) {
          setPurchases(purchasesResult.data);
        } else {
          setError(purchasesResult.message || 'Failed to fetch purchases');
        }

      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching content');
      } finally {
        setLoading(false);
      }
    };

    // Make fetchContent available to other functions
    (window as any).fetchContentRef = fetchContent;

    if (!isLoading && isAdmin) {
      fetchContent();
    }
  }, [isLoading, isAdmin]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  // Navigation functions for editor pages
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Set the active tab based on URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      // The tab parameter is used by the Tabs component
    }
  }, [searchParams]);

  const handleAddNew = (type: 'book' | 'business' | 'blog') => {
    switch (type) {
      case 'book':
        navigate('/admin/book-summaries/new');
        break;
      case 'business':
        navigate('/admin/business-plans/new');
        break;
      case 'blog':
        navigate('/admin/blog-posts/new');
        break;
    }
  };

  const handleEdit = (type: 'book' | 'business' | 'blog', id: string) => {
    switch (type) {
      case 'book':
        navigate(`/admin/book-summaries/edit/${id}`);
        break;
      case 'business':
        navigate(`/admin/business-plans/edit/${id}`);
        break;
      case 'blog':
        navigate(`/admin/blog-posts/edit/${id}`);
        break;
    }
  };

  const handleOpenDeleteConfirm = (id: string, type: 'book' | 'business' | 'blog') => {
    setItemToDelete({ id, type });
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      let result;

      switch (itemToDelete.type) {
        case 'book':
          result = await deleteBookSummary(itemToDelete.id);
          if (result.success) {
            setBookSummaries(prev => prev.filter(item => item.id !== itemToDelete.id));
            setActionSuccess('Book summary deleted successfully');
          }
          break;

        case 'business':
          result = await deleteBusinessPlan(itemToDelete.id);
          if (result.success) {
            setBusinessPlans(prev => prev.filter(item => item.id !== itemToDelete.id));
            setActionSuccess('Business plan deleted successfully');
          }
          break;

        case 'blog':
          result = await deleteBlogPost(itemToDelete.id);
          if (result.success) {
            setBlogPosts(prev => prev.filter(item => item.id !== itemToDelete.id));
            setActionSuccess('Blog post deleted successfully');
          }
          break;
      }

      handleCloseDeleteConfirm();
    } catch (error: any) {
      setError(error.message || 'Failed to delete item');
      handleCloseDeleteConfirm();
    }
  };

  const handleFormSuccess = () => {
    handleCloseModal();
    // Call fetchContent from the window reference
    if ((window as any).fetchContentRef) {
      (window as any).fetchContentRef();
    }
  };

  // Filter and sort functions
  const filteredBookSummaries = bookSummaries
    .filter(book => {
      // Apply search filter
      const matchesSearch = !searchTerm ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply category filter
      const matchesFilter = !bookFilter || book.category === bookFilter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Apply sorting
      if (bookSort === 'title') {
        return bookSortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (bookSort === 'author') {
        return bookSortDirection === 'asc'
          ? a.author.localeCompare(b.author)
          : b.author.localeCompare(a.author);
      } else if (bookSort === 'price') {
        return bookSortDirection === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      } else if (bookSort === 'created_at') {
        return bookSortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  const filteredBusinessPlans = businessPlans
    .filter(plan => {
      // Apply search filter
      const matchesSearch = !searchTerm ||
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.industry.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply industry filter
      const matchesFilter = !businessFilter || plan.industry === businessFilter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Apply sorting
      if (businessSort === 'title') {
        return businessSortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (businessSort === 'industry') {
        return businessSortDirection === 'asc'
          ? a.industry.localeCompare(b.industry)
          : b.industry.localeCompare(a.industry);
      } else if (businessSort === 'price') {
        return businessSortDirection === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      } else if (businessSort === 'created_at') {
        return businessSortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  const filteredBlogPosts = blogPosts
    .filter(post => {
      // Apply search filter
      const matchesSearch = !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply status filter
      const matchesFilter = !blogFilter || post.status === blogFilter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Apply sorting
      if (blogSort === 'title') {
        return blogSortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (blogSort === 'category') {
        return blogSortDirection === 'asc'
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      } else if (blogSort === 'status') {
        return blogSortDirection === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      } else if (blogSort === 'published_at') {
        // Handle null published_at dates
        if (!a.published_at && !b.published_at) return 0;
        if (!a.published_at) return blogSortDirection === 'asc' ? 1 : -1;
        if (!b.published_at) return blogSortDirection === 'asc' ? -1 : 1;

        return blogSortDirection === 'asc'
          ? new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
          : new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      } else if (blogSort === 'created_at') {
        return blogSortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  const filteredPurchases = purchases
    .filter(purchase => {
      // Apply search filter
      const userEmail = purchase.user?.email || '';
      const userName = purchase.user?.name || '';
      const itemType = purchase.item_type || '';
      const status = purchase.status || '';
      const paymentId = purchase.payment_id || '';

      // Get item title based on item_type
      let itemTitle = '';
      if (purchase.item_type === 'book-summary' && purchase.book_summary) {
        itemTitle = purchase.book_summary.title || '';
      } else if (purchase.item_type === 'business-plan' && purchase.business_plan) {
        itemTitle = purchase.business_plan.title || '';
      }

      const matchesSearch = !searchTerm ||
        userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        itemTitle.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply status filter
      const matchesFilter = !purchaseFilter || purchase.status === purchaseFilter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Apply sorting
      if (purchaseSort === 'created_at') {
        return purchaseSortDirection === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (purchaseSort === 'amount') {
        return purchaseSortDirection === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (purchaseSort === 'status') {
        const statusA = a.status || '';
        const statusB = b.status || '';
        return purchaseSortDirection === 'asc'
          ? statusA.localeCompare(statusB)
          : statusB.localeCompare(statusA);
      }
      return 0;
    });

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
            You need admin privileges to access the content management page.
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <Link
              to="/login"
              state={{ from: '/admin/content' }}
              className="gold-button inline-flex items-center"
            >
              Login as Admin
            </Link>
            <p className="text-sm text-gray-400 mt-2">
              For demo purposes, use email: <span className="text-[#c9a52c]">biniyam.getachew@aastustudent.edu.et</span><br/>with any password
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:flex-grow">
        {actionSuccess && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-md mb-6">
            {actionSuccess}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Content Management</h1>

          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 pl-10 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
            />
          </div>
        </div>

        <Tabs defaultValue="book-summaries" className="w-full">
          <TabsList className="mb-6 bg-[#2d1e14] p-1 rounded-lg">
            <TabsTrigger value="book-summaries" className="flex items-center">
              <Book size={16} className="mr-2" /> Book Summaries
            </TabsTrigger>
            <TabsTrigger value="business-plans" className="flex items-center">
              <FileText size={16} className="mr-2" /> Business Plans
            </TabsTrigger>
            <TabsTrigger value="blog-posts" className="flex items-center">
              <Newspaper size={16} className="mr-2" /> Blog Posts
            </TabsTrigger>
            <TabsTrigger value="purchases" className="flex items-center">
              <ShoppingCart size={16} className="mr-2" /> Purchases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book-summaries">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            ) : (
              <>
                {/* Book Summary Actions */}
                <div className="mb-4 flex justify-between items-center">
                  {/* Bulk Actions */}
                  <div className="flex items-center gap-2">

                  {/* Filter and Sort Options */}
                  <FilterBar
                    filterOptions={[
                      { label: 'All Categories', value: '' },
                      { label: 'Business', value: 'Business' },
                      { label: 'Self-Help', value: 'Self-Help' },
                      { label: 'Finance', value: 'Finance' },
                      { label: 'Leadership', value: 'Leadership' },
                      { label: 'Productivity', value: 'Productivity' }
                    ]}
                    sortOptions={[
                      { label: 'Title', value: 'title' },
                      { label: 'Author', value: 'author' },
                      { label: 'Price', value: 'price' },
                      { label: 'Date Added', value: 'created_at' }
                    ]}
                    onFilterChange={setBookFilter}
                    onSortChange={(sort, direction) => {
                      setBookSort(sort);
                      setBookSortDirection(direction);
                    }}
                    activeFilter={bookFilter}
                    activeSort={bookSort}
                    activeSortDirection={bookSortDirection}
                  />
                    {selectedBookIds.length > 0 && (
                      <div className="relative inline-block text-left">
                        <select
                          className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                          onChange={(e) => {
                            const action = e.target.value;
                            if (!action) return;

                            // Handle bulk actions
                            if (action === 'delete') {
                              // Confirm before deleting
                              if (window.confirm(`Are you sure you want to delete ${selectedBookIds.length} selected items?`)) {
                                // Delete selected items
                                Promise.all(selectedBookIds.map(id => deleteBookSummary(id)))
                                  .then(() => {
                                    setBookSummaries(prev => prev.filter(item => !selectedBookIds.includes(item.id)));
                                    setSelectedBookIds([]);
                                    setActionSuccess(`Deleted ${selectedBookIds.length} book summaries successfully`);
                                  })
                                  .catch(err => {
                                    setError(`Failed to delete some items: ${err.message}`);
                                  });
                              }
                            }

                            // Reset the select
                            e.target.value = '';
                          }}
                        >
                          <option value="">Bulk Actions ({selectedBookIds.length} selected)</option>
                          <option value="delete">Delete Selected</option>
                        </select>
                      </div>
                    )}

                    {selectedBookIds.length > 0 && (
                      <button
                        onClick={() => setSelectedBookIds([])}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  {/* Add New Button */}
                  <button
                    onClick={() => handleAddNew('book')}
                    className="gold-button flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Book Summary
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#2d1e14] text-left">
                        <th className="p-3 rounded-tl-lg w-10">
                          <input
                            type="checkbox"
                            className="rounded border-[#7a4528] text-[#c9a52c] focus:ring-[#c9a52c]"
                            checked={filteredBookSummaries.length > 0 && selectedBookIds.length === filteredBookSummaries.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Select all
                                setSelectedBookIds(filteredBookSummaries.map(book => book.id));
                              } else {
                                // Deselect all
                                setSelectedBookIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Author</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookSummaries.length > 0 ? (
                        filteredBookSummaries.map((book) => (
                          <tr key={book.id} className="border-b border-[#3a2819] hover:bg-[#3a2819]/50">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                className="rounded border-[#7a4528] text-[#c9a52c] focus:ring-[#c9a52c]"
                                checked={selectedBookIds.includes(book.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBookIds(prev => [...prev, book.id]);
                                  } else {
                                    setSelectedBookIds(prev => prev.filter(id => id !== book.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                  <img
                                    src={book.cover_image || '/placeholder-book.jpg'}
                                    alt={book.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder-book.jpg';
                                    }}
                                  />
                                </div>
                                <span className="font-medium">{book.title}</span>
                              </div>
                            </td>
                            <td className="p-3">{book.author}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-[#3a2819] rounded-full text-xs">
                                {book.category}
                              </span>
                            </td>
                            <td className="p-3">
                              {book.price > 0 ? `$${book.price.toFixed(2)}` : 'Free'}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit('book', book.id)}
                                  className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center"
                                >
                                  <Edit size={14} className="mr-1" /> Edit
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteConfirm(book.id, 'book')}
                                  className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-sm flex items-center"
                                >
                                  <Trash2 size={14} className="mr-1" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : searchTerm ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No results found for "{searchTerm}"
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No book summaries found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="business-plans">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            ) : (
              <>
                {/* Business Plan Actions */}
                <div className="mb-4 flex justify-between items-center">
                  {/* Bulk Actions */}
                  <div className="flex items-center gap-2">

                  {/* Filter and Sort Options */}
                  <FilterBar
                    filterOptions={[
                      { label: 'All Industries', value: '' },
                      { label: 'Technology', value: 'Technology' },
                      { label: 'Food & Beverage', value: 'Food & Beverage' },
                      { label: 'Healthcare', value: 'Healthcare' },
                      { label: 'Retail', value: 'Retail' },
                      { label: 'Education', value: 'Education' }
                    ]}
                    sortOptions={[
                      { label: 'Title', value: 'title' },
                      { label: 'Industry', value: 'industry' },
                      { label: 'Price', value: 'price' },
                      { label: 'Date Added', value: 'created_at' }
                    ]}
                    onFilterChange={setBusinessFilter}
                    onSortChange={(sort, direction) => {
                      setBusinessSort(sort);
                      setBusinessSortDirection(direction);
                    }}
                    activeFilter={businessFilter}
                    activeSort={businessSort}
                    activeSortDirection={businessSortDirection}
                  />
                    {selectedBusinessIds.length > 0 && (
                      <div className="relative inline-block text-left">
                        <select
                          className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                          onChange={(e) => {
                            const action = e.target.value;
                            if (!action) return;

                            // Handle bulk actions
                            if (action === 'delete') {
                              // Confirm before deleting
                              if (window.confirm(`Are you sure you want to delete ${selectedBusinessIds.length} selected items?`)) {
                                // Delete selected items
                                Promise.all(selectedBusinessIds.map(id => deleteBusinessPlan(id)))
                                  .then(() => {
                                    setBusinessPlans(prev => prev.filter(item => !selectedBusinessIds.includes(item.id)));
                                    setSelectedBusinessIds([]);
                                    setActionSuccess(`Deleted ${selectedBusinessIds.length} business plans successfully`);
                                  })
                                  .catch(err => {
                                    setError(`Failed to delete some items: ${err.message}`);
                                  });
                              }
                            }

                            // Reset the select
                            e.target.value = '';
                          }}
                        >
                          <option value="">Bulk Actions ({selectedBusinessIds.length} selected)</option>
                          <option value="delete">Delete Selected</option>
                        </select>
                      </div>
                    )}

                    {selectedBusinessIds.length > 0 && (
                      <button
                        onClick={() => setSelectedBusinessIds([])}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  {/* Add New Button */}
                  <button
                    onClick={() => handleAddNew('business')}
                    className="gold-button flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Business Plan
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#2d1e14] text-left">
                        <th className="p-3 rounded-tl-lg w-10">
                          <input
                            type="checkbox"
                            className="rounded border-[#7a4528] text-[#c9a52c] focus:ring-[#c9a52c]"
                            checked={filteredBusinessPlans.length > 0 && selectedBusinessIds.length === filteredBusinessPlans.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Select all
                                setSelectedBusinessIds(filteredBusinessPlans.map(plan => plan.id));
                              } else {
                                // Deselect all
                                setSelectedBusinessIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Author</th>
                        <th className="p-3">Industry</th>
                        <th className="p-3">Price</th>
                        <th className="p-3 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBusinessPlans.length > 0 ? (
                        filteredBusinessPlans.map((plan) => (
                          <tr key={plan.id} className="border-b border-[#3a2819] hover:bg-[#3a2819]/50">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                className="rounded border-[#7a4528] text-[#c9a52c] focus:ring-[#c9a52c]"
                                checked={selectedBusinessIds.includes(plan.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBusinessIds(prev => [...prev, plan.id]);
                                  } else {
                                    setSelectedBusinessIds(prev => prev.filter(id => id !== plan.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                  <img
                                    src={plan.cover_image || '/placeholder-business.jpg'}
                                    alt={plan.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder-business.jpg';
                                    }}
                                  />
                                </div>
                                <span className="font-medium">{plan.title}</span>
                              </div>
                            </td>
                            <td className="p-3">{plan.author}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-[#3a2819] rounded-full text-xs">
                                {plan.industry}
                              </span>
                            </td>
                            <td className="p-3">
                              {plan.price > 0 ? `$${plan.price.toFixed(2)}` : 'Free'}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit('business', plan.id)}
                                  className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center"
                                >
                                  <Edit size={14} className="mr-1" /> Edit
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteConfirm(plan.id, 'business')}
                                  className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-sm flex items-center"
                                >
                                  <Trash2 size={14} className="mr-1" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : searchTerm ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No results found for "{searchTerm}"
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No business plans found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="blog-posts">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            ) : (
              <>
                {/* Blog Post Actions */}
                <div className="mb-4 flex justify-between items-center">
                  {/* Bulk Actions */}
                  <div className="flex items-center gap-2">

                  {/* Filter and Sort Options */}
                  <FilterBar
                    filterOptions={[
                      { label: 'All Statuses', value: '' },
                      { label: 'Published', value: 'published' },
                      { label: 'Draft', value: 'draft' },
                      { label: 'Scheduled', value: 'scheduled' },
                      { label: 'Archived', value: 'archived' }
                    ]}
                    sortOptions={[
                      { label: 'Title', value: 'title' },
                      { label: 'Category', value: 'category' },
                      { label: 'Status', value: 'status' },
                      { label: 'Publish Date', value: 'published_at' },
                      { label: 'Date Added', value: 'created_at' }
                    ]}
                    onFilterChange={setBlogFilter}
                    onSortChange={(sort, direction) => {
                      setBlogSort(sort);
                      setBlogSortDirection(direction);
                    }}
                    activeFilter={blogFilter}
                    activeSort={blogSort}
                    activeSortDirection={blogSortDirection}
                  />
                    {selectedBlogIds.length > 0 && (
                      <div className="relative inline-block text-left">
                        <select
                          className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                          onChange={(e) => {
                            const action = e.target.value;
                            if (!action) return;

                            // Handle bulk actions
                            if (action === 'delete') {
                              // Confirm before deleting
                              if (window.confirm(`Are you sure you want to delete ${selectedBlogIds.length} selected items?`)) {
                                // Delete selected items
                                Promise.all(selectedBlogIds.map(id => deleteBlogPost(id)))
                                  .then(() => {
                                    setBlogPosts(prev => prev.filter(item => !selectedBlogIds.includes(item.id)));
                                    setSelectedBlogIds([]);
                                    setActionSuccess(`Deleted ${selectedBlogIds.length} blog posts successfully`);
                                  })
                                  .catch(err => {
                                    setError(`Failed to delete some items: ${err.message}`);
                                  });
                              }
                            } else if (action === 'publish') {
                              // Publish selected items immediately
                              const updates = selectedBlogIds.map(id => {
                                return updateBlogPost(id, {
                                  status: 'published',
                                  published_at: new Date().toISOString(),
                                  scheduled_for: null
                                });
                              });

                              Promise.all(updates)
                                .then(() => {
                                  // Refresh the data
                                  if ((window as any).fetchContentRef) {
                                    (window as any).fetchContentRef();
                                  }
                                  setSelectedBlogIds([]);
                                  setActionSuccess(`Published ${selectedBlogIds.length} blog posts successfully`);
                                })
                                .catch(err => {
                                  setError(`Failed to publish some items: ${err.message}`);
                                });
                            } else if (action === 'schedule') {
                              // Schedule selected items for tomorrow
                              const tomorrow = new Date();
                              tomorrow.setDate(tomorrow.getDate() + 1);
                              tomorrow.setHours(9, 0, 0, 0); // 9:00 AM tomorrow

                              const scheduledDate = tomorrow.toISOString();

                              const updates = selectedBlogIds.map(id => {
                                return updateBlogPost(id, {
                                  status: 'scheduled',
                                  published_at: null,
                                  scheduled_for: scheduledDate
                                });
                              });

                              Promise.all(updates)
                                .then(() => {
                                  // Refresh the data
                                  if ((window as any).fetchContentRef) {
                                    (window as any).fetchContentRef();
                                  }
                                  setSelectedBlogIds([]);
                                  setActionSuccess(`Scheduled ${selectedBlogIds.length} blog posts for ${tomorrow.toLocaleString()}`);
                                })
                                .catch(err => {
                                  setError(`Failed to schedule some items: ${err.message}`);
                                });
                            } else if (action === 'archive') {
                              // Archive selected items
                              const updates = selectedBlogIds.map(id => {
                                return updateBlogPost(id, { status: 'archived' });
                              });

                              Promise.all(updates)
                                .then(() => {
                                  // Refresh the data
                                  if ((window as any).fetchContentRef) {
                                    (window as any).fetchContentRef();
                                  }
                                  setSelectedBlogIds([]);
                                  setActionSuccess(`Archived ${selectedBlogIds.length} blog posts successfully`);
                                })
                                .catch(err => {
                                  setError(`Failed to archive some items: ${err.message}`);
                                });
                            }

                            // Reset the select
                            e.target.value = '';
                          }}
                        >
                          <option value="">Bulk Actions ({selectedBlogIds.length} selected)</option>
                          <option value="publish">Publish Now</option>
                          <option value="schedule">Schedule for Tomorrow</option>
                          <option value="archive">Archive</option>
                          <option value="delete">Delete</option>
                        </select>
                      </div>
                    )}

                    {selectedBlogIds.length > 0 && (
                      <button
                        onClick={() => setSelectedBlogIds([])}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        Clear Selection
                      </button>
                    )}
                  </div>

                  {/* Add New Button */}
                  <button
                    onClick={() => handleAddNew('blog')}
                    className="gold-button flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Blog Post
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#2d1e14] text-left">
                        <th className="p-3 rounded-tl-lg w-10">
                          <input
                            type="checkbox"
                            className="rounded border-[#7a4528] text-[#c9a52c] focus:ring-[#c9a52c]"
                            checked={filteredBlogPosts.length > 0 && selectedBlogIds.length === filteredBlogPosts.length}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Select all
                                setSelectedBlogIds(filteredBlogPosts.map(post => post.id));
                              } else {
                                // Deselect all
                                setSelectedBlogIds([]);
                              }
                            }}
                          />
                        </th>
                        <th className="p-3">Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Published</th>
                        <th className="p-3 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogPosts.length > 0 ? (
                        filteredBlogPosts.map((post) => (
                          <tr key={post.id} className="border-b border-[#3a2819] hover:bg-[#3a2819]/50">
                            <td className="p-3">
                              <input
                                type="checkbox"
                                className="rounded border-[#7a4528] text-[#c9a52c] focus:ring-[#c9a52c]"
                                checked={selectedBlogIds.includes(post.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedBlogIds(prev => [...prev, post.id]);
                                  } else {
                                    setSelectedBlogIds(prev => prev.filter(id => id !== post.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-3">
                                  <img
                                    src={post.cover_image || '/placeholder-blog.jpg'}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder-blog.jpg';
                                    }}
                                  />
                                </div>
                                <span className="font-medium">{post.title}</span>
                              </div>
                            </td>
                            <td className="p-3">{post.category}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                post.status === 'published' ? 'bg-green-900/30 text-green-200' :
                                post.status === 'draft' ? 'bg-yellow-900/30 text-yellow-200' :
                                post.status === 'scheduled' ? 'bg-blue-900/30 text-blue-200' :
                                post.status === 'archived' ? 'bg-gray-900/30 text-gray-200' :
                                'bg-[#3a2819]'
                              }`}>
                                {post.status === 'scheduled' ? 'Scheduled' : post.status}
                              </span>
                              {post.status === 'scheduled' && post.scheduled_for && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(post.scheduled_for).toLocaleString()}
                                </div>
                              )}
                            </td>
                            <td className="p-3">{post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}</td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit('blog', post.id)}
                                  className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center"
                                >
                                  <Edit size={14} className="mr-1" /> Edit
                                </button>
                                <button
                                  onClick={() => handleOpenDeleteConfirm(post.id, 'blog')}
                                  className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-sm flex items-center"
                                >
                                  <Trash2 size={14} className="mr-1" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : searchTerm ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No results found for "{searchTerm}"
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No blog posts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="purchases">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            ) : (
              <>
                {/* Purchase Actions */}
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {/* Filter and Sort Options */}
                    <FilterBar
                      filterOptions={[
                        { label: 'All Statuses', value: '' },
                        { label: 'Completed', value: 'completed' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Refunded', value: 'refunded' }
                      ]}
                      sortOptions={[
                        { label: 'Date', value: 'created_at' },
                        { label: 'Amount', value: 'amount' },
                        { label: 'Status', value: 'status' }
                      ]}
                      onFilterChange={setPurchaseFilter}
                      onSortChange={(sort, direction) => {
                        setPurchaseSort(sort);
                        setPurchaseSortDirection(direction);
                      }}
                      activeFilter={purchaseFilter}
                      activeSort={purchaseSort}
                      activeSortDirection={purchaseSortDirection}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#2d1e14] text-left">
                        <th className="p-3 rounded-tl-lg">User</th>
                        <th className="p-3">Item</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Date</th>
                        <th className="p-3 rounded-tr-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPurchases.length > 0 ? (
                        filteredPurchases.map((purchase) => (
                          <tr key={purchase.id} className="border-b border-[#3a2819] hover:bg-[#3a2819]/50">
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="font-medium">{purchase.user?.name || 'Unknown'}</span>
                                <span className="text-xs text-gray-400">{purchase.user?.email || 'No email'}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              {purchase.item_type === 'book-summary' && purchase.book_summary ? (
                                <span>{purchase.book_summary.title}</span>
                              ) : purchase.item_type === 'business-plan' && purchase.business_plan ? (
                                <span>{purchase.business_plan.title}</span>
                              ) : (
                                <span className="text-gray-400">Unknown item</span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-[#3a2819] rounded-full text-xs">
                                {purchase.item_type === 'book-summary' ? 'Book' :
                                 purchase.item_type === 'business-plan' ? 'Business Plan' :
                                 purchase.item_type}
                              </span>
                            </td>
                            <td className="p-3">
                              {purchase.amount > 0 ? `$${purchase.amount.toFixed(2)}` : 'Free'}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                purchase.status === 'completed' ? 'bg-green-900/30 text-green-200' :
                                purchase.status === 'pending' ? 'bg-yellow-900/30 text-yellow-200' :
                                purchase.status === 'refunded' ? 'bg-red-900/30 text-red-200' :
                                'bg-[#3a2819]'
                              }`}>
                                {purchase.status}
                              </span>
                            </td>
                            <td className="p-3">
                              {purchase.created_at ? new Date(purchase.created_at).toLocaleDateString() : '-'}
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <div className="relative group">
                                  <button className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center">
                                    <Edit size={14} className="mr-1" /> Status
                                  </button>
                                  <div className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-[#2d1e14] ring-1 ring-black ring-opacity-5 invisible group-hover:visible z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                      <button
                                        onClick={() => {
                                          updatePurchaseStatus(purchase.id, 'completed');
                                          (window as any).fetchContentRef();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-green-300 hover:bg-[#3a2819] transition-colors"
                                      >
                                        Completed
                                      </button>
                                      <button
                                        onClick={() => {
                                          updatePurchaseStatus(purchase.id, 'pending');
                                          (window as any).fetchContentRef();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-yellow-300 hover:bg-[#3a2819] transition-colors"
                                      >
                                        Pending
                                      </button>
                                      <button
                                        onClick={() => {
                                          updatePurchaseStatus(purchase.id, 'refunded');
                                          (window as any).fetchContentRef();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-[#3a2819] transition-colors"
                                      >
                                        Refunded
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : searchTerm ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-gray-400">
                            No results found for "{searchTerm}"
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-gray-400">
                            No purchases found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

        {/* Activity Log Sidebar */}
        <div className="lg:w-80">
          <ActivityLog limit={15} className="sticky top-6" />
        </div>
      </div>

      {/* No longer need the content creation/edit modal as we're using separate pages */}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this {itemToDelete?.type === 'book' ? 'book summary' : itemToDelete?.type === 'business' ? 'business plan' : 'blog post'}? This action cannot be undone.
          </p>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#7a4528]/30">
            <button
              onClick={handleCloseDeleteConfirm}
              className="px-4 py-2 rounded-md bg-[#3a2819] text-white hover:bg-[#4a3829] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-600 transition-colors flex items-center"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContentManagementPage;





