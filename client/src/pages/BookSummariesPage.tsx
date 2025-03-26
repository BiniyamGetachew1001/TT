import React from 'react';
import { Link } from 'react-router-dom';

interface BookSummary {
  id: string;
  title: string;
  author: string;
  summary: string;
  coverImage: string;
  category: string;
  readTime: string;
}

// Temporary mock data
const mockBooks: BookSummary[] = [
  {
    id: '1',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    summary: 'Timeless lessons on wealth, greed, and happiness.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Personal Finance',
    readTime: '15 min read',
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    summary: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    category: 'Self Development',
    readTime: '20 min read',
  },
  // Add more mock books as needed
];

const BookSummariesPage: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Book Summaries
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Discover key insights from the best books in business, personal development, and more.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">All Categories</option>
          <option value="business">Business</option>
          <option value="personal-development">Personal Development</option>
          <option value="finance">Finance</option>
        </select>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockBooks.map((book) => (
          <Link
            key={book.id}
            to={`/book-summaries/${book.id}`}
            className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={book.coverImage}
                alt={book.title}
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary-600">
                  {book.category}
                </span>
                <span className="text-sm text-gray-500">{book.readTime}</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                {book.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{book.author}</p>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{book.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BookSummariesPage; 