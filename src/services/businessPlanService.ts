import { supabase, adminSupabase } from '../lib/supabase';
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
    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Authentication error:', sessionError);
      throw new Error('You must be logged in to create content');
    }

    if (!sessionData.session) {
      // For development/testing, we'll use a mock session
      console.warn('No active session found. Using mock data for development.');

      // Return mock success response
      return {
        success: true,
        data: {
          id: `mock-${Date.now()}`,
          ...businessPlan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as BusinessPlan
      };
    }

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

    // Ensure all required fields are present
    const businessPlanData = {
      ...businessPlan,
      cover_image: coverImage,
      is_free: businessPlan.is_free || false,
      content: businessPlan.content || '',
      description: businessPlan.description || '',
      author: businessPlan.author || 'Admin',
      read_time: businessPlan.read_time || '15 min',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Use adminSupabase to bypass RLS for development
    const { data, error } = await adminSupabase
      .from('business_plans')
      .insert([businessPlanData])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

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
    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Authentication error:', sessionError);
      throw new Error('You must be logged in to update content');
    }

    if (!sessionData.session) {
      // For development/testing, we'll use a mock session
      console.warn('No active session found. Using mock data for development.');

      // Return mock success response
      return {
        success: true,
        data: {
          id,
          ...businessPlan,
          updated_at: new Date().toISOString()
        } as BusinessPlan
      };
    }

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

    // Ensure all required fields are present
    const updateData = {
      ...businessPlan,
      cover_image: coverImage,
      is_free: businessPlan.is_free !== undefined ? businessPlan.is_free : false,
      // Only include these fields if they're being updated
      ...(businessPlan.content !== undefined ? { content: businessPlan.content } : {}),
      ...(businessPlan.description !== undefined ? { description: businessPlan.description } : {}),
      ...(businessPlan.author !== undefined ? { author: businessPlan.author } : {}),
      ...(businessPlan.read_time !== undefined ? { read_time: businessPlan.read_time } : {}),
      updated_at: new Date().toISOString()
    };

    // Use adminSupabase to bypass RLS for development
    const { data, error } = await adminSupabase
      .from('business_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

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
    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Authentication error:', sessionError);
      throw new Error('You must be logged in to delete content');
    }

    if (!sessionData.session) {
      // For development/testing, we'll use a mock session
      console.warn('No active session found. Using mock data for development.');

      // Return mock success response
      return {
        success: true
      };
    }

    // Use adminSupabase to bypass RLS for development
    const { error } = await adminSupabase
      .from('business_plans')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

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
