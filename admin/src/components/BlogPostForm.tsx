import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

interface BlogPostFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
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

const BlogPostForm: React.FC<BlogPostFormProps> = ({ initialData, onSubmit, isLoading }) => {
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

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCoverImagePreview(base64String);
        setValue('coverImage', base64String);
      };
      reader.readAsDataURL(file);
    }
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
          <label className="admin-label">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="mb-2"
          />
          {coverImagePreview && (
            <div className="mt-2">
              <img
                src={coverImagePreview}
                alt="Cover preview"
                className="max-w-full max-h-48 object-contain"
              />
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
    </form>
  );
};

export default BlogPostForm;
