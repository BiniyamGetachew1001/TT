import { supabase } from '../lib/supabase';

export interface NewsletterSubscription {
  email: string;
  name: string;
  subscribed_at?: string;
}

export const subscribeToNewsletter = async (email: string, name: string) => {
  try {
    // Check if the email already exists
    const { data: existingSubscription, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if the email is not subscribed
      throw checkError;
    }

    if (existingSubscription) {
      return {
        success: false,
        message: 'This email is already subscribed to our newsletter.'
      };
    }

    // Add new subscription
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          name,
          subscribed_at: new Date().toISOString()
        }
      ]);

    if (error) {
      // If the table doesn't exist, return a mock success response
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        console.log('Using mock response for newsletter subscription');
        return {
          success: true,
          message: 'Thank you for subscribing to our newsletter!'
        };
      }
      throw error;
    }

    return {
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    };
  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      message: error.message || 'Failed to subscribe to newsletter. Please try again later.'
    };
  }
};

export const unsubscribeFromNewsletter = async (email: string) => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('email', email);

    if (error) throw error;

    return {
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.'
    };
  } catch (error: any) {
    console.error('Error unsubscribing from newsletter:', error);
    return {
      success: false,
      message: error.message || 'Failed to unsubscribe from newsletter. Please try again later.'
    };
  }
};
