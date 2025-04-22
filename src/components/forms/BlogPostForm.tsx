import React, { useState } from 'react';
import { BlogPost } from '../../lib/supabase';
import { createBlogPost, updateBlogPost } from '../../services/contentManagementService';

interface BlogPostFormProps {
  blogPost?: BlogPost;
  onSuccess: () => void;
  onCancel: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  blogPost,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>(
    blogPost || {
      title: '',
      content: '',
      category: '',
      cover_image: '',
      status: 'draft',
      published_at: null
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

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

    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.content?.trim()) {
      newErrors.content = 'Content is required';
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

    // Set published_at date if status is published
    const dataToSubmit = {
      ...formData,
      published_at: formData.status === 'published' ? new Date().toISOString() : null
    };

    try {
      if (blogPost?.id) {
        // Update existing blog post
        const result = await updateBlogPost(blogPost.id, dataToSubmit);
        if (result.success) {
          setSuccessMessage('Blog post updated successfully!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setErrors({ submit: result.message || 'Failed to update blog post' });
        }
      } else {
        // Create new blog post
        const result = await createBlogPost(dataToSubmit as Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>);
        if (result.success) {
          setSuccessMessage('Blog post created successfully!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setErrors({ submit: result.message || 'Failed to create blog post' });
        }
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Business',
    'Finance',
    'Entrepreneurship',
    'Personal Development',
    'Marketing',
    'Technology',
    'Leadership',
    'Productivity',
    'Other'
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
        <div className="space-y-2 md:col-span-2">
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
          <label htmlFor="status" className="block text-sm font-medium text-gray-200">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status || 'draft'}
            onChange={handleChange}
            className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
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
        <label htmlFor="content" className="block text-sm font-medium text-gray-200">
          Content <span className="text-red-400">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          rows={12}
          value={formData.content || ''}
          onChange={handleChange}
          className={`w-full rounded-md bg-[#2d1e14] border ${errors.content ? 'border-red-500' : 'border-[#7a4528]/50'} px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
        />
        {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
        <p className="text-xs text-gray-400 mt-1">
          You can use Markdown formatting for rich text.
        </p>
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
            <span>{blogPost?.id ? 'Update' : 'Create'} Blog Post</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default BlogPostForm;
