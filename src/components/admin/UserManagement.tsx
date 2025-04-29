import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Mail, Calendar, ShoppingCart, Shield, Edit, Trash2, UserPlus } from 'lucide-react';
import { Purchase } from '../../services/purchaseService';

// Mock user data structure
interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
}

interface UserManagementProps {
  purchases: Purchase[];
}

const UserManagement: React.FC<UserManagementProps> = ({ purchases }) => {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Generate mock users from purchases
    const uniqueUserIds = new Set<string>();
    const userMap = new Map<string, MockUser>();
    
    purchases.forEach(purchase => {
      if (purchase.user_id && !uniqueUserIds.has(purchase.user_id)) {
        uniqueUserIds.add(purchase.user_id);
        
        const userName = purchase.user?.name || 'Unknown User';
        const userEmail = purchase.user?.email || `user-${purchase.user_id}@example.com`;
        
        userMap.set(purchase.user_id, {
          id: purchase.user_id,
          name: userName,
          email: userEmail,
          role: userEmail.includes('admin') ? 'admin' : 'user',
          status: 'active',
          created_at: purchase.created_at || new Date().toISOString()
        });
      }
    });
    
    // Add some mock admin users if none exist
    if (!Array.from(userMap.values()).some(user => user.role === 'admin')) {
      userMap.set('admin-1', {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString()
      });
    }
    
    // Add some inactive users for demonstration
    userMap.set('inactive-1', {
      id: 'inactive-1',
      name: 'Inactive User',
      email: 'inactive@example.com',
      role: 'user',
      status: 'inactive',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    });
    
    setUsers(Array.from(userMap.values()));
    setIsLoading(false);
  }, [purchases]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get user purchase count
  const getUserPurchaseCount = (userId: string) => {
    return purchases.filter(purchase => purchase.user_id === userId).length;
  };

  // Get user total spent
  const getUserTotalSpent = (userId: string) => {
    return purchases
      .filter(purchase => purchase.user_id === userId)
      .reduce((total, purchase) => total + (purchase.amount || 0), 0);
  };

  // Handle opening the user modal
  const handleOpenUserModal = (user?: MockUser) => {
    setSelectedUser(user || null);
    setIsUserModalOpen(true);
  };

  // Handle opening the delete confirmation modal
  const handleOpenDeleteModal = (user: MockUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Mock function to handle user form submission
  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would update the user in the database
    setIsUserModalOpen(false);
    // For now, just close the modal
  };

  // Mock function to handle user deletion
  const handleDeleteUser = () => {
    if (selectedUser) {
      // In a real implementation, this would delete the user from the database
      setUsers(users.filter(user => user.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md bg-[#2d1e14] border border-[#7a4528]/50 pl-10 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
          />
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | 'user' | 'admin')}
              className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c] appearance-none pr-8"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c] appearance-none pr-8"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => handleOpenUserModal()}
            className="gold-button flex items-center whitespace-nowrap"
          >
            <UserPlus size={16} className="mr-1" /> Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#2d1e14] text-left">
              <th className="p-3 rounded-tl-lg">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Purchases</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const purchaseCount = getUserPurchaseCount(user.id);
                const totalSpent = getUserTotalSpent(user.id);
                const joinedDate = new Date(user.created_at).toLocaleDateString();
                
                return (
                  <tr key={user.id} className="border-b border-[#3a2819] hover:bg-[#3a2819]/50">
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-[#3a2819] flex items-center justify-center mr-3">
                          <User size={16} className="text-gray-300" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs text-gray-400 flex items-center">
                            <Mail size={12} className="mr-1" /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-purple-900/30 text-purple-200' : 'bg-[#3a2819] text-gray-300'
                      }`}>
                        {user.role === 'admin' ? (
                          <span className="flex items-center">
                            <Shield size={12} className="mr-1" /> Admin
                          </span>
                        ) : 'User'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.status === 'active' ? 'bg-green-900/30 text-green-200' : 'bg-red-900/30 text-red-200'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar size={14} className="mr-1" /> {joinedDate}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center text-sm">
                        <ShoppingCart size={14} className="mr-1 text-blue-400" /> {purchaseCount}
                      </div>
                    </td>
                    <td className="p-3 font-medium">
                      ${totalSpent.toFixed(2)}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenUserModal(user)}
                          className="px-3 py-1 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center"
                        >
                          <Edit size={14} className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(user)}
                          className="px-3 py-1 bg-red-900/30 hover:bg-red-900/50 rounded text-sm flex items-center"
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' ? (
                    <span>No users match your filters</span>
                  ) : (
                    <span>No users found</span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2d1e14] rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {selectedUser ? 'Edit User' : 'Add New User'}
            </h2>
            
            <form onSubmit={handleUserFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={selectedUser?.name || ''}
                  className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={selectedUser?.email || ''}
                  className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="role" className="block text-sm font-medium text-white">
                  Role <span className="text-red-400">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  defaultValue={selectedUser?.role || 'user'}
                  className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="status" className="block text-sm font-medium text-white">
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={selectedUser?.status || 'active'}
                  className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {!selectedUser && (
                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full rounded-md bg-[#3a2819] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
                    required={!selectedUser}
                  />
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t border-[#7a4528]/30">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-[#3a2819] text-white hover:bg-[#4a3829] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#c9a52c] text-white hover:bg-[#d9b53c] transition-colors"
                >
                  {selectedUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#2d1e14] rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete the user <span className="text-white font-medium">{selectedUser.name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-[#7a4528]/30">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-md bg-[#3a2819] text-white hover:bg-[#4a3829] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-600 transition-colors flex items-center"
              >
                <Trash2 size={16} className="mr-2" /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
