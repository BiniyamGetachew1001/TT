import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Edit, Trash2, Eye, ShieldCheck, ShieldX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data for users
const mockUsers = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-06-10T10:00:00Z',
    lastLogin: '2023-07-15T14:30:00Z'
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-06-05T09:15:00Z',
    lastLogin: '2023-07-14T11:45:00Z'
  },
  {
    id: 'user3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-05-28T14:20:00Z',
    lastLogin: '2023-06-20T16:10:00Z'
  },
  {
    id: 'user4',
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-05-20T08:30:00Z',
    lastLogin: '2023-07-12T10:20:00Z'
  },
  {
    id: 'user5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    role: 'user',
    status: 'active',
    createdAt: '2023-05-15T11:45:00Z',
    lastLogin: '2023-07-10T13:15:00Z'
  }
];

const UsersPage: React.FC = () => {
  const { supabase } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);

  useEffect(() => {
    // In a real implementation, you would fetch actual data from the API
    // For now, we'll use the mock data
    const fetchUsers = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [supabase]);

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // In a real implementation, you would call the API to delete the user
      // For now, we'll just update the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userToDelete));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesRole = filterRole
      ? user.role === filterRole
      : true;

    const matchesStatus = filterStatus
      ? user.status === filterStatus
      : true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text">Users</h1>
          <p className="text-gray-400">Manage user accounts</p>
        </div>
        <button
          onClick={() => setNewUserModalOpen(true)}
          className="gold-button flex items-center mt-4 sm:mt-0"
        >
          <UserPlus size={18} className="mr-2" />
          Add New User
        </button>
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
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="admin-select"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-select"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-[#4a2e1c] flex items-center justify-center text-[#c9a52c] font-bold mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`admin-badge ${
                        user.role === 'admin' ? 'admin-badge-warning' : 'admin-badge-info'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${
                        user.status === 'active' ? 'admin-badge-success' : 'admin-badge-error'
                      }`}>
                        {user.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{formatDate(user.lastLogin)}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Link
                          to={`/users/view/${user.id}`}
                          className="p-1.5 glass-button text-blue-400 hover:text-blue-300"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/users/edit/${user.id}`}
                          className="p-1.5 glass-button text-[#c9a52c] hover:text-[#d9b53c]"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(user.id)}
                          className="p-1.5 glass-button text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        {user.role === 'admin' ? (
                          <button
                            onClick={() => {
                              // In a real implementation, you would call the API to change the role
                              setUsers(prevUsers =>
                                prevUsers.map(u =>
                                  u.id === user.id ? { ...u, role: 'user' } : u
                                )
                              );
                            }}
                            className="p-1.5 glass-button text-yellow-400 hover:text-yellow-300"
                            title="Remove Admin"
                          >
                            <ShieldX size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              // In a real implementation, you would call the API to change the role
                              setUsers(prevUsers =>
                                prevUsers.map(u =>
                                  u.id === user.id ? { ...u, role: 'admin' } : u
                                )
                              );
                            }}
                            className="p-1.5 glass-button text-green-400 hover:text-green-300"
                            title="Make Admin"
                          >
                            <ShieldCheck size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="secondary-button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {newUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              // In a real implementation, you would call the API to create a new user
              setNewUserModalOpen(false);
            }}>
              <div className="mb-4">
                <label htmlFor="name" className="admin-label">Name</label>
                <input
                  type="text"
                  id="name"
                  className="admin-input"
                  placeholder="Enter name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="admin-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="admin-input"
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="admin-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="admin-input"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="role" className="admin-label">Role</label>
                <select id="role" className="admin-select" defaultValue="user">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setNewUserModalOpen(false)}
                  className="secondary-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-button"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
