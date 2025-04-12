import { supabase } from '../../lib/supabase';
import type { User } from '../../lib/supabase';

export const usersApi = {
  // Get all users
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },
  
  // Get a single user by ID
  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update an existing user
  async updateUser(id: string, user: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Delete a user (this will only work if there are no references to this user)
  async deleteUser(id: string) {
    // First, delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;
    
    // The trigger should automatically delete the user from the users table
    return { success: true };
  },
  
  // Create a new user (admin only)
  async createUser(email: string, password: string, userData: Partial<User>) {
    // Create the auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name: userData.name
      }
    });
    
    if (authError) throw authError;
    
    // The trigger should automatically create the user in the users table
    // Update the user with additional data
    if (userData.role || userData.status) {
      const { data, error } = await supabase
        .from('users')
        .update({
          role: userData.role,
          status: userData.status
        })
        .eq('id', authData.user.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
    
    return authData.user;
  },
  
  // Update user role
  async updateUserRole(id: string, role: 'user' | 'admin') {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Update user status
  async updateUserStatus(id: string, status: 'active' | 'inactive') {
    const { data, error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  // Get users by role
  async getUsersByRole(role: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  }
};
