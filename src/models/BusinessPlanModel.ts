import { supabase } from '../lib/supabase';
import type { BusinessPlan } from '../lib/supabase';
import { createActivityLog } from '../services/activityLogService';

export class BusinessPlanModel {
  // Static methods for collection operations
  static async getAll(industry?: string): Promise<{ success: boolean; data: BusinessPlan[]; message?: string }> {
    try {
      // Use Supabase to fetch business plans
      let query = supabase
        .from('business_plans')
        .select('*')
        .order('created_at', { ascending: false });

      // Add industry filter if provided
      if (industry && industry !== 'all') {
        query = query.eq('industry', industry);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

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
  }

  static async getById(id: string): Promise<{ success: boolean; data: BusinessPlan | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('business_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

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
  }

  static async create(businessPlan: Omit<BusinessPlan, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: BusinessPlan | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('business_plans')
        .insert([{
          ...businessPlan,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'create',
        item_type: 'business-plan',
        item_id: data[0].id,
        item_title: data[0].title,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

      return {
        success: true,
        data: data[0]
      };
    } catch (error: any) {
      console.error('Error creating business plan:', error);
      return {
        success: false,
        message: error.message || 'Failed to create business plan',
        data: null
      };
    }
  }

  // Instance methods for specific business plan operations
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  async update(updates: Partial<BusinessPlan>): Promise<{ success: boolean; data: BusinessPlan | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('business_plans')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', this.id)
        .select();

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'update',
        item_type: 'business-plan',
        item_id: data[0].id,
        item_title: data[0].title,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

      return {
        success: true,
        data: data[0]
      };
    } catch (error: any) {
      console.error('Error updating business plan:', error);
      return {
        success: false,
        message: error.message || 'Failed to update business plan',
        data: null
      };
    }
  }

  async delete(): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .from('business_plans')
        .delete()
        .eq('id', this.id);

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'delete',
        item_type: 'business-plan',
        item_id: this.id,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

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
  }
}
