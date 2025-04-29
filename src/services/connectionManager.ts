// Type for connection status
export type ConnectionStatus = 'online' | 'offline';

// Type for connection change callback
export type ConnectionChangeCallback = (status: ConnectionStatus) => void;

// Store for callbacks
const callbacks: ConnectionChangeCallback[] = [];

// Check if the browser is offline
export const isOffline = (): boolean => {
  if (typeof navigator !== 'undefined') {
    return !navigator.onLine;
  }
  return false;
};

// Subscribe to connection changes
export const onConnectionChange = (callback: ConnectionChangeCallback): (() => void) => {
  callbacks.push(callback);
  
  // Set up event listeners if this is the first callback
  if (callbacks.length === 1 && typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }
  
  // Return unsubscribe function
  return () => {
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
    
    // Remove event listeners if no more callbacks
    if (callbacks.length === 0 && typeof window !== 'undefined') {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    }
  };
};

// Handle online event
const handleOnline = () => {
  console.log('Connection restored');
  notifyCallbacks('online');
};

// Handle offline event
const handleOffline = () => {
  console.log('Connection lost');
  notifyCallbacks('offline');
};

// Notify all callbacks of connection change
const notifyCallbacks = (status: ConnectionStatus) => {
  callbacks.forEach(callback => {
    try {
      callback(status);
    } catch (error) {
      console.error('Error in connection change callback:', error);
    }
  });
};

// Initialize event listeners if in browser environment
if (typeof window !== 'undefined') {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

// Export a function to manually check connection and notify callbacks
export const checkConnection = (): ConnectionStatus => {
  const status = isOffline() ? 'offline' : 'online';
  notifyCallbacks(status);
  return status;
};
