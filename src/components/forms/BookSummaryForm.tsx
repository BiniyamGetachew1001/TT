import React, { useState } from 'react';
import { BookSummary } from '../../lib/supabase';
import { createBookSummary, updateBookSummary } from '../../services/contentManagementService';

interface BookSummaryFormProps {
  bookSummary?: BookSummary;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookSummaryForm: React.FC<BookSummaryFormProps> = ({
  bookSummary,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<BookSummary>>(
    bookSummary || {
      title: '',
      author: '',
      description: '',
      content: '',
      category: '',
      cover_image: '',
      read_time: '',
      price: 0
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle price as a number
    if (name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.author?.trim()) {
      newErrors.author = 'Author is required';
    }
    
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Price must be a positive number or zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSuccessMessage('');
    
    try {
      if (bookSummary?.id) {
        // Update existing book summary
        const result = await updateBookSummary(bookSummary.id, formData);
        if (result.success) {
          setSuccessMessage('Book summary updated successfully!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setErrors({ submit: result.message || 'Failed to update book summary' });
        }
      } else {
        // Create new book summary
        const result = await createBookSummary(formData as Omit<BookSummary, 'id' | 'created_at' | 'updated_at'>);
        if (result.success) {
          setSuccessMessage('Book summary created successfully!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setErrors({ submit: result.message || 'Failed to create book summary' });
        }
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Finance',
    'Personal Development',
    'Entrepreneurship',
    'Marketing',
    'Leadership',
    'Technology',
    'Psychology',
    'Health',
    'Productivity',
    'Other'
  ];

  const readTimes = [
    '5 min',
    '10 min',
    '15 min',
    '20 min',
    '25 min',
    '30 min',
    '45 min',
    '60 min'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && (
        <div className="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      
      {errors.submit && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-4">
          {errors.submit}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-200">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className={`w-full rounded-md bg-[#2d1e14] border ${errors.title ? 'border-red-500' : 'border-[#7a4528]/50'} px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="author" className="block text-sm font-medium text-gray-200">
            Author <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author || ''}
            onChange={handleChange}
            className={`w-full rounded-md bg-[#2d1e14] border ${errors.author ? 'border-red-500' : 'border-[#7a4528]/50'} px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
          />
          {errors.author && <p className="text-red-400 text-xs mt-1">{errors.author}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="category" className="block text-sm font-medium text-gray-200">
            Category <span className="text-red-400">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className={`w-full rounded-md bg-[#2d1e14] border ${errors.category ? 'border-red-500' : 'border-[#7a4528]/50'} px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="read_time" className="block text-sm font-medium text-gray-200">
            Read Time
          </label>
          <select
            id="read_time"
            name="read_time"
            value={formData.read_time || ''}
            onChange={handleChange}
            className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
          >
            <option value="">Select read time</option>
            {readTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium text-gray-200">
            Price <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-400">$</span>
            </div>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={formData.price || 0}
              onChange={handleChange}
              className={`w-full rounded-md bg-[#2d1e14] border ${errors.price ? 'border-red-500' : 'border-[#7a4528]/50'} pl-7 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
            />
          </div>
          {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="cover_image" className="block text-sm font-medium text-gray-200">
            Cover Image URL
          </label>
          <input
            type="text"
            id="cover_image"
            name="cover_image"
            value={formData.cover_image || ''}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium text-gray-200">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description || ''}
          onChange={handleChange}
          className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-200">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={formData.content || ''}
          onChange={handleChange}
          className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-[#7a4528]/30">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-[#3a2819] text-white hover:bg-[#4a3829] transition-colors"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-[#c9a52c] text-white hover:bg-[#d9b53c] transition-colors flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Saving</span>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            </>
          ) : (
            <span>{bookSummary?.id ? 'Update' : 'Create'} Book Summary</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default BookSummaryForm;
