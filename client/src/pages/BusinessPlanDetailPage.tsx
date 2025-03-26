import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarkContext';

interface BusinessPlanDetail {
  id: string;
  title: string;
  industry: string;
  description: string;
  coverImage: string;
  author: string;
  readTime: string;
  price: number;
  sections: {
    title: string;
    content: string;
  }[];
  keyFeatures: string[];
  relatedPlans: {
    id: string;
    title: string;
    industry: string;
    coverImage: string;
    price: number;
  }[];
}

// Temporary mock data
const mockBusinessPlan: BusinessPlanDetail = {
  id: '1',
  title: 'E-commerce Platform Business Plan',
  industry: 'Technology',
  description: 'A comprehensive business plan for launching an e-commerce platform, including market analysis, financial projections, and growth strategies.',
  coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80',
  author: 'Business Strategy Experts',
  readTime: '15 min read',
  price: 29.99,
  sections: [
    {
      title: 'Executive Summary',
      content: 'This business plan outlines the strategy for launching a new e-commerce platform that will connect buyers and sellers in a user-friendly marketplace. The platform will focus on providing a seamless shopping experience with advanced features like AI-powered recommendations and secure payment processing.'
    },
    {
      title: 'Market Analysis',
      content: 'The e-commerce market continues to grow at an unprecedented rate, with global sales expected to reach $6.3 trillion by 2024. Our target market includes tech-savvy consumers aged 25-45 who value convenience and variety in their shopping experience.'
    },
    {
      title: 'Financial Projections',
      content: 'Initial investment requirements include platform development, marketing, and operational costs. We project break-even within 18 months and significant revenue growth in years 2-5 through commission fees and premium features.'
    }
  ],
  keyFeatures: [
    'AI-powered product recommendations',
    'Secure payment processing',
    'Mobile-first design',
    'Advanced analytics dashboard',
    'Multi-vendor support'
  ],
  relatedPlans: [
    {
      id: '2',
      title: 'Restaurant Business Plan',
      industry: 'Food & Beverage',
      coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      price: 34.99
    },
    {
      id: '3',
      title: 'Fitness Center Business Plan',
      industry: 'Health & Wellness',
      coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      price: 39.99
    }
  ]
};

const BusinessPlanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const plan = mockBusinessPlan; // In a real app, fetch based on id

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64">
            <img
              src={plan.coverImage}
              alt={plan.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => isBookmarked(plan.id) ? removeBookmark(plan.id) : addBookmark({
                id: plan.id,
                type: 'business-plan',
                title: plan.title,
                author: plan.author,
                coverImage: plan.coverImage
              })}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <svg
                className={`w-6 h-6 ${isBookmarked(plan.id) ? 'text-red-500 fill-current' : 'text-gray-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                {plan.industry}
              </span>
              <span className="text-2xl font-bold text-blue-600">${plan.price}</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{plan.title}</h1>
            <div className="flex items-center text-gray-600 mb-6">
              <span>{plan.author}</span>
              <span className="mx-2">•</span>
              <span>{plan.readTime}</span>
            </div>

            <p className="text-gray-700 mb-8">{plan.description}</p>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Sections</h2>
              {plan.sections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-gray-700">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Business Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plan.relatedPlans.map((relatedPlan) => (
                  <Link
                    key={relatedPlan.id}
                    to={`/business-plans/${relatedPlan.id}`}
                    className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={relatedPlan.coverImage}
                      alt={relatedPlan.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                        {relatedPlan.industry}
                      </span>
                      <h3 className="font-semibold text-gray-900 mb-2">{relatedPlan.title}</h3>
                      <span className="text-lg font-semibold text-blue-600">${relatedPlan.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Purchase Business Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanDetailPage; 