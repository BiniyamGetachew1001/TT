import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Bookmark, CreditCard, Download, House, LayoutGrid, LogOut, Menu, Moon, Settings, User, X, FileText, ShoppingCart, Shield, Database } from 'lucide-react';
import SearchBar from './SearchBar';
import { useBookmarks } from '../contexts/BookmarkContext';
import { useAuth } from '../contexts/AuthContext';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { bookmarks } = useBookmarks();
  const { user, isAdmin, logout } = useAuth();
  const bookmarkCount = bookmarks.length;

  useEffect(() => {
    // Include required font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    // Set sidebar to closed on mobile when route changes
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Menu button - now visible on all screen sizes */}
      <button
        className="fixed top-4 left-4 z-50 text-white glass-button p-1 rounded-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:absolute w-64 h-full glass-navbar border-r border-[#4a2e1c] flex flex-col z-40 transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 border-b border-[#4a2e1c] flex items-center gap-2">
          <Book className="text-[#c9a52c]" size={24} />
          <h1 className="text-xl font-bold text-white">TilkTibeb</h1>
        </div>

        <div className="p-3">
          <SearchBar />
        </div>

        <nav className="flex-grow p-3">
          <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2 ml-2">MAIN</h2>
          <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
            <House size={20} />
            <span>Home</span>
          </Link>
          <Link to="/purchases" className={`sidebar-item ${isActive('/purchases') ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            <span>My Purchases</span>
          </Link>
          <Link to="/book-summaries" className={`sidebar-item ${isActive('/book-summaries') ? 'active' : ''}`}>
            <Book size={20} />
            <span>Book Summaries</span>
          </Link>
          <Link to="/business-plans" className={`sidebar-item ${isActive('/business-plans') ? 'active' : ''}`}>
            <LayoutGrid size={20} />
            <span>Business Plans</span>
          </Link>
          <Link to="/blog" className={`sidebar-item ${isActive('/blog') ? 'active' : ''}`}>
            <FileText size={20} />
            <span>Blog</span>
          </Link>
          <Link to="/bookmarks" className={`sidebar-item ${isActive('/bookmarks') ? 'active' : ''}`}>
            <Bookmark size={20} />
            <span>Bookmarks</span>
            {bookmarkCount > 0 && (
              <span className="ml-auto bg-[#c9a52c] text-[#2d1e14] text-xs font-medium rounded-full px-2 py-0.5">
                {bookmarkCount}
              </span>
            )}
          </Link>
          <Link to="/offline-library" className={`sidebar-item ${isActive('/offline-library') ? 'active' : ''}`}>
            <Download size={20} />
            <span>Offline Library</span>
          </Link>

          {isAdmin && (
            <>
              <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2 ml-2 mt-6">ADMIN</h2>
              <Link to="/admin" className={`sidebar-item ${isActive('/admin') ? 'active' : ''}`}>
                <Shield size={20} />
                <span>Admin Dashboard</span>
              </Link>
              <Link to="/admin/content" className={`sidebar-item ${isActive('/admin/content') ? 'active' : ''}`}>
                <Database size={20} />
                <span>Content Management</span>
              </Link>
            </>
          )}

          <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2 ml-2 mt-6">ACCOUNT</h2>
          <Link to="/account" className={`sidebar-item ${isActive('/account') ? 'active' : ''}`}>
            <User size={20} />
            <span>Account</span>
          </Link>
          <Link to="/pricing" className={`sidebar-item ${isActive('/pricing') ? 'active' : ''}`}>
            <CreditCard size={20} />
            <span>Pricing</span>
          </Link>
          <Link to="/settings" className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>

        </nav>

        <div className="p-3 mt-auto">
          <div className="flex flex-col gap-2">
            <Link to="#" className="sidebar-item">
              <Moon size={20} />
              <span>Dark Mode</span>
            </Link>
            {user && (
              <button
                onClick={async () => {
                  await logout();
                  window.location.href = '/';
                }}
                className="sidebar-item text-left"
              >
                <LogOut size={20} />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-grow h-screen overflow-y-auto main-gradient transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <div className="flex flex-col min-h-full">
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;
