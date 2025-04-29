import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/simple-tabs';
import {
  Book, FileText, Newspaper, Plus, Search, Filter, Trash2, Edit, Eye,
  ShoppingCart, User, Calendar, BarChart, LayoutDashboard, Users, Settings
} from 'lucide-react';
import { getAllBookSummaries } from '../services/bookSummaryService';
import { getAllBusinessPlans } from '../services/businessPlanService';
import { getAllBlogPosts } from '../services/blogService';
import { getAllPurchases, updatePurchaseStatus } from '../services/purchaseService';
import { deleteBookSummary, deleteBusinessPlan, deleteBlogPost } from '../services/contentManagementService';
import { BookSummary } from '../services/BookSummaryService';
import { BusinessPlan } from '../services/businessPlanService';
import { BlogPost } from '../services/blogService';
import { Purchase } from '../services/purchaseService';
import Modal from '../components/ui/Modal';
import DashboardOverview from '../components/admin/DashboardOverview';
import UserManagement from '../components/admin/UserManagement';
import AnalyticsReporting from '../components/admin/AnalyticsReporting';

const ContentManagementPage: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();
  const [bookSummaries, setBookSummaries] = useState<BookSummary[]>([]);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [businessSearchTerm, setBusinessSearchTerm] = useState('');
  const [blogSearchTerm, setBlogSearchTerm] = useState('');
  const [purchaseSearchTerm, setPurchaseSearchTerm] = useState('');
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState<'all' | 'completed' | 'pending' | 'refunded'>('all');

  // Modal states
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

  const handleOpenDeleteConfirm = (id: string | number, type: 'book' | 'business' | 'blog') => {
    setItemToDelete({ id: String(id), type });
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



  const handleUpdatePurchaseStatus = async (purchaseId: string, status: string) => {
    try {
      const result = await updatePurchaseStatus(purchaseId, status);
      if (result.success) {
        setActionSuccess(`Purchase status updated to ${status}`);
        // Refresh purchases
        if ((window as any).fetchContentRef) {
          (window as any).fetchContentRef();
        }
      } else {
        setError(result.message || 'Failed to update purchase status');
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating purchase status');
    }
  };

  // Filter functions
  const filteredBookSummaries = bookSearchTerm
    ? bookSummaries.filter(book =>
        book.title.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(bookSearchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(bookSearchTerm.toLowerCase())
      )
    : bookSummaries;

  const filteredBusinessPlans = businessSearchTerm
    ? businessPlans.filter(plan =>
        plan.title.toLowerCase().includes(businessSearchTerm.toLowerCase()) ||
        plan.industry.toLowerCase().includes(businessSearchTerm.toLowerCase())
      )
    : businessPlans;

  const filteredBlogPosts = blogSearchTerm
    ? blogPosts.filter(post =>
        post.title.toLowerCase().includes(blogSearchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(blogSearchTerm.toLowerCase())
      )
    : blogPosts;

  const filteredPurchases = purchases
    .filter(purchase => {
      // First apply status filter
      if (purchaseStatusFilter !== 'all' && purchase.status !== purchaseStatusFilter) {
        return false;
      }

      // Then apply search filter if there is a search term
      if (!purchaseSearchTerm) {
        return true;
      }

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

      return userEmail.toLowerCase().includes(purchaseSearchTerm.toLowerCase()) ||
        userName.toLowerCase().includes(purchaseSearchTerm.toLowerCase()) ||
        itemType.toLowerCase().includes(purchaseSearchTerm.toLowerCase()) ||
        status.toLowerCase().includes(purchaseSearchTerm.toLowerCase()) ||
        paymentId.toLowerCase().includes(purchaseSearchTerm.toLowerCase()) ||
        itemTitle.toLowerCase().includes(purchaseSearchTerm.toLowerCase());
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
      <div className="max-w-6xl mx-auto">
        {actionSuccess && (
          <div className="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-md mb-6">
            {actionSuccess}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Content Management</h1>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6 bg-[#2d1e14] p-1 rounded-lg overflow-x-auto flex-nowrap">
            <TabsTrigger value="dashboard" className="flex items-center">
              <LayoutDashboard size={16} className="mr-2" /> Dashboard
            </TabsTrigger>
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
            <TabsTrigger value="users" className="flex items-center">
              <Users size={16} className="mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart size={16} className="mr-2" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings size={16} className="mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardOverview
              bookSummaries={bookSummaries}
              businessPlans={businessPlans}
              blogPosts={blogPosts}
              purchases={purchases}
              isLoading={loading}
            />
          </TabsContent>

          <TabsContent value="book-summaries">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search book summaries..."
                  value={bookSearchTerm}
                  onChange={(e) => setBookSearchTerm(e.target.value)}
                  className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 pl-10 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                />
              </div>

              <Link
                to="/admin/book-summaries/create"
                className="gold-button flex items-center whitespace-nowrap"
              >
                <Plus size={16} className="mr-1" /> Add Book Summary
              </Link>
            </div>

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
                                <Link
                                  to={`/admin/book-summaries/edit/${book.id}`}
                                  className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center"
                                >
                                  <Edit size={14} className="mr-1" /> Edit
                                </Link>
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
                      ) : bookSearchTerm ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No results found for "{bookSearchTerm}"
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search business plans..."
                  value={businessSearchTerm}
                  onChange={(e) => setBusinessSearchTerm(e.target.value)}
                  className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 pl-10 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                />
              </div>

              <Link
                to="/admin/business-plans/create"
                className="gold-button flex items-center whitespace-nowrap"
              >
                <Plus size={16} className="mr-1" /> Add Business Plan
              </Link>
            </div>

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
                                <Link
                                  to={`/admin/business-plans/edit/${plan.id}`}
                                  className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center"
                                >
                                  <Edit size={14} className="mr-1" /> Edit
                                </Link>
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
                      ) : businessSearchTerm ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No results found for "{businessSearchTerm}"
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search blog posts..."
                  value={blogSearchTerm}
                  onChange={(e) => setBlogSearchTerm(e.target.value)}
                  className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 pl-10 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                />
              </div>

              <Link
                to="/admin/blog-posts/create"
                className="gold-button flex items-center whitespace-nowrap"
              >
                <Plus size={16} className="mr-1" /> Add Blog Post
              </Link>
            </div>

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
                                    src={post.coverImage || '/placeholder-blog.jpg'}
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
                            <td className="p-3">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '-'}</td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <Link
                                  to={`/admin/blog-posts/edit/${post.id}`}
                                  className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center"
                                >
                                  <Edit size={14} className="mr-1" /> Edit
                                </Link>
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
                      ) : blogSearchTerm ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-400">
                            No results found for "{blogSearchTerm}"
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
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search purchases..."
                  value={purchaseSearchTerm}
                  onChange={(e) => setPurchaseSearchTerm(e.target.value)}
                  className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 pl-10 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                />
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <select
                    value={purchaseStatusFilter}
                    onChange={(e) => setPurchaseStatusFilter(e.target.value as 'all' | 'completed' | 'pending' | 'refunded')}
                    className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c] appearance-none pr-8"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                  <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

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
                      ) : purchaseSearchTerm ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-gray-400">
                            No results found for "{purchaseSearchTerm}"
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

          <TabsContent value="users">
            <UserManagement purchases={purchases} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsReporting
              bookSummaries={bookSummaries}
              businessPlans={businessPlans}
              blogPosts={blogPosts}
              purchases={purchases}
              isLoading={loading}
            />
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-[#2d1e14] rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-6 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-[#c9a52c]" />
                Admin Settings
              </h2>

              <div className="space-y-6">
                {/* General Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b border-[#7a4528]/50 pb-2">General Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="site-name" className="block text-sm font-medium text-white">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="site-name"
                        defaultValue="TILkTBEB"
                        className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="admin-email" className="block text-sm font-medium text-white">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        id="admin-email"
                        defaultValue="admin@example.com"
                        className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium border-b border-[#7a4528]/50 pb-2">Content Settings</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="default-price" className="block text-sm font-medium text-white">
                        Default Premium Content Price
                      </label>
                      <input
                        type="number"
                        id="default-price"
                        defaultValue="9.99"
                        min="0"
                        step="0.01"
                        className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="content-per-page" className="block text-sm font-medium text-white">
                        Items Per Page
                      </label>
                      <input
                        type="number"
                        id="content-per-page"
                        defaultValue="10"
                        min="5"
                        max="50"
                        className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded bg-[#3a2819] border-[#7a4528] text-[#c9a52c] focus:ring-[#c9a52c]"
                      />
                      <span className="text-sm text-white">Allow users to comment on content</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="rounded bg-[#3a2819] border-[#7a4528] text-[#c9a52c] focus:ring-[#c9a52c]"
                      />
                      <span className="text-sm text-white">Enable offline reading for purchased content</span>
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-[#7a4528]/30">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md bg-[#c9a52c] text-white hover:bg-[#d9b53c] transition-colors"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>



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
