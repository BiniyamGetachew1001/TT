import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, BookOpen, LayoutGrid, Trash } from 'lucide-react';
import { useBookmarks } from '../contexts/BookmarkContext';

const BookmarksPage: React.FC = () => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [filter, setFilter] = useState<'all' | 'book' | 'business-plan'>('all');
  
  const filteredBookmarks = filter === 'all' 
    ? bookmarks 
    : bookmarks.filter(bookmark => bookmark.type === filter);
  
  const bookCount = bookmarks.filter(b => b.type === 'book').length;
  const planCount = bookmarks.filter(b => b.type === 'business-plan').length;
  
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Your Bookmarks</h1>
          <div className="bg-[#3a2819] p-1 rounded-lg flex">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'all' ? 'bg-[#2d1e14] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#4a2e1c]'}`}
              onClick={() => setFilter('all')}
            >
              All ({bookmarks.length})
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'book' ? 'bg-[#2d1e14] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#4a2e1c]'}`}
              onClick={() => setFilter('book')}
            >
              Books ({bookCount})
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${filter === 'business-plan' ? 'bg-[#2d1e14] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#4a2e1c]'}`}
              onClick={() => setFilter('business-plan')}
            >
              Business Plans ({planCount})
            </button>
          </div>
        </div>
        
        {filteredBookmarks.length === 0 ? (
          <div className="bg-[#3a2819] rounded-xl p-8 text-center">
            <BookOpen size={48} className="text-[#c9a52c] mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No bookmarks yet</h2>
            <p className="text-gray-300 mb-6">
              {filter === 'all' 
                ? "You haven't bookmarked any content yet." 
                : filter === 'book' 
                  ? "You haven't bookmarked any books yet." 
                  : "You haven't bookmarked any business plans yet."}
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/book-summaries" className="gold-button">
                Browse Book Summaries
              </Link>
              <Link to="/business-plans" className="secondary-button">
                Browse Business Plans
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map(bookmark => (
              <div key={bookmark.id} className="bg-[#3a2819] rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#2d1e14] p-3 rounded-lg text-[#c9a52c]">
                      {bookmark.type === 'book' ? <Book size={24} /> : <LayoutGrid size={24} />}
                    </div>
                    <button
                      onClick={() => removeBookmark(bookmark.id)}
                      className="text-gray-400 hover:text-white bg-[#2d1e14] p-2 rounded-full hover:bg-[#4a2e1c] transition-colors"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{bookmark.title}</h3>
                  
                  {bookmark.author && (
                    <p className="text-sm text-gray-300 mb-2">by {bookmark.author}</p>
                  )}
                  
                  {bookmark.category && (
                    <div className="mb-3">
                      <span className="text-xs bg-[#2d1e14] text-[#c9a52c] py-1 px-2 rounded-md">
                        {bookmark.category}
                      </span>
                    </div>
                  )}
                  
                  {bookmark.description && (
                    <p className="text-gray-300 text-sm mb-4">{bookmark.description}</p>
                  )}
                  
                  {bookmark.type === 'book' ? (
                    <Link 
                      to={`/books/${bookmark.id}`}
                      className="gold-button block text-center"
                    >
                      View Book Summary
                    </Link>
                  ) : (
                    <button className="secondary-button w-full">
                      View Business Plan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
