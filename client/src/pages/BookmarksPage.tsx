import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../contexts/BookmarkContext';

const BookmarksPage: React.FC = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  if (bookmarks.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Bookmarks</h1>
        <p className="text-xl text-gray-600 mb-8">
          You haven't bookmarked any content yet.
        </p>
        <Link
          to="/book-summaries"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Bookmarks</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {bookmark.coverImage && (
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={bookmark.coverImage}
                  alt={bookmark.title}
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {bookmark.title}
                  </h3>
                  {bookmark.author && (
                    <p className="text-sm text-gray-500">{bookmark.author}</p>
                  )}
                </div>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-4">
                <Link
                  to={
                    bookmark.type === 'book'
                      ? `/book-summaries/${bookmark.id}`
                      : `/business-plans/${bookmark.id}`
                  }
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View {bookmark.type === 'book' ? 'Summary' : 'Plan'} →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookmarksPage; 