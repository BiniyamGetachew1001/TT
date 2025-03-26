import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface BookDetail {
  id: string;
  title: string;
  author: string;
  summary: string;
  coverImage: string;
  category: string;
  readTime: string;
  keyPoints: string[];
  fullSummary: string;
  relatedBooks: {
    id: string;
    title: string;
    author: string;
    coverImage: string;
  }[];
}

// Temporary mock data
const mockBookDetail: BookDetail = {
  id: '1',
  title: 'The Psychology of Money',
  author: 'Morgan Housel',
  summary: 'Timeless lessons on wealth, greed, and happiness.',
  coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
  category: 'Personal Finance',
  readTime: '15 min read',
  keyPoints: [
    'Money decisions are driven by personal history and unique experiences',
    'Wealth is what you don\'t see',
    'The role of luck and risk in financial success',
    'The importance of room for error in financial planning',
    'The power of compounding and long-term thinking'
  ],
  fullSummary: `The Psychology of Money explores the complex relationship between money and human behavior. Morgan Housel argues that financial success isn't just about knowledge and skills, but also about understanding the psychological factors that influence our money decisions.

The book presents 19 short stories that illustrate how our unique experiences shape our financial choices. Housel emphasizes that personal finance is deeply personal and that there's no one-size-fits-all approach to managing money.

Key themes include the importance of humility in financial decisions, the role of luck and risk in success, and why we should focus on building wealth rather than displaying it. The book challenges conventional wisdom about money and offers a more nuanced perspective on financial success.`,
  relatedBooks: [
    {
      id: '2',
      title: 'Atomic Habits',
      author: 'James Clear',
      coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: '3',
      title: 'Rich Dad Poor Dad',
      author: 'Robert Kiyosaki',
      coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    },
  ],
};

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const book = mockBookDetail; // In a real app, we would fetch this based on the ID

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Book Header */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-2/3">
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="mt-2 text-xl text-gray-600">{book.author}</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {book.category}
            </span>
            <span className="text-gray-500">{book.readTime}</span>
          </div>
          <p className="mt-4 text-gray-600">{book.summary}</p>
          <div className="mt-6">
            <Link
              to={`/reading/${book.id}`}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Start Reading
            </Link>
          </div>
        </div>
      </div>

      {/* Key Points */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Points</h2>
        <ul className="space-y-3">
          {book.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-6 w-6 text-primary-600">•</span>
              <span className="ml-3 text-gray-600">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Full Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Full Summary</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 whitespace-pre-line">{book.fullSummary}</p>
        </div>
      </div>

      {/* Related Books */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Books</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {book.relatedBooks.map((relatedBook) => (
            <Link
              key={relatedBook.id}
              to={`/book-summaries/${relatedBook.id}`}
              className="flex items-center gap-4 group"
            >
              <img
                src={relatedBook.coverImage}
                alt={relatedBook.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600">
                  {relatedBook.title}
                </h3>
                <p className="text-sm text-gray-500">{relatedBook.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage; 