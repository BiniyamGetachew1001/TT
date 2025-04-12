import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BookSummary } from '../lib/supabase';
import BookSummaryForm from '../components/BookSummaryForm';

interface BookSummaryEditPageProps {
  readOnly?: boolean;
}

const BookSummaryEditPage: React.FC<BookSummaryEditPageProps> = ({ readOnly = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [bookSummary, setBookSummary] = useState<Partial<BookSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isNewSummary = id === 'new';
  
  useEffect(() => {
    const fetchBookSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (isNewSummary) {
          setBookSummary({
            title: '',
            author: '',
            description: '',
            content: '',
            cover_image: '',
            read_time: '',
            category: '',
            price: 9.99,
            status: 'draft'
          });
        } else if (id) {
          const { data, error } = await supabase
            .from('book_summaries')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          if (!data) {
            throw new Error('Book summary not found');
          }
          
          setBookSummary(data);
        }
      } catch (err: any) {
        console.error('Error fetching book summary:', err);
        setError(err.message || 'Failed to load book summary');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookSummary();
  }, [id, isNewSummary]);
  
  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    setError(null);
    
    try {
      console.log('Form data received:', formData);
      
      // Transform the form data to match the database schema
      const summaryData = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        read_time: formData.readTime,
        price: parseFloat(formData.price),
        status: formData.status,
        cover_image: formData.coverImage,
        is_featured: formData.isFeatured || false
      };
      
      console.log('Summary data to save:', summaryData);
      
      if (isNewSummary) {
        // Create a new book summary
        const { data, error } = await supabase
          .from('book_summaries')
          .insert([summaryData])
          .select()
          .single();
        
        if (error) throw error;
      } else if (id) {
        // Update an existing book summary
        const { error } = await supabase
          .from('book_summaries')
          .update(summaryData)
          .eq('id', id);
        
        if (error) throw error;
      }
      
      // Navigate back to the book summaries list
      navigate('/book-summaries');
    } catch (err: any) {
      console.error('Error saving book summary:', err);
      setError(err.message || 'Failed to save book summary');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/book-summaries')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Book Summaries
        </button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold gold-text">
          {isNewSummary ? 'Create New Book Summary' : readOnly ? 'View Book Summary' : 'Edit Book Summary'}
        </h1>
        <p className="text-gray-400">
          {isNewSummary ? 'Add a new book summary to your site' : readOnly ? 'View the details of this book summary' : 'Update your book summary content'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6 flex items-center">
          <AlertCircle className="text-red-400 mr-3" size={20} />
          <span>{error}</span>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
        </div>
      ) : bookSummary ? (
        <BookSummaryForm
          initialData={bookSummary}
          onSubmit={handleSubmit}
          isLoading={isSaving}
          readOnly={readOnly}
        />
      ) : (
        <div className="admin-card">
          <p className="text-center text-red-400">Book summary not found</p>
        </div>
      )}
    </div>
  );
};

export default BookSummaryEditPage;
