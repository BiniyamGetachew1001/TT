import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Lock } from 'lucide-react';
import { mockSummaries, getUserReadingProgress } from '../data/mockData';
import { useBookmarks } from '../contexts/BookmarkContext';

const BookSummariesPage: React.FC = () => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const handleBookmark = (e: React.MouseEvent, summary: typeof mockSummaries[0]) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookmarked(summary.id)) {
      removeBookmark(summary.id);
    } else {
      addBookmark({
        id: summary.id,
        title: summary.title,
        type: 'book',
        author: summary.author,
        category: summary.category,
        description: summary.description
      });
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Book Summaries</h1>
          <div className="flex gap-3">
            <select className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]">
              <option>All Categories</option>
              <option>Entrepreneurship</option>
              <option>Leadership</option>
              <option>Marketing</option>
              <option>Finance</option>
              <option>Personal Development</option>
            </select>
            <select className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]">
              <option>Sort by: Newest</option>
              <option>Sort by: Oldest</option>
              <option>Sort by: Most Popular</option>
              <option>Sort by: Read Time</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSummaries.map(summary => {
            const progress = getUserReadingProgress(summary.id);
            const bookmarked = isBookmarked(summary.id);
            
            return (
              <Link to={`/books/${summary.id}`} key={summary.id} className="bg-[#3a2819] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 overflow-hidden relative">
                  {summary.coverImage && (
                    <img 
                      src={summary.coverImage} 
                      alt={summary.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button 
                    onClick={(e) => handleBookmark(e, summary)}
                    className="absolute top-3 right-3 bg-[#2d1e14] bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    {bookmarked ? (
                      <BookmarkCheck size={18} className="text-[#c9a52c]" />
                    ) : (
                      <Bookmark size={18} className="text-white" />
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">{summary.category}</div>
                      <h3 className="text-xl font-bold">{summary.title}</h3>
                      <div className="text-sm text-gray-300 mb-2">by {summary.author}</div>
                    </div>
                    {summary.isPremium && (
                      <div className="text-[#c9a52c] bg-[#2d1e14] p-1.5 rounded-full">
                        <Lock size={16} />
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{summary.description}</p>
                  
                  {progress > 0 && (
                    <div className="mb-4">
                      <div className="h-1 w-full bg-[#2d1e14] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#c9a52c]" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{progress}% completed</div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">{summary.readTime}</span>
                    <button className={summary.isPremium ? "secondary-button text-sm py-1.5" : "gold-button text-sm py-1.5"}>
                      {progress > 0 ? "Continue Reading" : summary.isPremium ? "Unlock Summary" : "Read Summary"}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <button className="secondary-button">Load More</button>
        </div>
      </div>
    </div>
  );
};

export default BookSummariesPage;
