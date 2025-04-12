import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface BookSummaryFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  readOnly?: boolean;
}

// Book categories
const BOOK_CATEGORIES = [
  'Business',
  'Finance',
  'Self-Development',
  'Psychology',
  'Leadership',
  'Entrepreneurship',
  'Marketing',
  'Productivity',
  'Technology',
  'Science',
  'Philosophy',
  'Biography',
  'History'
];

const BookSummaryForm: React.FC<BookSummaryFormProps> = ({ initialData, onSubmit, isLoading, readOnly = false }) => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      author: initialData?.author || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      coverImage: initialData?.cover_image || '',
      readTime: initialData?.read_time || '',
      category: initialData?.category || '',
      price: initialData?.price || 9.99,
      status: initialData?.status || 'draft',
      isFeatured: initialData?.is_featured || false
    }
  });
  
  const [coverImagePreview, setCoverImagePreview] = useState(initialData?.cover_image || '');
  
  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title || '');
      setValue('author', initialData.author || '');
      setValue('description', initialData.description || '');
      setValue('content', initialData.content || '');
      setValue('coverImage', initialData.cover_image || '');
      setValue('readTime', initialData.read_time || '');
      setValue('category', initialData.category || '');
      setValue('price', initialData.price || 9.99);
      setValue('status', initialData.status || 'draft');
      setValue('isFeatured', initialData.is_featured || false);
      
      if (initialData.cover_image) {
        setCoverImagePreview(initialData.cover_image);
      }
    }
  }, [initialData, setValue]);
  
  // Function to validate image URL
  const validateImageUrl = (url: string) => {
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w\-])+\.([\w\-\.]+)([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
    return urlPattern.test(url);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className={readOnly ? 'pointer-events-none opacity-90' : ''}>
      <div className="admin-card">
        <div className="mb-4">
          <label htmlFor="title" className="admin-label">Book Title</label>
          <input
            id="title"
            type="text"
            className="admin-input"
            placeholder="Enter book title"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="author" className="admin-label">Author</label>
          <input
            id="author"
            type="text"
            className="admin-input"
            placeholder="Enter book author"
            {...register('author', { required: 'Author is required' })}
          />
          {errors.author && (
            <p className="text-red-500 text-sm mt-1">{errors.author.message as string}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="admin-label">Description</label>
          <textarea
            id="description"
            className="admin-input min-h-[100px]"
            placeholder="Enter a brief description of the book"
            {...register('description', { required: 'Description is required' })}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="admin-label">Content</label>
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Content is required' }}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image'],
                    ['clean']
                  ]
                }}
                className="bg-[#2a1e14] text-white rounded-md mb-2"
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="category" className="admin-label">Category</label>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <select
                  {...field}
                  className="admin-select"
                >
                  <option value="">Select a category</option>
                  {BOOK_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message as string}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="readTime" className="admin-label">Read Time</label>
            <input
              id="readTime"
              type="text"
              className="admin-input"
              placeholder="e.g. 15 min read"
              {...register('readTime', { required: 'Read time is required' })}
            />
            {errors.readTime && (
              <p className="text-red-500 text-sm mt-1">{errors.readTime.message as string}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="price" className="admin-label">Price ($)</label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="admin-input"
              placeholder="9.99"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' },
                valueAsNumber: true
              })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message as string}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="status" className="admin-label">Status</label>
            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field }) => (
                <select
                  {...field}
                  className="admin-select"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message as string}</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="admin-label flex items-center">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4"
              {...register('isFeatured')}
            />
            Featured Book Summary
          </label>
          <p className="text-xs text-gray-500 mt-1">Featured book summaries will be displayed prominently on the homepage</p>
        </div>
        
        <div className="mb-4">
          <label className="admin-label">Cover Image URL</label>
          <div className="flex">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={coverImagePreview || ''}
              onChange={(e) => {
                const url = e.target.value;
                setCoverImagePreview(url);
                setValue('coverImage', url);
                
                // Validate URL format
                if (url && !validateImageUrl(url)) {
                  console.warn('Invalid image URL format:', url);
                }
              }}
              className="admin-input flex-1"
            />
            {coverImagePreview && (
              <button
                type="button"
                onClick={() => {
                  setCoverImagePreview('');
                  setValue('coverImage', '');
                }}
                className="ml-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md px-3"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Enter the URL of an image hosted elsewhere (e.g., Imgur, Cloudinary, etc.)</p>
          
          {/* Image Preview */}
          {coverImagePreview ? (
            <div className="mt-4 max-w-md rounded-md overflow-hidden border border-gray-700">
              <img 
                src={coverImagePreview} 
                alt="Cover preview" 
                className="w-full h-auto max-h-[200px] object-cover"
                onError={(e) => {
                  console.error('Error loading preview image:', coverImagePreview);
                  e.currentTarget.src = '/placeholder-book.jpg';
                }}
              />
              <p className="text-xs text-gray-500 p-2 bg-gray-800">Image Preview</p>
            </div>
          ) : (
            <div className="mt-4 max-w-md h-[150px] rounded-md border border-gray-700 flex items-center justify-center bg-gray-800">
              <p className="text-gray-500">No image preview available</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        {!readOnly && (
          <div className="flex space-x-3">
            <button
              type="submit"
              className="gold-button"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : initialData?.id ? 'Update Summary' : 'Create Summary'}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
          </div>
        )}
        
        {readOnly && (
          <div className="flex space-x-3">
            <button
              type="button"
              className="secondary-button"
              onClick={() => window.history.back()}
            >
              Back to Book Summaries
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default BookSummaryForm;
