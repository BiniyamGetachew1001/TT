import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, AlertCircle, DollarSign, ShoppingCart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data for purchases
const mockPurchases = [
  {
    id: 'p1',
    userId: 'user1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    itemType: 'book-summary',
    itemId: '1',
    itemTitle: 'The Psychology of Money',
    amount: 9.99,
    currency: 'USD',
    status: 'completed',
    paymentId: 'pay_123456',
    createdAt: '2023-07-15T10:00:00Z'
  },
  {
    id: 'p2',
    userId: 'user2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    itemType: 'business-plan',
    itemId: '1',
    itemTitle: 'E-commerce Business Plan',
    amount: 29.99,
    currency: 'USD',
    status: 'completed',
    paymentId: 'pay_123457',
    createdAt: '2023-07-14T09:15:00Z'
  },
  {
    id: 'p3',
    userId: 'user3',
    userName: 'Bob Johnson',
    userEmail: 'bob@example.com',
    itemType: 'book-summary',
    itemId: '3',
    itemTitle: 'Zero to One',
    amount: 9.99,
    currency: 'USD',
    status: 'pending',
    paymentId: 'pay_123458',
    createdAt: '2023-07-13T14:20:00Z'
  },
  {
    id: 'p4',
    userId: 'user4',
    userName: 'Alice Brown',
    userEmail: 'alice@example.com',
    itemType: 'business-plan',
    itemId: '3',
    itemTitle: 'Restaurant Business Plan',
    amount: 29.99,
    currency: 'USD',
    status: 'failed',
    paymentId: 'pay_123459',
    createdAt: '2023-07-12T08:30:00Z'
  },
  {
    id: 'p5',
    userId: 'user5',
    userName: 'Michael Wilson',
    userEmail: 'michael@example.com',
    itemType: 'book-summary',
    itemId: '2',
    itemTitle: 'Atomic Habits',
    amount: 9.99,
    currency: 'USD',
    status: 'completed',
    paymentId: 'pay_123460',
    createdAt: '2023-07-10T11:45:00Z'
  }
];

const PurchasesPage: React.FC = () => {
  const { supabase } = useAuth();
  const [purchases, setPurchases] = useState(mockPurchases);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<any | null>(null);

  useEffect(() => {
    // In a real implementation, you would fetch actual data from the API
    // For now, we'll use the mock data
    const fetchPurchases = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPurchases(mockPurchases);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchases();
  }, [supabase]);

  const handleViewClick = (purchase: any) => {
    setSelectedPurchase(purchase);
    setViewModalOpen(true);
  };

  const handleUpdateStatus = (purchaseId: string, newStatus: string) => {
    // In a real implementation, you would call the API to update the status
    setPurchases(prevPurchases =>
      prevPurchases.map(purchase =>
        purchase.id === purchaseId ? { ...purchase, status: newStatus } : purchase
      )
    );

    if (selectedPurchase && selectedPurchase.id === purchaseId) {
      setSelectedPurchase({ ...selectedPurchase, status: newStatus });
    }
  };

  // Filter purchases based on search term, type, and status
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = searchTerm
      ? purchase.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.itemTitle.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesType = filterType
      ? purchase.itemType === filterType
      : true;

    const matchesStatus = filterStatus
      ? purchase.status === filterStatus
      : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="admin-badge admin-badge-success">Completed</span>;
      case 'pending':
        return <span className="admin-badge admin-badge-warning">Pending</span>;
      case 'failed':
        return <span className="admin-badge admin-badge-error">Failed</span>;
      default:
        return <span className="admin-badge admin-badge-default">{status}</span>;
    }
  };

  const getItemTypeBadge = (type: string) => {
    switch (type) {
      case 'book-summary':
        return <span className="admin-badge admin-badge-info">Book Summary</span>;
      case 'business-plan':
        return <span className="admin-badge admin-badge-warning">Business Plan</span>;
      default:
        return <span className="admin-badge admin-badge-default">{type}</span>;
    }
  };

  // Calculate total revenue
  const totalRevenue = filteredPurchases
    .filter(purchase => purchase.status === 'completed')
    .reduce((sum, purchase) => sum + purchase.amount, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gold-text">Purchases</h1>
        <p className="text-gray-400">Manage customer purchases and transactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="admin-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">${totalRevenue.toFixed(2)}</h3>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <DollarSign size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Purchases</p>
              <h3 className="text-2xl font-bold mt-1">{filteredPurchases.length}</h3>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <ShoppingCart size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed Rate</p>
              <h3 className="text-2xl font-bold mt-1">
                {filteredPurchases.length > 0
                  ? `${Math.round(
                      (filteredPurchases.filter(p => p.status === 'completed').length /
                        filteredPurchases.length) *
                        100
                    )}%`
                  : '0%'}
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <CheckCircle size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="admin-select"
          >
            <option value="">All Types</option>
            <option value="book-summary">Book Summary</option>
            <option value="business-plan">Business Plan</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Purchases List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Item</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td>
                      <span className="font-mono text-sm">{purchase.id}</span>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">{purchase.userName}</div>
                        <div className="text-sm text-gray-400">{purchase.userEmail}</div>
                      </div>
                    </td>
                    <td>{purchase.itemTitle}</td>
                    <td>{getItemTypeBadge(purchase.itemType)}</td>
                    <td>${purchase.amount.toFixed(2)}</td>
                    <td>{getStatusBadge(purchase.status)}</td>
                    <td>{formatDate(purchase.createdAt)}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewClick(purchase)}
                          className="p-1.5 glass-button text-blue-400 hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {purchase.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateStatus(purchase.id, 'completed')}
                            className="p-1.5 glass-button text-green-400 hover:text-green-300"
                            title="Mark as Completed"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {purchase.status !== 'failed' && (
                          <button
                            onClick={() => handleUpdateStatus(purchase.id, 'failed')}
                            className="p-1.5 glass-button text-red-400 hover:text-red-300"
                            title="Mark as Failed"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        {purchase.status !== 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(purchase.id, 'pending')}
                            className="p-1.5 glass-button text-yellow-400 hover:text-yellow-300"
                            title="Mark as Pending"
                          >
                            <AlertCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Purchase Modal */}
      {viewModalOpen && selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Purchase Details</h2>
              <button
                onClick={() => setViewModalOpen(false)}
                className="p-1 glass-button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <span className="ml-2">{selectedPurchase.userName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <span className="ml-2">{selectedPurchase.userEmail}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">User ID:</span>
                    <span className="ml-2 font-mono text-sm">{selectedPurchase.userId}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Purchase Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Item:</span>
                    <span className="ml-2">{selectedPurchase.itemTitle}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-2">{getItemTypeBadge(selectedPurchase.itemType)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Item ID:</span>
                    <span className="ml-2 font-mono text-sm">{selectedPurchase.itemId}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Amount:</span>
                    <span className="ml-2">${selectedPurchase.amount.toFixed(2)} {selectedPurchase.currency}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <span className="ml-2">{getStatusBadge(selectedPurchase.status)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Payment ID:</span>
                    <span className="ml-2 font-mono text-sm">{selectedPurchase.paymentId}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Timing Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Purchase Date:</span>
                    <span className="ml-2">{formatDate(selectedPurchase.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Purchase ID:</span>
                    <span className="ml-2 font-mono text-sm">{selectedPurchase.id}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[#4a2e1c]">
              <div>
                <span className="text-gray-400">Update Status:</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleUpdateStatus(selectedPurchase.id, 'completed')}
                  className={`p-2 glass-button text-green-400 hover:text-green-300 ${
                    selectedPurchase.status === 'completed' ? 'bg-green-900/30' : ''
                  }`}
                  disabled={selectedPurchase.status === 'completed'}
                >
                  <CheckCircle size={18} />
                  <span className="ml-2">Completed</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedPurchase.id, 'pending')}
                  className={`p-2 glass-button text-yellow-400 hover:text-yellow-300 ${
                    selectedPurchase.status === 'pending' ? 'bg-yellow-900/30' : ''
                  }`}
                  disabled={selectedPurchase.status === 'pending'}
                >
                  <AlertCircle size={18} />
                  <span className="ml-2">Pending</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedPurchase.id, 'failed')}
                  className={`p-2 glass-button text-red-400 hover:text-red-300 ${
                    selectedPurchase.status === 'failed' ? 'bg-red-900/30' : ''
                  }`}
                  disabled={selectedPurchase.status === 'failed'}
                >
                  <XCircle size={18} />
                  <span className="ml-2">Failed</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchasesPage;
