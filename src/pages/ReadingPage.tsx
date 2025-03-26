import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Book, Bookmark, BookmarkCheck, ChevronDown, ChevronLeft, ChevronUp, CircleMinus, CirclePlus, Headphones, Highlighter, Maximize2, MessageSquare, Moon, Settings, Share, Sun } from 'lucide-react';
import { mockSummaries, getUserReadingProgress, setUserReadingProgress } from '../data/mockData';
import { useBookmarks } from '../contexts/BookmarkContext';

const ReadingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const bookId = parseInt(id || '0', 10);
  const book = mockSummaries.find(book => book.id === bookId);
  
  const [readingProgress, setReadingProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [darkMode, setDarkMode] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState<'summary' | 'insights' | 'applications'>('insights');
  const [isTracking, setIsTracking] = useState(false);
  const [averageSpeed, setAverageSpeed] = useState<string>('N/A');
  const [bestSpeed, setBestSpeed] = useState<string>('N/A');
  
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = book ? isBookmarked(bookId) : false;
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (book) {
      // Get reading progress from localStorage
      const progress = getUserReadingProgress(book.id);
      setReadingProgress(progress);
      
      // Setup scroll listener to track reading progress
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        
        const totalScroll = docHeight - windowHeight;
        const currentScroll = Math.min(100, Math.ceil((scrollTop / totalScroll) * 100));
        
        if (currentScroll > readingProgress) {
          setReadingProgress(currentScroll);
          setUserReadingProgress(book.id, currentScroll);
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [book, readingProgress]);
  
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
  
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const startTracking = () => {
    setIsTracking(true);
    // In a real app, this would start a timer and track how many words are read
    // For this demo, we'll just simulate it with a timeout
    setTimeout(() => {
      setAverageSpeed('210');
      setBestSpeed('240');
      setIsTracking(false);
    }, 3000);
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
    <div className="min-h-screen bg-[#2d1e14]">
      {/* Top navigation */}
      <div className="bg-[#2d1e14] border-b border-[#4a2e1c]/30 py-4 px-6 flex items-center justify-between">
        <Link to={`/books/${book.id}`} className="flex items-center text-gray-300 hover:text-white transition-colors">
          <ChevronLeft size={20} className="mr-1" />
          <span>Back to Books</span>
        </Link>
        <div className="flex items-center">
          <span className="flex items-center text-green-500 text-xs mr-4">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            Online
          </span>
          <button className="p-2 rounded-full bg-[#3a2819] hover:bg-[#4a2e1c] transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Left column - Book info and tools */}
        <div className="w-full md:w-[320px] p-6 border-r border-[#4a2e1c]/30">
          {/* Book cover and info */}
          <div className="mb-6">
            <div className="w-36 h-48 bg-gray-800 rounded-lg mx-auto mb-4 overflow-hidden">
              {book.coverImage ? (
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#3a2819]">
                  <Book size={40} className="text-[#c9a52c]" />
                </div>
              )}
            </div>
            
            <h1 className="text-xl font-bold mb-1 text-center">{book.title}</h1>
            <p className="text-gray-300 text-center mb-1">{book.author}</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#c9a52c]">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm ml-1">4.4</span>
              </div>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-300">{book.readTime || '242 pages'}</span>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-300">English</span>
            </div>
            
            <div className="flex justify-center gap-2 mt-4">
              <button 
                onClick={handleBookmark}
                className="flex items-center gap-1 bg-[#3a2819] hover:bg-[#4a2e1c] text-white py-2 px-4 rounded-md text-sm transition-colors"
              >
                {bookmarked ? <BookmarkCheck size={16} className="text-[#c9a52c]" /> : <Bookmark size={16} />}
                <span>Bookmark</span>
              </button>
              <button className="flex items-center gap-1 bg-[#3a2819] hover:bg-[#4a2e1c] text-white py-2 px-4 rounded-md text-sm transition-colors">
                <Share size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
          
          {/* Reading Speed Tracker */}
          <div className="glass-card p-4 mb-6">
            <h3 className="text-lg font-bold mb-2">Reading Speed Tracker</h3>
            <p className="text-sm text-gray-300 mb-4">Track your reading speed to improve comprehension and efficiency</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-xl font-bold mb-1">{averageSpeed}</div>
                <div className="text-xs text-gray-400">Average Speed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold mb-1">{bestSpeed}</div>
                <div className="text-xs text-gray-400">Best Speed</div>
              </div>
            </div>
            
            <button 
              onClick={startTracking}
              disabled={isTracking}
              className="w-full bg-[#c9a52c] hover:bg-[#b89225] text-[#2d1e14] font-medium py-2 rounded-md transition-all disabled:opacity-70"
            >
              {isTracking ? "Tracking..." : "Start Tracking"}
            </button>
          </div>
          
          {/* Similar Content */}
          <div className="glass-card p-4">
            <h3 className="text-lg font-bold mb-2">Similar Content</h3>
            <p className="text-sm text-gray-300 mb-4">You might also like these</p>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Book size={20} className="mt-1" />
                </div>
                <div>
                  <h4 className="font-medium">Atomic Habits</h4>
                  <p className="text-xs text-gray-400">By James Clear</p>
                  <div className="flex items-center mt-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-[#c9a52c]">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs ml-1">4.9</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Book size={20} className="mt-1" />
                </div>
                <div>
                  <h4 className="font-medium">Sapiens</h4>
                  <p className="text-xs text-gray-400">By Yuval Noah Harari</p>
                  <div className="flex items-center mt-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-[#c9a52c]">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs ml-1">4.7</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <Book size={20} className="mt-1" />
                </div>
                <div>
                  <h4 className="font-medium">Zero to One</h4>
                  <p className="text-xs text-gray-400">By Peter Thiel</p>
                  <div className="flex items-center mt-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-[#c9a52c]">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs ml-1">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 p-6">
          {/* Reading tools */}
          <div className="flex justify-between mb-6">
            <div className="flex bg-[#3a2819] rounded-md">
              <button 
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${currentTab === 'summary' ? 'bg-[#2d1e14]' : ''}`}
                onClick={() => setCurrentTab('summary')}
              >
                <Book size={18} />
                <span>Reading</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md">
                <Headphones size={18} />
                <span>Learning Tools</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md">
                <MessageSquare size={18} />
                <span>Quiz</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-[#3a2819] rounded-full p-1">
                <button 
                  onClick={() => setFontSize('small')} 
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${fontSize === 'small' ? 'bg-[#2d1e14] text-[#c9a52c]' : ''}`}
                >
                  S
                </button>
                <button 
                  onClick={() => setFontSize('medium')} 
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${fontSize === 'medium' ? 'bg-[#2d1e14] text-[#c9a52c]' : ''}`}
                >
                  M
                </button>
                <button 
                  onClick={() => setFontSize('large')} 
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${fontSize === 'large' ? 'bg-[#2d1e14] text-[#c9a52c]' : ''}`}
                >
                  L
                </button>
              </div>
              
              <button className="p-2 bg-[#3a2819] rounded-md hover:bg-[#4a2e1c] transition-colors">
                <Highlighter size={18} />
              </button>
              
              <button className="p-2 bg-[#3a2819] rounded-md hover:bg-[#4a2e1c] transition-colors">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
          
          {/* Content tabs */}
          <div className="mb-6 border-b border-[#4a2e1c]/30">
            <div className="flex">
              <button
                className={`px-6 py-3 border-b-2 ${currentTab === 'summary' ? 'border-[#c9a52c] text-[#c9a52c]' : 'border-transparent text-gray-400'}`}
                onClick={() => setCurrentTab('summary')}
              >
                Summary
              </button>
              <button
                className={`px-6 py-3 border-b-2 ${currentTab === 'insights' ? 'border-[#c9a52c] text-[#c9a52c]' : 'border-transparent text-gray-400'}`}
                onClick={() => setCurrentTab('insights')}
              >
                Key Insights
              </button>
              <button
                className={`px-6 py-3 border-b-2 ${currentTab === 'applications' ? 'border-[#c9a52c] text-[#c9a52c]' : 'border-transparent text-gray-400'}`}
                onClick={() => setCurrentTab('applications')}
              >
                Applications
              </button>
            </div>
          </div>
          
          {/* Main content */}
          <div className={`reading-content font-size-${fontSize} max-w-3xl`}>
            {currentTab === 'summary' && book.content && (
              <div>
                <h2 className="text-2xl font-bold mb-4">{book.title} - Summary</h2>
                <p className="mb-4">{book.content.summary}</p>
                
                {book.content.chapters.map((chapter, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
                    <p>{chapter.content}</p>
                  </div>
                ))}
              </div>
            )}
            
            {currentTab === 'insights' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">The Psychology of Money</h2>
                  <p className="text-gray-300 mb-4">
                    The Psychology of Money explores how money moves around in an economy and how people behave with it. The author, Morgan Housel, provides timeless lessons on wealth, greed, and happiness.
                  </p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Key Insights:</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">1. Financial success is not a hard science</h4>
                      <p className="text-gray-300">
                        It's a soft skill where how you behave is more important than what you know. Financial outcomes are driven by luck, independent of intelligence and effort.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">2. No one is crazy with money</h4>
                      <p className="text-gray-300">
                        People make financial decisions based on their unique experiences, their own personal history, unique worldview, ego, pride, marketing, and odd incentives.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">3. Luck and risk are siblings</h4>
                      <p className="text-gray-300">
                        They are both the reality that every outcome in life is guided by forces other than individual effort. They both happen because the world is too complex to allow 100% of your actions to dictate 100% of your outcomes.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold mb-2">4. Never enough</h4>
                      <p className="text-gray-300">
                        When rich people do crazy things, it's often a case of trying to feel valued after already having more money than they know what to do with.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {currentTab === 'applications' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Practical Applications</h2>
                
                <div className="space-y-6">
                  <div className="glass-card p-4">
                    <h3 className="text-xl font-bold mb-2">Personal Finance Strategies</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Build a financial buffer for unexpected events</li>
                      <li>Focus on reasonable saving rates that you can maintain</li>
                      <li>Avoid lifestyle inflation as your income grows</li>
                      <li>Understand your own psychological biases when investing</li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-4">
                    <h3 className="text-xl font-bold mb-2">Investment Principles</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Prioritize long-term investments over short-term gains</li>
                      <li>Accept that some outcomes are driven by luck, not skill</li>
                      <li>Recognize that past performance doesn't guarantee future results</li>
                      <li>Diversify to manage risk appropriately for your situation</li>
                    </ul>
                  </div>
                  
                  <div className="glass-card p-4">
                    <h3 className="text-xl font-bold mb-2">Wealth Building Mindset</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Define your own version of "enough" and what wealth means to you</li>
                      <li>Understand that financial freedom provides time and options</li>
                      <li>Balance enjoying today with planning for tomorrow</li>
                      <li>Learn from history while adapting to current circumstances</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Text-to-Speech controls */}
          <div className="mt-8 bg-[#3a2819]/70 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium">Text-to-Speech</h3>
              <button className="p-1 hover:bg-[#2d1e14] rounded-full transition-colors">
                <Settings size={16} />
              </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <button 
                  className="p-2 hover:bg-[#2d1e14] rounded-full transition-colors"
                  onClick={() => {/* Skip backward logic */}}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="19 20 9 12 19 4 19 20"></polygon>
                    <line x1="5" y1="19" x2="5" y2="5"></line>
                  </svg>
                </button>
                
                <button 
                  className="p-3 bg-[#c9a52c] hover:bg-[#b89225] text-[#2d1e14] rounded-full transition-colors"
                  onClick={togglePlayback}
                >
                  {isPlaying ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="4" width="4" height="16"></rect>
                      <rect x="14" y="4" width="4" height="16"></rect>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  )}
                </button>
                
                <button 
                  className="p-2 hover:bg-[#2d1e14] rounded-full transition-colors"
                  onClick={() => {/* Skip forward logic */}}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 4 15 12 5 20 5 4"></polygon>
                    <line x1="19" y1="5" x2="19" y2="19"></line>
                  </svg>
                </button>
              </div>
              
              <div className="w-full flex items-center gap-2">
                <span className="text-xs text-gray-400">0:00</span>
                <div className="flex-grow h-2 bg-[#2d1e14] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#c9a52c]" 
                    style={{ width: `${isPlaying ? 30 : 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400">10:30</span>
              </div>
            </div>
            
            {/* Hidden audio element for text-to-speech */}
            <audio ref={audioRef} className="hidden">
              <source src="#" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingPage;
