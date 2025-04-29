import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * A simple component for testing authentication
 * This is only for development/testing purposes
 */
const MockLoginButton: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login('admin@example.com', 'password123');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-[#3a2819] p-3 rounded-md shadow-lg border border-[#7a4528]">
      {isAuthenticated ? (
        <div className="flex flex-col gap-2">
          <div className="text-sm text-white">
            <span className="text-[#c9a52c] font-bold">Logged in as:</span> {user?.email}
            <br />
            <span className="text-[#c9a52c] font-bold">Role:</span> {user?.role}
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded-md text-sm"
          >
            {isLoading ? 'Logging out...' : 'Mock Logout'}
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-[#c9a52c] hover:bg-[#b89420] text-[#2d1e14] px-3 py-1 rounded-md text-sm"
        >
          {isLoading ? 'Logging in...' : 'Mock Login (Admin)'}
        </button>
      )}
      <div className="text-xs text-gray-400 mt-1">For testing only</div>
    </div>
  );
};

export default MockLoginButton;
