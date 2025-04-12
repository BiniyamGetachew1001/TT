import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data for business plans
const mockBusinessPlans = [
  {
    id: '1',
    title: 'E-commerce Business Plan',
    industry: 'Retail',
    description: 'A comprehensive business plan for starting an e-commerce store',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=300&h=400',
    author: 'John Smith',
    readTime: '25 min read',
    price: 29.99,
    createdAt: '2023-06-18T10:00:00Z',
    updatedAt: '2023-06-22T14:30:00Z'
  },
  {
    id: '2',
    title: 'SaaS Business Plan',
    industry: 'Technology',
    description: 'A detailed plan for launching a Software as a Service business',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&h=400',
    author: 'Jane Doe',
    readTime: '30 min read',
    price: 29.99,
    createdAt: '2023-06-15T09:15:00Z',
    updatedAt: '2023-06-20T11:45:00Z'
  },
  {
    id: '3',
    title: 'Restaurant Business Plan',
    industry: 'Food & Beverage',
    description: 'A complete business plan for opening a restaurant',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&h=400',
    author: 'Michael Johnson',
    readTime: '28 min read',
    price: 29.99,
    createdAt: '2023-06-10T14:20:00Z',
    updatedAt: '2023-06-18T16:10:00Z'
  },
  {
    id: '4',
    title: 'Consulting Business Plan',
    industry: 'Professional Services',
    description: 'A strategic plan for starting a consulting business',
    coverImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&h=400',
    author: 'Sarah Williams',
    readTime: '22 min read',
    price: 29.99,
    createdAt: '2023-06-05T08:30:00Z',
    updatedAt: '2023-06-12T10:20:00Z'
  },
  {
    id: '5',
    title: 'Mobile App Business Plan',
    industry: 'Technology',
    description: 'A business plan for developing and launching a mobile application',
    coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=300&h=400',
    author: 'David Brown',
    readTime: '26 min read',
    price: 29.99,
    createdAt: '2023-05-28T11:45:00Z',
    updatedAt: '2023-06-08T13:15:00Z'
  }
];

const BusinessPlansPage: React.FC = () => {
  const { supabase } = useAuth();
  const [businessPlans, setBusinessPlans] = useState(mockBusinessPlans);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    // In a real implementation, you would fetch actual data from the API
    // For now, we'll use the mock data
    const fetchBusinessPlans = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBusinessPlans(mockBusinessPlans);
      } catch (error) {
        console.error('Error fetching business plans:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessPlans();
  }, [supabase]);
  
  const handleDeleteClick = (id: string) => {
    setPlanToDelete(id);
    setDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    
    try {
      // In a real implementation, you would call the API to delete the plan
      // For now, we'll just update the local state
      setBusinessPlans(prevPlans => prevPlans.filter(plan => plan.id !== planToDelete));
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    } catch (error) {
      console.error('Error deleting business plan:', error);
    }
  };
  
  // Filter business plans based on search term and industry
  const filteredPlans = businessPlans.filter(plan => {
    const matchesSearch = searchTerm
      ? plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.author.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    const matchesIndustry = filterIndustry
      ? plan.industry === filterIndustry
      : true;
    
    return matchesSearch && matchesIndustry;
  });
  
  // Get unique industries for filter dropdown
  const industries = [...new Set(businessPlans.map(plan => plan.industry))];
  
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
          <h1 className="text-3xl font-bold gold-text">Business Plans</h1>
          <p className="text-gray-400">Manage your business plan content</p>
        </div>
        <Link to="/business-plans/new" className="gold-button flex items-center mt-4 sm:mt-0">
          <Plus size={18} className="mr-2" />
          Add New Plan
        </Link>
      </div>
      
      {/* Filters */}
      <div className="admin-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          
          <select
            value={filterIndustry}
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="admin-select"
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Business Plans List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Author</th>
                <th>Industry</th>
                <th>Price</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.length > 0 ? (
                filteredPlans.map(plan => (
                  <tr key={plan.id}>
                    <td className="flex items-center">
                      <img
                        src={plan.coverImage}
                        alt={plan.title}
                        className="w-12 h-16 object-cover rounded mr-3"
                      />
                      <div>
                        <div className="font-medium">{plan.title}</div>
                        <div className="text-sm text-gray-400">{plan.readTime}</div>
                      </div>
                    </td>
                    <td>{plan.author}</td>
                    <td>
                      <span className="admin-badge admin-badge-warning">
                        {plan.industry}
                      </span>
                    </td>
                    <td>${plan.price.toFixed(2)}</td>
                    <td>{formatDate(plan.updatedAt)}</td>
                    <td>
                      <div className="flex space-x-2">
                        <Link
                          to={`/business-plans/view/${plan.id}`}
                          className="p-1.5 glass-button text-blue-400 hover:text-blue-300"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          to={`/business-plans/edit/${plan.id}`}
                          className="p-1.5 glass-button text-[#c9a52c] hover:text-[#d9b53c]"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(plan.id)}
                          className="p-1.5 glass-button text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <Link
                          to={`/business-plans/pricing/${plan.id}`}
                          className="p-1.5 glass-button text-green-400 hover:text-green-300"
                          title="Set Price"
                        >
                          <DollarSign size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    No business plans found
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
              Are you sure you want to delete this business plan? This action cannot be undone.
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
    </div>
  );
};

export default BusinessPlansPage;
