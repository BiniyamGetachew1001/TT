import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react';

interface BlogPostFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  readOnly?: boolean;
}

const BLOG_CATEGORIES = [
  'Business',
  'Entrepreneurship',
  'Finance',
  'Marketing',
  'Self-Development',
  'Technology',
  'Other'
];

const BlogPostForm: React.FC<BlogPostFormProps> = ({ initialData, onSubmit, isLoading, readOnly = false }) => {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      status: 'draft',
      coverImage: ''
    }
  });

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(initialData?.coverImage || null);
  const [tagInput, setTagInput] = useState('');
  const tags = watch('tags') || [];

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        setValue(key, initialData[key]);
      });

      if (initialData.coverImage) {
        setCoverImagePreview(initialData.coverImage);
      }
    }
  }, [initialData, setValue]);

  // Function to validate image URL
  const validateImageUrl = (url: string) => {
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w\-])+\.([\w\-\.]+)([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
    return urlPattern.test(url);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((tag: string) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={readOnly ? 'pointer-events-none opacity-90' : ''}>
      <div className="mb-6">
        <div className="mb-4">
          <label htmlFor="title" className="admin-label">Title</label>
          <input
            id="title"
            type="text"
            className={`admin-input ${errors.title ? 'border-red-500' : ''}`}
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="excerpt" className="admin-label">Excerpt</label>
          <textarea
            id="excerpt"
            rows={3}
            className={`admin-textarea ${errors.excerpt ? 'border-red-500' : ''}`}
            {...register('excerpt', { required: 'Excerpt is required' })}
          ></textarea>
          {errors.excerpt && (
            <p className="text-red-500 text-sm mt-1">{errors.excerpt.message as string}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="admin-label">Category</label>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <select
                id="category"
                className={`admin-select ${errors.category ? 'border-red-500' : ''}`}
                {...field}
              >
                <option value="">Select a category</option>
                {BLOG_CATEGORIES.map(category => (
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
          <label className="admin-label">Tags</label>
          <div className="flex items-center mb-2">
            <input
              type="text"
              className="admin-input mr-2"
              placeholder="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="secondary-button"
              onClick={handleAddTag}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#3a2819] text-white"
              >
                {tag}
                <button
                  type="button"
                  className="ml-1.5 text-white hover:text-red-300"
                  onClick={() => handleRemoveTag(tag)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
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
                  e.currentTarget.src = '/placeholder-blog.jpg';
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

        <div className="mb-4">
          <label htmlFor="content" className="admin-label">Content</label>
          <Controller
            name="content"
            control={control}
            rules={{ required: 'Content is required' }}
            render={({ field }) => (
              <textarea
                id="content"
                className={`admin-textarea min-h-[300px] ${errors.content ? 'border-red-500' : ''}`}
                {...field}
              ></textarea>
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message as string}</p>
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
                id="status"
                className="admin-select"
                {...field}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            )}
          />
        </div>
      </div>

      {!readOnly && (
        <div className="flex space-x-3">
          <button
            type="submit"
            className="gold-button"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Post' : 'Create Post'}
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
            Back to Blog Posts
          </button>
        </div>
      )}
    </form>
  );
};

export default BlogPostForm;
