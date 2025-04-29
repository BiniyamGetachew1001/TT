import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BusinessPlanForm from '../components/forms/BusinessPlanForm';
import { getBusinessPlanById } from '../services/businessPlanService';
import { BusinessPlan } from '../services/businessPlanService';

const EditBusinessPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessPlan = async () => {
      if (!id) {
        setError('Business plan ID is required');
        setLoading(false);
        return;
      }

      try {
        const plan = await getBusinessPlanById(id);
        setBusinessPlan(plan);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch business plan');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessPlan();
  }, [id]);

  const handleSuccess = () => {
    navigate('/admin/content');
  };

  const handleCancel = () => {
    navigate('/admin/content');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  if (error || !businessPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-4">
          {error || 'Business plan not found'}
        </div>
        <Link 
          to="/admin/content" 
          className="text-gray-400 hover:text-white flex items-center transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Content Management
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Link 
          to="/admin/content" 
          className="text-gray-400 hover:text-white flex items-center transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Content Management
        </Link>
      </div>

      <div className="bg-[#2d1e14] rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6 text-white border-b border-[#7a4528]/30 pb-4">
          Edit Business Plan: {businessPlan.title}
        </h1>

        <BusinessPlanForm 
          businessPlan={businessPlan}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default EditBusinessPlanPage;
