import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { onConnectionChange, isOffline } from '../../services/connectionManager';

interface OfflineIndicatorProps {
  className?: string;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const [offline, setOffline] = useState(isOffline());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Initial check
    setOffline(isOffline());
    setVisible(isOffline());

    // Subscribe to connection changes using the ConnectionManager
    const unsubscribe = onConnectionChange((status) => {
      const isCurrentlyOffline = status === 'offline';
      setOffline(isCurrentlyOffline);

      if (isCurrentlyOffline) {
        // When going offline, show the indicator
        setVisible(true);
      } else {
        // When coming back online, show briefly then hide
        setVisible(true);
        setTimeout(() => setVisible(false), 3000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!offline && !visible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-md bg-amber-900/90 px-3 py-2 text-amber-100 shadow-lg ${className}`}
    >
      <WifiOff size={16} className="text-amber-300" />
      <span>
        {offline
          ? 'You are offline. Some features may be limited.'
          : 'Connection restored.'}
      </span>
      {offline && (
        <div className="ml-2 text-xs text-amber-300">
          Using cached data
        </div>
      )}
      <button
        onClick={() => setVisible(false)}
        className="ml-2 rounded-full p-1 hover:bg-black/20"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default OfflineIndicator;
