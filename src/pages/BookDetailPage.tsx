import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, BookmarkCheck, Lock, Quote, ShoppingCart } from 'lucide-react';
import { mockSummaries, getUserReadingProgress, setUserReadingProgress } from '../data/mockData';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useAuth } from '../contexts/AuthContext';
import { getMockPurchaseStatus } from '../services/purchaseService';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const bookId = parseInt(id || '0', 10);
  const book = mockSummaries.find(book => book.id === bookId);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isPurchased, setIsPurchased] = useState(false);
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(bookId);

  useEffect(() => {
    if (book) {
      // Get reading progress from localStorage
      const progress = getUserReadingProgress(book.id);
      setReadingProgress(progress);

      // Simulate reading progress
      const timer = setTimeout(() => {
        if (progress < 100) {
          const newProgress = Math.min(progress + 5, 100);
          setReadingProgress(newProgress);
          setUserReadingProgress(book.id, newProgress);
        }
      }, 10000); // Update progress every 10 seconds

      // Check if the user has purchased this book
      if (isAuthenticated && user) {
        // For development, use mock data
        const purchaseStatus = getMockPurchaseStatus('book-summary', `book${book.id}`);
        setIsPurchased(purchaseStatus.purchased);
      }

      return () => clearTimeout(timer);
    }
  }, [book, readingProgress, isAuthenticated, user]);

  const handleBookmark = () => {
    if (!book) return;

    if (bookmarked) {
      removeBookmark(book.id);
    } else {
      addBookmark({
        id: book.id,
        title: book.title,
        type: 'book',
        author: book.author,
        category: book.category,
        description: book.description
      });
    }
  };

  if (!book) {
    return (
      <div className="p-6 md:p-10 text-center">
        <h2 className="text-xl font-bold mb-4">Book not found</h2>
        <Link to="/book-summaries" className="gold-button">
          Return to Book Summaries
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/book-summaries" className="flex items-center text-gray-300 hover:text-white transition-colors mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Back to Book Summaries
          </Link>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-1/3">
              {book.coverImage && (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-400 mb-2">{book.category}</div>
                  <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-300 mb-4">by {book.author}</p>
                </div>

                <button
                  onClick={handleBookmark}
                  className="bg-[#3a2819] p-2 rounded-full hover:bg-[#4a2e1c] transition-colors"
                >
                  {bookmarked ? (
                    <BookmarkCheck size={20} className="text-[#c9a52c]" />
                  ) : (
                    <Bookmark size={20} className="text-white" />
                  )}
                </button>
              </div>

              <p className="text-gray-300 mb-6">{book.description}</p>

              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-1">Reading Progress</div>
                <div className="h-2 w-full bg-[#2d1e14] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#c9a52c] transition-all duration-500 ease-out"
                    style={{ width: `${readingProgress}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-400 mt-1">{readingProgress}% completed • {book.readTime}</div>
              </div>

              <div className="flex flex-wrap gap-3">
                {book.isPremium && !isPurchased ? (
                  <button
                    onClick={() => navigate(`/books/${book.id}/purchase`)}
                    className="gold-button px-8 flex items-center"
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Purchase
                  </button>
                ) : (
                  <Link to={`/reading/${book.id}`} className={book.isPremium ? "secondary-button px-8" : "gold-button px-8"}>
                    {readingProgress > 0 ? "Continue Reading" : "Start Reading"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {book.content && (
          <div className="mt-12">
            <div className="bg-[#3a2819] rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Summary</h2>
              <p className="text-gray-300">{book.content.summary}</p>
            </div>

            <div className="bg-[#3a2819] rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Key Points</h2>
              <ul className="space-y-3">
                {book.content.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="bg-[#c9a52c] text-[#2d1e14] font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#3a2819] rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Chapters</h2>
              <div className="space-y-4">
                {book.content.chapters.map((chapter, index) => (
                  <div key={index} className={book.isPremium && index > 0 ? "opacity-50" : ""}>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">Chapter {index + 1}: {chapter.title}</h3>
                      {book.isPremium && index > 0 && (
                        <Lock size={16} className="text-[#c9a52c]" />
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{chapter.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {book.content.quotes && (
              <div className="bg-[#3a2819] rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4">Notable Quotes</h2>
                <div className="space-y-4">
                  {book.content.quotes.map((quote, index) => (
                    <div key={index} className="flex gap-4">
                      <Quote size={24} className="text-[#c9a52c] flex-shrink-0" />
                      <p className="text-gray-300 italic">{quote}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {book.isPremium && !book.content && (
          <div className="bg-[#3a2819] rounded-xl p-8 text-center mt-12">
            <Lock size={48} className="text-[#c9a52c] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium Content</h2>
            <p className="text-gray-300 mb-6">
              Unlock this premium book summary to access the full content, including key insights,
              chapter summaries, and notable quotes.
            </p>
            <Link to="/pricing" className="gold-button">
              Upgrade to Premium
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;
