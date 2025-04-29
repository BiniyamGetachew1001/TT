import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineDataIndicatorProps {
  className?: string;
  message?: string;
}

/**
 * A component to indicate that data is being displayed from cache in offline mode
 */
const OfflineDataIndicator: React.FC<OfflineDataIndicatorProps> = ({
  className = '',
  message = 'Showing cached data - some content may be outdated'
}) => {
  return (
    <div className={`flex items-center gap-2 rounded-md bg-amber-900/90 px-3 py-2 text-amber-100 text-sm ${className}`}>
      <WifiOff size={16} className="text-amber-300" />
      <span>{message}</span>
    </div>
  );
};

export default OfflineDataIndicator;
