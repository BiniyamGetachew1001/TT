import { supabase } from '../lib/supabase';
import type { BookSummary } from '../lib/supabase';
import { createActivityLog } from '../services/activityLogService';

export class BookSummaryModel {
  // Static methods for collection operations
  static async getAll(category?: string): Promise<{ success: boolean; data: BookSummary[]; message?: string }> {
    try {
      // Use Supabase to fetch book summaries
      let query = supabase
        .from('book_summaries')
        .select('*')
        .order('created_at', { ascending: false });

      // Add category filter if provided
      if (category && category !== 'all') {
        query = query.eq('category', category);
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
      console.error('Error fetching book summaries:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch book summaries',
        data: []
      };
    }
  }

  static async getById(id: string): Promise<{ success: boolean; data: BookSummary | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('book_summaries')
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
      console.error('Error fetching book summary:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch book summary',
        data: null
      };
    }
  }

  static async create(bookSummary: Omit<BookSummary, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: BookSummary | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('book_summaries')
        .insert([{
          ...bookSummary,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'create',
        item_type: 'book-summary',
        item_id: data[0].id,
        item_title: data[0].title,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

      return {
        success: true,
        data: data[0]
      };
    } catch (error: any) {
      console.error('Error creating book summary:', error);
      return {
        success: false,
        message: error.message || 'Failed to create book summary',
        data: null
      };
    }
  }

  // Instance methods for specific book summary operations
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  async update(updates: Partial<BookSummary>): Promise<{ success: boolean; data: BookSummary | null; message?: string }> {
    try {
      const { data, error } = await supabase
        .from('book_summaries')
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
        item_type: 'book-summary',
        item_id: data[0].id,
        item_title: data[0].title,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

      return {
        success: true,
        data: data[0]
      };
    } catch (error: any) {
      console.error('Error updating book summary:', error);
      return {
        success: false,
        message: error.message || 'Failed to update book summary',
        data: null
      };
    }
  }

  async delete(): Promise<{ success: boolean; message?: string }> {
    try {
      const { error } = await supabase
        .from('book_summaries')
        .delete()
        .eq('id', this.id);

      if (error) throw error;

      // Log activity
      await createActivityLog({
        action: 'delete',
        item_type: 'book-summary',
        item_id: this.id,
        user_email: 'admin@example.com' // Replace with actual user email when available
      });

      return {
        success: true
      };
    } catch (error: any) {
      console.error('Error deleting book summary:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete book summary'
      };
    }
  }
}
