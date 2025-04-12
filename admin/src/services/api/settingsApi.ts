import { supabase } from '../../lib/supabase';

export const settingsApi = {
  // Get all settings
  async getAllSettings() {
    const { data, error } = await supabase
      .from('settings')
      .select('*');
      
    if (error) throw error;
    
    // Convert to a more usable format
    const settings: Record<string, any> = {};
    data.forEach(setting => {
      settings[setting.key] = setting.value;
    });
    
    return settings;
  },
  
  // Get a single setting by key
  async getSettingByKey(key: string) {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('key', key)
      .single();
      
    if (error) throw error;
    return data.value;
  },
  
  // Update or create a setting
  async updateSetting(key: string, value: any) {
    // Check if the setting exists
    const { data: existingData } = await supabase
      .from('settings')
      .select('id')
      .eq('key', key)
      .single();
    
    if (existingData) {
      // Update existing setting
      const { data, error } = await supabase
        .from('settings')
        .update({ value })
        .eq('key', key)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } else {
      // Create new setting
      const { data, error } = await supabase
        .from('settings')
        .insert([{ key, value }])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
  },
  
  // Delete a setting
  async deleteSetting(key: string) {
    const { error } = await supabase
      .from('settings')
      .delete()
      .eq('key', key);
      
    if (error) throw error;
    return { success: true };
  },
  
  // Get site settings
  async getSiteSettings() {
    const { data: siteSettingsData } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'site_settings')
      .single();
    
    if (siteSettingsData) {
      return siteSettingsData.value;
    }
    
    // Default site settings
    return {
      siteName: 'TilkTibeb',
      siteDescription: 'Book summaries and business plans platform',
      siteUrl: 'https://tilktibeb.com',
      logoUrl: '/logo.png',
      faviconUrl: '/favicon.ico'
    };
  },
  
  // Get payment settings
  async getPaymentSettings() {
    const { data: paymentSettingsData } = await supabase
      .from('settings')
      .select('*')
      .eq('key', 'payment_settings')
      .single();
    
    if (paymentSettingsData) {
      return paymentSettingsData.value;
    }
    
    // Default payment settings
    return {
      currencyCode: 'USD',
      chapaApiKey: '',
      chapaSecretKey: '',
      defaultBookPrice: 9.99,
      defaultPlanPrice: 29.99
    };
  }
};
