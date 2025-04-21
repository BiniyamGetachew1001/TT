import React, { useState } from 'react';
import { BlogPost } from '../../lib/supabase';
import { createBlogPost, updateBlogPost } from '../../services/contentManagementService';
import RichTextEditor from '../ui/rich-text-editor';
import ImageUpload from '../ui/image-upload';
// Import components

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
      published_at: null,
      scheduled_for: null,
      is_free: false
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

    // Validate scheduled date if status is 'scheduled'
    if (formData.status === 'scheduled') {
      if (!formData.scheduled_for) {
        newErrors.scheduled_for = 'Publication date is required for scheduled posts';
      } else {
        const scheduledDate = new Date(formData.scheduled_for);
        const now = new Date();

        if (scheduledDate <= now) {
          newErrors.scheduled_for = 'Publication date must be in the future';
        }
      }
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

    // Handle different status cases
    let dataToSubmit = { ...formData };

    if (formData.status === 'published') {
      // If publishing now, set the published_at date to now
      dataToSubmit.published_at = new Date().toISOString();
      dataToSubmit.scheduled_for = null;
    } else if (formData.status === 'scheduled' && formData.scheduled_for) {
      // If scheduling, keep the scheduled_for date and set published_at to null
      dataToSubmit.published_at = null;
    } else {
      // For draft or archived, clear both dates
      dataToSubmit.published_at = null;
      dataToSubmit.scheduled_for = null;
    }

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
            <option value="published">Published Now</option>
            <option value="scheduled">Schedule for Later</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Pricing Options */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Pricing Option
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="is_free"
                checked={formData.is_free === true}
                onChange={() => setFormData({ ...formData, is_free: true })}
                className="h-4 w-4 text-[#c9a52c] focus:ring-[#c9a52c] border-[#7a4528]/50 bg-[#2d1e14]"
              />
              <span className="ml-2 text-gray-200">Free</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="is_free"
                checked={formData.is_free === false}
                onChange={() => setFormData({ ...formData, is_free: false })}
                className="h-4 w-4 text-[#c9a52c] focus:ring-[#c9a52c] border-[#7a4528]/50 bg-[#2d1e14]"
              />
              <span className="ml-2 text-gray-200">Premium</span>
            </label>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Premium content is only accessible to paid subscribers.
          </p>
        </div>

        {/* Show scheduling options when status is 'scheduled' */}
        {formData.status === 'scheduled' && (
          <div className="space-y-2">
            <label htmlFor="scheduled_for" className="block text-sm font-medium text-gray-200">
              Schedule Publication Date <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              id="scheduled_for"
              name="scheduled_for"
              value={formData.scheduled_for ? new Date(formData.scheduled_for).toISOString().slice(0, 16) : ''}
              onChange={(e) => {
                const scheduledDate = e.target.value ? new Date(e.target.value).toISOString() : null;
                setFormData({
                  ...formData,
                  scheduled_for: scheduledDate
                });

                // Clear error if any
                if (errors.scheduled_for) {
                  setErrors({
                    ...errors,
                    scheduled_for: ''
                  });
                }
              }}
              min={new Date().toISOString().slice(0, 16)}
              className={`w-full rounded-md bg-[#2d1e14] border ${errors.scheduled_for ? 'border-red-500' : 'border-[#7a4528]/50'} px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
            />
            {errors.scheduled_for && <p className="text-red-400 text-xs mt-1">{errors.scheduled_for}</p>}
            <p className="text-xs text-gray-400 mt-1">
              The post will be automatically published at the scheduled time.
            </p>
          </div>
        )}

        {/* Enhanced ImageUpload component with file upload */}
        <div className="md:col-span-2">
          <ImageUpload
            currentImageUrl={formData.cover_image || null}
            onImageChange={(imageUrl) => {
              setFormData({
                ...formData,
                cover_image: imageUrl || ''
              });
            }}
            label="Cover Image"
            maxHeight={400} // Taller preview with scrolling
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-gray-200">
          Content <span className="text-red-400">*</span>
        </label>
        {/* Replace textarea with RichTextEditor */}
        <RichTextEditor
          id="content"
          name="content"
          value={formData.content || ''}
          onChange={(content) => {
            // Update the formData with the new content
            setFormData({
              ...formData,
              content
            });

            // Clear error for this field if any
            if (errors.content) {
              setErrors({
                ...errors,
                content: ''
              });
            }
          }}
          error={errors.content}
          height={500}
        />
        <p className="text-xs text-gray-400 mt-1">
          Use the rich text editor to format your content.
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
