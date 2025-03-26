import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarkContext';

interface BusinessPlan {
  id: string;
  title: string;
  industry: string;
  description: string;
  coverImage: string;
  author: string;
  readTime: string;
  price: number;
}

// Temporary mock data
const mockBusinessPlans: BusinessPlan[] = [
  {
    id: '1',
    title: 'E-commerce Platform Business Plan',
    industry: 'Technology',
    description: 'A comprehensive business plan for launching an e-commerce platform, including market analysis, financial projections, and growth strategies.',
    coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2088&q=80',
    author: 'Business Strategy Experts',
    readTime: '15 min read',
    price: 29.99
  },
  {
    id: '2',
    title: 'Restaurant Business Plan',
    industry: 'Food & Beverage',
    description: 'Detailed business plan for opening a restaurant, covering location analysis, menu planning, staffing, and financial forecasts.',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    author: 'Restaurant Consultants',
    readTime: '20 min read',
    price: 34.99
  },
  {
    id: '3',
    title: 'Fitness Center Business Plan',
    industry: 'Health & Wellness',
    description: 'Complete business plan for a modern fitness center, including equipment planning, membership structures, and marketing strategies.',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    author: 'Fitness Industry Experts',
    readTime: '18 min read',
    price: 39.99
  }
];

const BusinessPlansPage: React.FC = () => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Plans</h1>
        <div className="flex gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Industries</option>
            <option value="technology">Technology</option>
            <option value="food">Food & Beverage</option>
            <option value="health">Health & Wellness</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBusinessPlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={plan.coverImage}
                alt={plan.title}
                className="w-full h-48 object-cover"
              />
              <button
                onClick={() => isBookmarked(plan.id) ? removeBookmark(plan.id) : addBookmark({
                  id: plan.id,
                  type: 'business-plan',
                  title: plan.title,
                  author: plan.author,
                  coverImage: plan.coverImage,
                  timestamp: new Date().toISOString()
                })}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
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
            <div className="p-4">
              <span className="inline-block px-2 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-2">
                {plan.industry}
              </span>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{plan.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <span>{plan.author}</span>
                  <span className="mx-2">•</span>
                  <span>{plan.readTime}</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">${plan.price}</span>
              </div>
              <Link
                to={`/business-plans/${plan.id}`}
                className="mt-4 block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Plan
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessPlansPage; 