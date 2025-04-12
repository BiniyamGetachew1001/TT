import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  FileText,
  ShoppingCart,
  TrendingUp,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import mockApi from '../services/mockApi';

interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  totalBlogs: number;
  totalPurchases: number;
  revenue: number;
  activeUsers: number;
  recentPurchases: any[];
  popularContent: any[];
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the mock API service
        const dashboardStats = await mockApi.getDashboardStats();
        setStats(dashboardStats);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-red-400 text-xl mb-4">Error loading dashboard data</div>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="gold-button"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-gray-400">No dashboard data available</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gold-text">Dashboard</h1>
        <p className="text-gray-400">Welcome to the TilkTibeb admin dashboard, {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="admin-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
              <div className="flex items-center mt-2 text-green-400 text-xs">
                <ArrowUpRight size={14} className="mr-1" />
                <span>12% increase</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <Users size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Book Summaries</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalBooks}</h3>
              <div className="flex items-center mt-2 text-green-400 text-xs">
                <ArrowUpRight size={14} className="mr-1" />
                <span>5% increase</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <BookOpen size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Blog Posts</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalBlogs}</h3>
              <div className="flex items-center mt-2 text-green-400 text-xs">
                <ArrowUpRight size={14} className="mr-1" />
                <span>8% increase</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <FileText size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">${stats.revenue}</h3>
              <div className="flex items-center mt-2 text-red-400 text-xs">
                <ArrowDownRight size={14} className="mr-1" />
                <span>3% decrease</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <TrendingUp size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="admin-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Purchases</h2>
            <ShoppingCart size={20} className="text-[#c9a52c]" />
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Item</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPurchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td>{purchase.userName || purchase.user}</td>
                    <td>{purchase.itemTitle || purchase.item}</td>
                    <td>${purchase.amount.toFixed(2)}</td>
                    <td>{new Date(purchase.createdAt || purchase.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Content */}
        <div className="admin-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Popular Content</h2>
            <Eye size={20} className="text-[#c9a52c]" />
          </div>
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.popularContent.map(content => (
                  <tr key={content.id}>
                    <td>{content.title}</td>
                    <td>
                      <span className={`admin-badge ${
                        content.type === 'book' ? 'admin-badge-success' :
                        content.type === 'blog' ? 'admin-badge-info' :
                        'admin-badge-warning'
                      }`}>
                        {content.type === 'book' ? 'Book' :
                         content.type === 'blog' ? 'Blog' : 'Plan'}
                      </span>
                    </td>
                    <td>{content.views.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="admin-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Active Users</h2>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>{stats.activeUsers} online now</span>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center bg-[#2d1e14]/50 rounded-lg">
          <p className="text-gray-400">User activity chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
