import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';

interface NetworkStatusProps {
  supabaseUrl: string;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ supabaseUrl }) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [message, setMessage] = useState<string>('Checking connection...');
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Try to fetch a small resource from the Supabase domain
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${supabaseUrl}/storage/v1/object/public/health-check`, {
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setStatus('online');
          setMessage('Connected to database');
          // Hide after 3 seconds if connected
          setTimeout(() => setIsVisible(false), 3000);
        } else {
          setStatus('offline');
          setMessage('Database connection issue');
          setIsVisible(true);
        }
      } catch (error: any) {
        console.error('Network check error:', error);
        setStatus('offline');
        
        if (error.name === 'AbortError') {
          setMessage('Connection timeout');
        } else if (error.message.includes('ERR_NAME_NOT_RESOLVED')) {
          setMessage('Cannot resolve database URL');
        } else if (error.message.includes('Failed to fetch')) {
          setMessage('Network connection issue');
        } else {
          setMessage('Database connection issue');
        }
        
        setIsVisible(true);
      }
    };

    checkConnection();
    
    // Check connection every 30 seconds
    const intervalId = setInterval(checkConnection, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [supabaseUrl]);

  // Don't render anything if checking or if online and not visible
  if (status === 'checking' || (status === 'online' && !isVisible)) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-md px-3 py-2 text-sm shadow-lg transition-all duration-300 ${
        status === 'online' 
          ? 'bg-green-900/80 text-green-100' 
          : 'bg-red-900/80 text-red-100'
      }`}
    >
      {status === 'online' ? (
        <Wifi size={16} className="text-green-300" />
      ) : (
        <WifiOff size={16} className="text-red-300" />
      )}
      <span>{message}</span>
      {status === 'offline' && (
        <div className="ml-2 flex items-center gap-1 rounded bg-red-800/50 px-2 py-1 text-xs">
          <AlertTriangle size={12} />
          <span>Using mock data</span>
        </div>
      )}
      <button 
        onClick={() => setIsVisible(false)}
        className="ml-2 rounded-full p-1 hover:bg-black/20"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default NetworkStatus;
