import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Book, 
  LayoutGrid, 
  Users, 
  ShoppingCart, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();
  
  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);
  
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
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex h-screen">
      {/* Menu button - visible on all screen sizes */}
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
          <h1 className="text-xl font-bold text-white">TilkTibeb Admin</h1>
        </div>
        
        <div className="p-4 border-b border-[#4a2e1c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4a2e1c] flex items-center justify-center text-[#c9a52c] font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-grow p-3 overflow-y-auto">
          <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2 ml-2">Dashboard</h2>
          <Link to="/dashboard" className={`sidebar-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </Link>
          
          <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2 ml-2 mt-6">Content</h2>
          <Link to="/blog-posts" className={`sidebar-item ${isActive('/blog-posts') ? 'active' : ''}`}>
            <FileText size={20} />
            <span>Blog Posts</span>
          </Link>
          <Link to="/book-summaries" className={`sidebar-item ${isActive('/book-summaries') ? 'active' : ''}`}>
            <Book size={20} />
            <span>Book Summaries</span>
          </Link>
          <Link to="/business-plans" className={`sidebar-item ${isActive('/business-plans') ? 'active' : ''}`}>
            <LayoutGrid size={20} />
            <span>Business Plans</span>
          </Link>
          
          <h2 className="text-xs uppercase text-gray-400 font-semibold mb-2 ml-2 mt-6">Management</h2>
          <Link to="/users" className={`sidebar-item ${isActive('/users') ? 'active' : ''}`}>
            <Users size={20} />
            <span>Users</span>
          </Link>
          <Link to="/purchases" className={`sidebar-item ${isActive('/purchases') ? 'active' : ''}`}>
            <ShoppingCart size={20} />
            <span>Purchases</span>
          </Link>
          <Link to="/settings" className={`sidebar-item ${isActive('/settings') ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>
        
        <div className="p-3 mt-auto border-t border-[#4a2e1c]">
          <Link to="/" className="sidebar-item">
            <Home size={20} />
            <span>View Site</span>
          </Link>
          <button onClick={handleLogout} className="sidebar-item w-full text-left">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={`flex-grow h-screen overflow-y-auto main-gradient transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <div className="flex flex-col min-h-full">
          <div className="flex-grow p-6">
            {children}
          </div>
          <footer className="p-4 text-center text-sm text-gray-400 border-t border-[#4a2e1c]">
            <p>© {new Date().getFullYear()} TilkTibeb Admin Panel. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
