import { supabase } from '../../lib/supabase';
import type { BookSummary } from '../../lib/supabase';

export const bookSummariesApi = {
  // Get all book summaries
  async getAllBookSummaries() {
    const { data, error } = await supabase
      .from('book_summaries')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get a single book summary by ID
  async getBookSummaryById(id: string) {
    const { data, error } = await supabase
      .from('book_summaries')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Create a new book summary
  async createBookSummary(bookSummary: Omit<BookSummary, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('book_summaries')
      .insert([bookSummary])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update an existing book summary
  async updateBookSummary(id: string, bookSummary: Partial<BookSummary>) {
    const { data, error } = await supabase
      .from('book_summaries')
      .update(bookSummary)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Delete a book summary
  async deleteBookSummary(id: string) {
    const { error } = await supabase
      .from('book_summaries')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },
  
  // Update book summary price
  async updateBookSummaryPrice(id: string, price: number) {
    const { data, error } = await supabase
      .from('book_summaries')
      .update({ price })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Get book summaries by category
  async getBookSummariesByCategory(category: string) {
    const { data, error } = await supabase
      .from('book_summaries')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};
