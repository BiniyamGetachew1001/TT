import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to TILkTBEB
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Discover book summaries and business ideas to help you grow and succeed.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/book-summaries"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
            >
              Start Reading
            </Link>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Link
              to="/features"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 md:py-4 md:text-lg md:px-10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Content</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder for featured content */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
              <p className="mt-2 text-sm text-gray-500">
                Featured book summaries and business ideas will appear here.
              </p>
            </div>
          </div>
          {/* Add more placeholder cards as needed */}
        </div>
      </section>
    </div>
  );
};

export default HomePage; 