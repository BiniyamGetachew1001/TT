export interface NewsletterSubscription {
  email: string;
  name: string;
  subscribed_at?: string;
}

// Mock storage for newsletter subscribers
const getSubscribers = (): NewsletterSubscription[] => {
  const storedSubscribers = localStorage.getItem('newsletter_subscribers');
  if (storedSubscribers) {
    try {
      return JSON.parse(storedSubscribers);
    } catch (e) {
      console.error('Error parsing newsletter subscribers from localStorage:', e);
      return [];
    }
  }
  return [];
};

const saveSubscribers = (subscribers: NewsletterSubscription[]) => {
  localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
};

export const subscribeToNewsletter = async (email: string, name: string) => {
  try {
    console.log('Using mock data for newsletter subscription');

    // Get current subscribers
    const subscribers = getSubscribers();

    // Check if the email already exists
    const existingSubscription = subscribers.find(sub => sub.email === email);

    if (existingSubscription) {
      return {
        success: false,
        message: 'This email is already subscribed to our newsletter.'
      };
    }

    // Add new subscription
    const newSubscription: NewsletterSubscription = {
      email,
      name,
      subscribed_at: new Date().toISOString()
    };

    subscribers.push(newSubscription);
    saveSubscribers(subscribers);

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
    console.log('Using mock data for newsletter unsubscription');

    // Get current subscribers
    const subscribers = getSubscribers();

    // Filter out the email to unsubscribe
    const updatedSubscribers = subscribers.filter(sub => sub.email !== email);

    // If no subscribers were removed, the email wasn't subscribed
    if (subscribers.length === updatedSubscribers.length) {
      return {
        success: false,
        message: 'This email is not subscribed to our newsletter.'
      };
    }

    // Save updated subscribers
    saveSubscribers(updatedSubscribers);

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
