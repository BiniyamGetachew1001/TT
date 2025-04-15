import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Dashboard Cards */}
          <div className="bg-[#3a2819] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Book Summaries</h2>
            <p className="text-gray-300 mb-4">Manage your book summaries collection</p>
            <button className="gold-button w-full">Manage Books</button>
          </div>
          
          <div className="bg-[#3a2819] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Business Plans</h2>
            <p className="text-gray-300 mb-4">Manage your business plan templates</p>
            <button className="gold-button w-full">Manage Plans</button>
          </div>
          
          <div className="bg-[#3a2819] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Blog Posts</h2>
            <p className="text-gray-300 mb-4">Create and manage blog content</p>
            <button className="gold-button w-full">Manage Blog</button>
          </div>
        </div>
        
        <div className="bg-[#3a2819] rounded-xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-[#4a2e1c]">
              <div>
                <p className="font-medium">New book summary added</p>
                <p className="text-sm text-gray-400">The Psychology of Money</p>
              </div>
              <span className="text-sm text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#4a2e1c]">
              <div>
                <p className="font-medium">Business plan updated</p>
                <p className="text-sm text-gray-400">E-commerce Business Plan</p>
              </div>
              <span className="text-sm text-gray-400">Yesterday</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#4a2e1c]">
              <div>
                <p className="font-medium">New user registered</p>
                <p className="text-sm text-gray-400">user@example.com</p>
              </div>
              <span className="text-sm text-gray-400">2 days ago</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#3a2819] rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#2d1e14] p-4 rounded-lg">
              <h3 className="font-medium mb-2">Database</h3>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Operational</span>
              </div>
            </div>
            <div className="bg-[#2d1e14] p-4 rounded-lg">
              <h3 className="font-medium mb-2">Storage</h3>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Operational</span>
              </div>
            </div>
            <div className="bg-[#2d1e14] p-4 rounded-lg">
              <h3 className="font-medium mb-2">Authentication</h3>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
