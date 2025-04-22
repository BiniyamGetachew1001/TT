import { supabase } from '../lib/supabase';
import type { Purchase } from '../lib/supabase';
import { createActivityLog } from '../services/activityLogService';

export class PurchaseModel {
  // Static methods for collection operations
  static async getAll(status?: string): Promise<{ success: boolean; data: Purchase[]; message?: string }> {
    try {
      // Use Supabase to fetch purchases with related data
      let query = supabase
        .from('purchases')
        .select(`
          *,
          user:user_id (*),
          book_summary:item_id (*)
        `)
        .order('created_at', { ascending: false });

      // Add status filter if provided
      if (status && status !== 'all') {
        query = query.eq('status', status);
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
      console.error('Error fetching purchases:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch purchases',
        data: []
      };
    }
  }

  static async getById(id: string): Promise<{ success: boolean; data: Purchase | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          user:user_id (*),
          book_summary:item_id (*)
        `)
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
      console.error('Error fetching purchase:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch purchase',
        data: null
      };
    }
  }

  static async create(purchase: Omit<Purchase, 'id' | 'created_at'>): Promise<{ success: boolean; data: Purchase | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .insert([{
          ...purchase,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'create',
        item_type: 'purchase',
        item_id: data[0].id,
        user_email: 'admin@example.com', // Replace with actual user email when available
        details: `${purchase.item_type} purchase for $${purchase.amount}`
      });

      return {
        success: true,
        data: data[0]
      };
    } catch (error: any) {
      console.error('Error creating purchase:', error);
      return {
        success: false,
        message: error.message || 'Failed to create purchase',
        data: null
      };
    }
  }

  // Instance methods for specific purchase operations
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  async updateStatus(status: string): Promise<{ success: boolean; data: Purchase | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .update({ status })
        .eq('id', this.id)
        .select();

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'update',
        item_type: 'purchase',
        item_id: this.id,
        user_email: 'admin@example.com', // Replace with actual user email when available
        details: `Status updated to ${status}`
      });

      return {
        success: true,
        data: data[0]
      };
    } catch (error: any) {
      console.error('Error updating purchase status:', error);
      return {
        success: false,
        message: error.message || 'Failed to update purchase status',
        data: null
      };
    }
  }

  async delete(): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', this.id);

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'delete',
        item_type: 'purchase',
        item_id: this.id,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error deleting purchase:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete purchase'
      };
    }
  }
}
