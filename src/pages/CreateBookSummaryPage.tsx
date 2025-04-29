import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import BookSummaryForm from '../components/forms/BookSummaryForm';

const CreateBookSummaryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/content');
  };

  const handleCancel = () => {
    navigate('/admin/content');
  };

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
          Create New Book Summary
        </h1>

        <BookSummaryForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default CreateBookSummaryPage;
