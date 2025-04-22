import { supabase } from '../lib/supabase';
import type { BusinessPlan } from '../lib/supabase';

export const getAllBusinessPlans = async (industry?: string) => {
  try {
    // Use Supabase to fetch business plans
    let query = supabase
      .from('business_plans')
      .select('*')
      .order('created_at', { ascending: false });

    // Add industry filter if provided
    if (industry) {
      query = query.eq('industry', industry);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      success: true,
      data: data || []
    };
  } catch (error: any) {
    console.error('Error fetching business plans:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch business plans',
      data: []
    };
  }
};

export const getBusinessPlanById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('business_plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error fetching business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch business plan',
      data: null
    };
  }
};

export const createBusinessPlan = async (businessPlan: Omit<BusinessPlan, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    // Handle cover image upload if it's a data URL
    let coverImage = businessPlan.cover_image;
    if (coverImage && coverImage.startsWith('data:')) {
      const fileName = `${Date.now()}-${businessPlan.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      const { data, error } = await supabase.storage
        .from('business-plan-covers')
        .upload(fileName, coverImage, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('business-plan-covers')
        .getPublicUrl(fileName);

      coverImage = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('business_plans')
      .insert([{ ...businessPlan, cover_image: coverImage }])
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error creating business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to create business plan',
      data: null
    };
  }
};

export const updateBusinessPlan = async (id: string, businessPlan: Partial<BusinessPlan>) => {
  try {
    // Handle cover image upload if it's a data URL
    let coverImage = businessPlan.cover_image;
    if (coverImage && coverImage.startsWith('data:')) {
      const fileName = `${Date.now()}-${businessPlan.title?.replace(/\s+/g, '-').toLowerCase() || id}.jpg`;
      const { data, error } = await supabase.storage
        .from('business-plan-covers')
        .upload(fileName, coverImage, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL for the uploaded image
      const { data: urlData } = supabase.storage
        .from('business-plan-covers')
        .getPublicUrl(fileName);

      coverImage = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('business_plans')
      .update({ ...businessPlan, cover_image: coverImage, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('Error updating business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to update business plan',
      data: null
    };
  }
};

export const deleteBusinessPlan = async (id: string) => {
  try {
    const { error } = await supabase
      .from('business_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return {
      success: true
    };
  } catch (error: any) {
    console.error('Error deleting business plan:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete business plan'
    };
  }
};
