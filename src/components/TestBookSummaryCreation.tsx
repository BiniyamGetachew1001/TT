import React, { useState } from 'react';
import { createBookSummary } from '../services/BookSummaryService';
import { useAuth } from '../contexts/AuthContext';

/**
 * A simple component for testing book summary creation with authentication
 */
const TestBookSummaryCreation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestCreate = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      // Create a simple test book summary
      const testBookSummary = {
        title: 'Test Book Summary',
        author: 'Test Author',
        description: 'This is a test book summary created to test RLS policies',
        content: 'Test content for the book summary',
        cover_image: 'https://via.placeholder.com/300x450',
        read_time: '5 min',
        category: 'Test',
        price: 0
      };

      console.log('Creating test book summary...');
      const response = await createBookSummary(testBookSummary);

      setResult(response);
      if (!response.success) {
        setError(response.message || 'Unknown error occurred');
      }
    } catch (err: any) {
      console.error('Error in test creation:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Get authentication state from context
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#3a2819] p-4 rounded-md shadow-lg border border-[#7a4528] max-w-md">
      <h3 className="text-[#c9a52c] font-bold mb-2">Test Book Summary Creation</h3>

      <div className="mb-4">
        <div className="text-sm text-white mb-2">
          {isAuthenticated ? (
            <>
              <span className="text-[#c9a52c] font-bold">Logged in as:</span> {user?.email}
              <br />
              <span className="text-[#c9a52c] font-bold">Role:</span> {user?.role}
            </>
          ) : (
            <span className="text-red-400">Not logged in</span>
          )}
        </div>
      </div>

      <button
        onClick={handleTestCreate}
        disabled={isLoading}
        className="bg-[#c9a52c] hover:bg-[#b89420] text-[#2d1e14] px-3 py-1 rounded-md text-sm mb-2 w-full"
      >
        {isLoading ? 'Creating...' : 'Test Create Book Summary'}
      </button>

      {error && (
        <div className="text-red-400 text-sm mt-2 p-2 bg-[#2d1e14] rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="text-sm mt-2 p-2 bg-[#2d1e14] rounded overflow-auto max-h-40">
          <strong className="text-[#c9a52c]">Result:</strong>
          <pre className="text-white text-xs mt-1 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-2">For testing only</div>
    </div>
  );
};

export default TestBookSummaryCreation;
