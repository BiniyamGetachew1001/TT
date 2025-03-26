import React, { useState } from 'react';
import { Download, Info, EllipsisVertical, Play, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';

const OfflineLibraryPage: React.FC = () => {
  const [storageUsed, setStorageUsed] = useState(42); // percentage

  // Mock data for downloaded books
  const downloadedBooks = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Personal Development',
      size: '2.4 MB',
      downloadedDate: '3 days ago',
      coverImage: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      category: 'Finance',
      size: '1.8 MB',
      downloadedDate: '1 week ago',
      coverImage: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Zero to One',
      author: 'Peter Thiel',
      category: 'Startups',
      size: '2.1 MB',
      downloadedDate: '2 weeks ago',
      coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop'
    }
  ];

  // Mock data for download queue
  const downloadQueue = [
    {
      id: 4,
      title: 'Think and Grow Rich',
      author: 'Napoleon Hill',
      progress: 65,
      size: '2.2 MB',
      coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 5,
      title: 'Good to Great',
      author: 'Jim Collins',
      progress: 30,
      size: '2.8 MB',
      coverImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=200&auto=format&fit=crop'
    }
  ];

  const deleteDownload = (id: number) => {
    // In a real app, this would delete the download and free up storage
    alert(`Book with ID ${id} would be deleted`);
    
    // Simulate reduction in storage
    setStorageUsed(Math.max(0, storageUsed - 10));
  };

  const cancelDownload = (id: number) => {
    // In a real app, this would cancel an in-progress download
    alert(`Download for book with ID ${id} would be canceled`);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Offline Library</h1>
            <p className="text-gray-400">Access your downloaded books without internet</p>
          </div>
          
          <div className="bg-[#3a2819] rounded-md p-3 flex items-center">
            <div className="mr-4">
              <div className="text-sm mb-1">Storage Used</div>
              <div className="h-2 w-36 bg-[#2d1e14] rounded-full overflow-hidden">
                <div 
                  className={`h-full ${storageUsed > 80 ? 'bg-red-500' : 'bg-[#c9a52c]'}`} 
                  style={{ width: `${storageUsed}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>{storageUsed}%</span>
                <span>200MB / 500MB</span>
              </div>
            </div>
            <button className="text-[#c9a52c]">
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* Downloaded Books */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Downloaded Books</h2>
          
          {downloadedBooks.length === 0 ? (
            <div className="bg-[#3a2819] rounded-xl p-8 text-center">
              <Download size={48} className="text-[#c9a52c] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No downloaded books</h3>
              <p className="text-gray-300 mb-6">
                Download books to read them offline without internet connection.
              </p>
              <Link to="/book-summaries" className="gold-button">
                Browse Book Summaries
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {downloadedBooks.map(book => (
                <div key={book.id} className="bg-[#3a2819] rounded-lg overflow-hidden flex">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-700 flex-shrink-0">
                    {book.coverImage && (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-semibold mb-1">{book.title}</h3>
                        <div className="relative group">
                          <button className="p-1 rounded-full hover:bg-[#2d1e14]">
                            <EllipsisVertical size={16} />
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-36 bg-[#2d1e14] rounded-md shadow-lg hidden group-hover:block z-10">
                            <button 
                              className="w-full text-left px-3 py-2 hover:bg-[#4a2e1c] text-sm flex items-center"
                              onClick={() => deleteDownload(book.id)}
                            >
                              <Trash size={14} className="mr-2" />
                              Delete download
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">{book.author}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs bg-[#2d1e14] text-[#c9a52c] py-0.5 px-2 rounded-md">
                          {book.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Download size={12} className="mr-1" />
                        <span>{book.size} • Downloaded {book.downloadedDate}</span>
                      </div>
                      <Link 
                        to={`/reading/${book.id}`}
                        className="bg-[#c9a52c] hover:bg-[#b89225] text-[#2d1e14] font-medium p-2 rounded-md transition-all flex items-center"
                      >
                        <Play size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Download Queue */}
        {downloadQueue.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Download Queue</h2>
            <div className="space-y-4">
              {downloadQueue.map(book => (
                <div key={book.id} className="bg-[#3a2819] rounded-lg overflow-hidden flex">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-700 flex-shrink-0">
                    {book.coverImage && (
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-semibold mb-1">{book.title}</h3>
                        <button 
                          className="text-gray-400 hover:text-white"
                          onClick={() => cancelDownload(book.id)}
                        >
                          Cancel
                        </button>
                      </div>
                      <p className="text-sm text-gray-400">{book.author}</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Downloading... {book.progress}%</span>
                        <span>{book.size}</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#2d1e14] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#c9a52c]" 
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineLibraryPage;
