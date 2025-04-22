import React, { useState } from 'react';
import { BusinessPlan } from '../../lib/supabase';
import { createBusinessPlan, updateBusinessPlan } from '../../services/contentManagementService';

interface BusinessPlanFormProps {
  businessPlan?: BusinessPlan;
  onSuccess: () => void;
  onCancel: () => void;
}

const BusinessPlanForm: React.FC<BusinessPlanFormProps> = ({
  businessPlan,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<BusinessPlan>>(
    businessPlan || {
      title: '',
      description: '',
      industry: '',
      cover_image: '',
      price: 0,
      content: ''
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
    
    if (!formData.industry?.trim()) {
      newErrors.industry = 'Industry is required';
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
      if (businessPlan?.id) {
        // Update existing business plan
        const result = await updateBusinessPlan(businessPlan.id, formData);
        if (result.success) {
          setSuccessMessage('Business plan updated successfully!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setErrors({ submit: result.message || 'Failed to update business plan' });
        }
      } else {
        // Create new business plan
        const result = await createBusinessPlan(formData as Omit<BusinessPlan, 'id' | 'created_at' | 'updated_at'>);
        if (result.success) {
          setSuccessMessage('Business plan created successfully!');
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setErrors({ submit: result.message || 'Failed to create business plan' });
        }
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const industries = [
    'E-commerce',
    'Food & Beverage',
    'Technology',
    'Healthcare',
    'Education',
    'Finance',
    'Real Estate',
    'Manufacturing',
    'Retail',
    'Services',
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
          <label htmlFor="industry" className="block text-sm font-medium text-gray-200">
            Industry <span className="text-red-400">*</span>
          </label>
          <select
            id="industry"
            name="industry"
            value={formData.industry || ''}
            onChange={handleChange}
            className={`w-full rounded-md bg-[#2d1e14] border ${errors.industry ? 'border-red-500' : 'border-[#7a4528]/50'} px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]`}
          >
            <option value="">Select an industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          {errors.industry && <p className="text-red-400 text-xs mt-1">{errors.industry}</p>}
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
            <span>{businessPlan?.id ? 'Update' : 'Create'} Business Plan</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default BusinessPlanForm;
