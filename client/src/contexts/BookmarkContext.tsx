import React, { createContext, useContext, useState, useEffect } from 'react';

interface Bookmark {
  id: string;
  type: 'book' | 'business-plan';
  title: string;
  author?: string;
  coverImage?: string;
  timestamp: number;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'timestamp'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = (bookmark: Omit<Bookmark, 'timestamp'>) => {
    setBookmarks((prev) => {
      // Check if bookmark already exists
      if (prev.some((b) => b.id === bookmark.id)) {
        return prev;
      }
      return [...prev, { ...bookmark, timestamp: Date.now() }];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((bookmark) => bookmark.id === id);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}; 