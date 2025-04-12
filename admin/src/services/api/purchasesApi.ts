import { supabase } from '../../lib/supabase';
import type { Purchase } from '../../lib/supabase';

export const purchasesApi = {
  // Get all purchases
  async getAllPurchases() {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        user:user_id(id, name, email)
      `)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get a single purchase by ID
  async getPurchaseById(id: string) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        user:user_id(id, name, email)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update purchase status
  async updatePurchaseStatus(id: string, status: 'pending' | 'completed' | 'failed') {
    const { data, error } = await supabase
      .from('purchases')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Get purchases by user
  async getPurchasesByUser(userId: string) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        user:user_id(id, name, email)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get purchases by status
  async getPurchasesByStatus(status: string) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        user:user_id(id, name, email)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get purchases by item type
  async getPurchasesByItemType(itemType: string) {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        user:user_id(id, name, email)
      `)
      .eq('item_type', itemType)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get total revenue
  async getTotalRevenue() {
    const { data, error } = await supabase
      .from('purchases')
      .select('amount')
      .eq('status', 'completed');
      
    if (error) throw error;
    
    const totalRevenue = data.reduce((sum, purchase) => sum + purchase.amount, 0);
    return { totalRevenue };
  }
};
