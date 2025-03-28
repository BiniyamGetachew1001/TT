import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary border-primary' : 'text-gray-400 hover:text-gray-200 border-transparent';
  };

  return (
    <div className="min-h-screen bg-background-dark bg-gradient-radial">
      <header className="fixed top-0 left-0 right-0 bg-surface-dark backdrop-blur-md border-b border-white/5 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold text-primary">
                  TILkTBEB
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/book-summaries"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive('/book-summaries')}`}
                >
                  Book Summaries
                </Link>
                <Link
                  to="/business-plans"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive('/business-plans')}`}
                >
                  Business Plans
                </Link>
                <Link
                  to="/bookmarks"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive('/bookmarks')}`}
                >
                  Bookmarks
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/account"
                className={`inline-flex items-center px-4 py-2 rounded-lg bg-surface-light backdrop-blur-sm border border-white/5 text-sm font-medium transition-all hover:bg-surface-light/80 ${
                  location.pathname === '/account' ? 'text-primary' : 'text-gray-300'
                }`}
              >
                Account
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-surface-dark backdrop-blur-md border-t border-white/5">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/features" className="text-base text-gray-400 hover:text-gray-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-base text-gray-400 hover:text-gray-300">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Content</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/book-summaries" className="text-base text-gray-400 hover:text-gray-300">
                    Book Summaries
                  </Link>
                </li>
                <li>
                  <Link to="/business-plans" className="text-base text-gray-400 hover:text-gray-300">
                    Business Plans
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <Link to="/settings" className="text-base text-gray-400 hover:text-gray-300">
                    Settings
                  </Link>
                </li>
                <li>
                  <Link to="/offline-library" className="text-base text-gray-400 hover:text-gray-300">
                    Offline Library
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-gray-400 hover:text-gray-300">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/5 pt-8">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} TILkTBEB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 