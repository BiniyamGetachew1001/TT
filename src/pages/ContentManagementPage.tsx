import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/simple-tabs';
import { Book, FileText, Newspaper, Plus } from 'lucide-react';
import { getAllBookSummaries } from '../services/bookSummaryService';
import { BookSummary } from '../lib/supabase';

const ContentManagementPage: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();
  const [bookSummaries, setBookSummaries] = useState<BookSummary[]>([]);
  const [businessPlans, setBusinessPlans] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        // Fetch book summaries
        const bookResult = await getAllBookSummaries();
        if (bookResult.success) {
          setBookSummaries(bookResult.data);
        } else {
          setError(bookResult.message || 'Failed to fetch book summaries');
        }

        // Fetch business plans and blog posts would go here
        // For now, we'll use empty arrays

      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching content');
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isAdmin) {
      fetchContent();
    }
  }, [isLoading, isAdmin]);

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Content Management</h1>
          <div className="flex gap-2">
            <button className="gold-button flex items-center">
              <Plus size={16} className="mr-1" /> Add New Content
            </button>
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
                      {bookSummaries.length > 0 ? (
                        bookSummaries.map((book) => (
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
                                <button className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm">
                                  Edit
                                </button>
                                <button className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-sm">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
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
            <div className="text-center py-10 text-gray-400">
              Business plans management coming soon
            </div>
          </TabsContent>

          <TabsContent value="blog-posts">
            <div className="text-center py-10 text-gray-400">
              Blog posts management coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentManagementPage;
