import { supabase } from '../../lib/supabase';
import type { BusinessPlan } from '../../lib/supabase';

export const businessPlansApi = {
  // Get all business plans
  async getAllBusinessPlans() {
    const { data, error } = await supabase
      .from('business_plans')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get a single business plan by ID
  async getBusinessPlanById(id: string) {
    const { data, error } = await supabase
      .from('business_plans')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Create a new business plan
  async createBusinessPlan(businessPlan: Omit<BusinessPlan, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('business_plans')
      .insert([businessPlan])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update an existing business plan
  async updateBusinessPlan(id: string, businessPlan: Partial<BusinessPlan>) {
    const { data, error } = await supabase
      .from('business_plans')
      .update(businessPlan)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Delete a business plan
  async deleteBusinessPlan(id: string) {
    const { error } = await supabase
      .from('business_plans')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },
  
  // Update business plan price
  async updateBusinessPlanPrice(id: string, price: number) {
    const { data, error } = await supabase
      .from('business_plans')
      .update({ price })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Get business plans by industry
  async getBusinessPlansByIndustry(industry: string) {
    const { data, error } = await supabase
      .from('business_plans')
      .select('*')
      .eq('industry', industry)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};
