import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Lock } from 'lucide-react';
import { getUserReadingProgress } from '../services/bookSummaryService';
import { getAllBookSummaries } from '../services/bookSummaryService';
import { useBookmarks } from '../contexts/BookmarkContext';
import { BookSummary } from '../lib/supabase';

const BookSummariesPage: React.FC = () => {
  const [summaries, setSummaries] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    const fetchBookSummaries = async () => {
      setLoading(true);
      try {
        const categoryFilter = category !== 'all' ? category : undefined;
        const result = await getAllBookSummaries(categoryFilter);

        if (result.success) {
          let sortedData = [...result.data];

          // Apply sorting
          switch (sortBy) {
            case 'newest':
              sortedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              break;
            case 'oldest':
              sortedData.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              break;
            case 'read_time':
              sortedData.sort((a, b) => {
                const aTime = parseInt(a.read_time?.split(' ')[0] || '0');
                const bTime = parseInt(b.read_time?.split(' ')[0] || '0');
                return aTime - bTime;
              });
              break;
            default:
              break;
          }

          setSummaries(sortedData);
        } else {
          setError(result.message || 'Failed to fetch book summaries');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching book summaries');
      } finally {
        setLoading(false);
      }
    };

    fetchBookSummaries();
  }, [category, sortBy]);

  const handleBookmark = (e: React.MouseEvent, summary: BookSummary) => {
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Book Summaries</h1>
          <div className="flex gap-3">
            <select
              className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="all">All Categories</option>
              <option value="Entrepreneurship">Entrepreneurship</option>
              <option value="Leadership">Leadership</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Personal Development">Personal Development</option>
            </select>
            <select
              className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="read_time">Sort by: Read Time</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.length > 0 ? summaries.map(summary => {
              const progress = getUserReadingProgress(summary.id);
              const bookmarked = isBookmarked(summary.id);
              const isPremium = summary.price > 0;

              return (
                <Link to={`/books/${summary.id}`} key={summary.id} className="bg-[#3a2819] rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-40 overflow-hidden relative">
                    {summary.cover_image && (
                      <img
                        src={summary.cover_image}
                        alt={summary.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
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
                      {isPremium && (
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
                      <span className="text-xs text-gray-400">{summary.read_time}</span>
                      <button className={isPremium ? "secondary-button text-sm py-1.5" : "gold-button text-sm py-1.5"}>
                        {progress > 0 ? "Continue Reading" : isPremium ? "Unlock Summary" : "Read Summary"}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            }) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-400">No book summaries found. Try changing your filters.</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && summaries.length > 0 && (
          <div className="text-center mt-12">
            <button className="secondary-button">Load More</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSummariesPage;
