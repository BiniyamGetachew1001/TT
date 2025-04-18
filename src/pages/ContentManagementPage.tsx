import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/simple-tabs';
import { Book, FileText, Newspaper, Plus, Search, Filter, Trash2, Edit, Eye, ShoppingCart, User, Calendar } from 'lucide-react';
import { getAllBookSummaries } from '../services/bookSummaryService';
import { getAllBusinessPlans } from '../services/businessPlanService';
import { getAllBlogPosts } from '../services/blogService';
import { getAllPurchases, updatePurchaseStatus } from '../services/purchaseService';
import { deleteBookSummary, deleteBusinessPlan, deleteBlogPost } from '../services/contentManagementService';
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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'book' | 'business' | 'blog' | null>(null);
  const [editItem, setEditItem] = useState<BookSummary | BusinessPlan | BlogPost | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'book' | 'business' | 'blog'} | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

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

  // Handler functions
  const handleOpenModal = (type: 'book' | 'business' | 'blog', item?: BookSummary | BusinessPlan | BlogPost) => {
    setModalType(type);
    setEditItem(item || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setEditItem(null);
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

  // Filter functions
  const filteredBookSummaries = searchTerm
    ? bookSummaries.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : bookSummaries;

  const filteredBusinessPlans = searchTerm
    ? businessPlans.filter(plan =>
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.industry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : businessPlans;

  const filteredBlogPosts = searchTerm
    ? blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : blogPosts;

  const filteredPurchases = searchTerm
    ? purchases.filter(purchase => {
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

        return userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          itemTitle.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : purchases;

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
      <div className="max-w-6xl mx-auto">
        {actionSuccess && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-md mb-6">
            {actionSuccess}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Content Management</h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
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

            <div className="flex gap-2">
              <div className="relative group">
                <button className="gold-button flex items-center">
                  <Plus size={16} className="mr-1" /> Add New Content
                </button>
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#2d1e14] ring-1 ring-black ring-opacity-5 invisible group-hover:visible z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <button
                      onClick={() => handleOpenModal('book')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#3a2819] transition-colors flex items-center"
                    >
                      <Book size={16} className="mr-2" /> Book Summary
                    </button>
                    <button
                      onClick={() => handleOpenModal('business')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#3a2819] transition-colors flex items-center"
                    >
                      <FileText size={16} className="mr-2" /> Business Plan
                    </button>
                    <button
                      onClick={() => handleOpenModal('blog')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#3a2819] transition-colors flex items-center"
                    >
                      <Newspaper size={16} className="mr-2" /> Blog Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#2d1e14] text-left">
                        <th className="p-3 rounded-tl-lg">Title</th>
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
                                  onClick={() => handleOpenModal('book', book)}
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#2d1e14] text-left">
                        <th className="p-3 rounded-tl-lg">Title</th>
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
                                  onClick={() => handleOpenModal('business', plan)}
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
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#2d1e14] text-left">
                        <th className="p-3 rounded-tl-lg">Title</th>
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
                            <td className="p-3">{post.status}</td>
                            <td className="p-3">{post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}</td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleOpenModal('blog', post)}
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

      {/* Content Creation/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`${editItem ? 'Edit' : 'Create'} ${modalType === 'book' ? 'Book Summary' : modalType === 'business' ? 'Business Plan' : 'Blog Post'}`}
        size="lg"
      >
        {modalType === 'book' && (
          <BookSummaryForm
            bookSummary={editItem as BookSummary}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        )}

        {modalType === 'business' && (
          <BusinessPlanForm
            businessPlan={editItem as BusinessPlan}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        )}

        {modalType === 'blog' && (
          <BlogPostForm
            blogPost={editItem as BlogPost}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>

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
