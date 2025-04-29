import { useState, useEffect } from 'react';
import { onConnectionChange, isOffline as checkIsOffline } from '../services/connectionManager';

/**
 * Custom hook to track offline status
 * @returns An object with the current offline status
 */
export function useOfflineStatus() {
  const [offline, setOffline] = useState(checkIsOffline());

  useEffect(() => {
    // Set initial state
    setOffline(checkIsOffline());

    // Subscribe to connection changes
    const unsubscribe = onConnectionChange((status) => {
      setOffline(status === 'offline');
    });

    // Clean up subscription
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isOffline: offline,
    // Helper function to determine if we should show offline UI
    shouldShowOfflineUI: offline
  };
}

export default useOfflineStatus;
