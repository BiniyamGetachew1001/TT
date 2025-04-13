import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Book, BookOpen, FileText, Users, ShoppingCart, Settings, BarChart3, Plus, Menu, X, LogOut, User, ChevronDown, Bell, Home, CreditCard, Briefcase, Layout, Image, Tag, Edit, Trash2, CheckCircle } from 'lucide-react';

// Simple Dashboard Section
const DashboardSection: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold gold-text mb-4">Dashboard</h1>
      <p className="text-gray-400 mb-6">Welcome to the TilkTibeb admin dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">124</h3>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <Users size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Book Summaries</p>
              <h3 className="text-2xl font-bold mt-1">45</h3>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <BookOpen size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Blog Posts</p>
              <h3 className="text-2xl font-bold mt-1">28</h3>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <FileText size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>

        <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Purchases</p>
              <h3 className="text-2xl font-bold mt-1">67</h3>
            </div>
            <div className="p-3 rounded-lg bg-[#2d1e14]">
              <ShoppingCart size={24} className="text-[#c9a52c]" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c] mb-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <p className="text-gray-400">No recent activity to display.</p>
      </div>
    </div>
  );
};

// Simple Blog Posts Section
const BlogPostsSection: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text mb-1">Blog Posts</h1>
          <p className="text-gray-400">Manage your blog posts</p>
        </div>
        <button className="bg-[#c9a52c] text-[#1a140d] px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:bg-[#d9b53c]">
          <Plus size={18} />
          <span>Add New Post</span>
        </button>
      </div>

      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
        <p className="text-gray-400">No blog posts found. Create your first post!</p>
      </div>
    </div>
  );
};

// Simple Book Summaries Section
const BookSummariesSection: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text mb-1">Book Summaries</h1>
          <p className="text-gray-400">Manage your book summaries</p>
        </div>
        <button className="bg-[#c9a52c] text-[#1a140d] px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:bg-[#d9b53c]">
          <Plus size={18} />
          <span>Add New Summary</span>
        </button>
      </div>

      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
        <p className="text-gray-400">No book summaries found. Create your first summary!</p>
      </div>
    </div>
  );
};

// Simple Users Section
const UsersSection: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text mb-1">Users</h1>
          <p className="text-gray-400">Manage user accounts</p>
        </div>
        <button className="bg-[#c9a52c] text-[#1a140d] px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:bg-[#d9b53c]">
          <Plus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
        <p className="text-gray-400">No users found.</p>
      </div>
    </div>
  );
};

// Simple Purchases Section
const PurchasesSection: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text mb-1">Purchases</h1>
          <p className="text-gray-400">Manage user purchases</p>
        </div>
      </div>

      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
        <p className="text-gray-400">No purchases found.</p>
      </div>
    </div>
  );
};

// Home Content Section
const HomeContentSection: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text mb-1">Home Page Content</h1>
          <p className="text-gray-400">Manage your home page content and layout</p>
        </div>
      </div>

      {/* Hero Section Management */}
      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c] mb-6">
        <h2 className="text-xl font-bold mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Headline</label>
            <input
              type="text"
              className="w-full bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
              defaultValue="Premium Book Summaries for Business Leaders"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Subheadline</label>
            <input
              type="text"
              className="w-full bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
              defaultValue="Get the key insights from top business books in minutes"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Background Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
                defaultValue="https://example.com/hero-image.jpg"
              />
              <button className="bg-[#3a2819] px-4 py-2 rounded-md hover:bg-[#4a2e1c]">
                <Image size={18} />
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-[#c9a52c] text-[#1a140d] px-4 py-2 rounded-md font-medium hover:bg-[#d9b53c]">
              Save Hero Section
            </button>
          </div>
        </div>
      </div>

      {/* Featured Content */}
      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Featured Content</h2>
          <button className="bg-[#3a2819] text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#4a2e1c]">
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-[#2d1e14] p-4 rounded-lg border border-[#3a2819] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#3a2819] rounded-md flex items-center justify-center">
                <BookOpen size={24} className="text-[#c9a52c]" />
              </div>
              <div>
                <p className="font-medium">The Lean Startup</p>
                <p className="text-sm text-gray-400">Featured Book Summary</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Edit size={16} className="text-gray-400 hover:text-white" />
              </button>
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>

          <div className="bg-[#2d1e14] p-4 rounded-lg border border-[#3a2819] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#3a2819] rounded-md flex items-center justify-center">
                <FileText size={24} className="text-[#c9a52c]" />
              </div>
              <div>
                <p className="font-medium">10 Business Tips for 2023</p>
                <p className="text-sm text-gray-400">Featured Blog Post</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Edit size={16} className="text-gray-400 hover:text-white" />
              </button>
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
        <h2 className="text-xl font-bold mb-4">Promotional Banner</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Banner Text</label>
            <input
              type="text"
              className="w-full bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
              defaultValue="Get 20% off all book summaries this month!"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Button Text</label>
            <input
              type="text"
              className="w-full bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
              defaultValue="Shop Now"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Button Link</label>
            <input
              type="text"
              className="w-full bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
              defaultValue="/book-summaries"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="enable-banner" className="rounded-sm bg-[#1a140d] border-[#4a2e1c] text-[#c9a52c]" defaultChecked />
            <label htmlFor="enable-banner" className="text-gray-400">Enable promotional banner</label>
          </div>
          <div className="flex justify-end">
            <button className="bg-[#c9a52c] text-[#1a140d] px-4 py-2 rounded-md font-medium hover:bg-[#d9b53c]">
              Save Banner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Business Plans Section
const BusinessPlansSection: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold gold-text mb-1">Business Plans</h1>
          <p className="text-gray-400">Manage your business plan templates and categories</p>
        </div>
        <button className="bg-[#c9a52c] text-[#1a140d] px-4 py-2 rounded-md flex items-center gap-2 font-medium hover:bg-[#d9b53c]">
          <Plus size={18} />
          <span>Add Business Plan</span>
        </button>
      </div>

      {/* Categories */}
      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c] mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Categories</h2>
          <button className="bg-[#3a2819] text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-[#4a2e1c]">
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#2d1e14] p-4 rounded-lg border border-[#3a2819] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3a2819] rounded-md flex items-center justify-center">
                <Tag size={18} className="text-[#c9a52c]" />
              </div>
              <div>
                <p className="font-medium">Startup</p>
                <p className="text-sm text-gray-400">12 plans</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Edit size={16} className="text-gray-400 hover:text-white" />
              </button>
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>

          <div className="bg-[#2d1e14] p-4 rounded-lg border border-[#3a2819] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3a2819] rounded-md flex items-center justify-center">
                <Tag size={18} className="text-[#c9a52c]" />
              </div>
              <div>
                <p className="font-medium">E-commerce</p>
                <p className="text-sm text-gray-400">8 plans</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Edit size={16} className="text-gray-400 hover:text-white" />
              </button>
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>

          <div className="bg-[#2d1e14] p-4 rounded-lg border border-[#3a2819] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3a2819] rounded-md flex items-center justify-center">
                <Tag size={18} className="text-[#c9a52c]" />
              </div>
              <div>
                <p className="font-medium">Service Business</p>
                <p className="text-sm text-gray-400">10 plans</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Edit size={16} className="text-gray-400 hover:text-white" />
              </button>
              <button className="p-1 hover:bg-[#3a2819] rounded-md">
                <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Plans List */}
      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Business Plans</h2>
          <div className="flex items-center gap-2">
            <select className="bg-[#2d1e14] border border-[#4a2e1c] rounded-md text-white px-3 py-1 focus:outline-none focus:border-[#c9a52c]">
              <option value="all">All Categories</option>
              <option value="startup">Startup</option>
              <option value="ecommerce">E-commerce</option>
              <option value="service">Service Business</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#4a2e1c]">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4 hidden md:table-cell">Category</th>
                <th className="text-left py-3 px-4 hidden lg:table-cell">Last Updated</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#2d1e14] hover:bg-[#2d1e14]">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium">Coffee Shop Business Plan</p>
                    <p className="text-sm text-gray-400 hidden md:block">Complete business plan for starting a coffee shop...</p>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <span className="px-2 py-1 bg-[#2d1e14] rounded-md text-xs">Service Business</span>
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">2023-09-01</td>
                <td className="py-4 px-4">
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle size={14} />
                    <span>Published</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 hover:bg-[#3a2819] rounded-md">
                      <Edit size={16} className="text-gray-400 hover:text-white" />
                    </button>
                    <button className="p-1 hover:bg-[#3a2819] rounded-md">
                      <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>

              <tr className="border-b border-[#2d1e14] hover:bg-[#2d1e14]">
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium">Tech Startup Business Plan</p>
                    <p className="text-sm text-gray-400 hidden md:block">Comprehensive business plan for a technology startup...</p>
                  </div>
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <span className="px-2 py-1 bg-[#2d1e14] rounded-md text-xs">Startup</span>
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">2023-08-15</td>
                <td className="py-4 px-4">
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle size={14} />
                    <span>Published</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1 hover:bg-[#3a2819] rounded-md">
                      <Edit size={16} className="text-gray-400 hover:text-white" />
                    </button>
                    <button className="p-1 hover:bg-[#3a2819] rounded-md">
                      <Trash2 size={16} className="text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Simple Settings Section
const SettingsSection: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold gold-text mb-4">Settings</h1>
      <p className="text-gray-400 mb-6">Configure your application settings</p>

      <div className="bg-[#1a140d] p-6 rounded-lg border border-[#4a2e1c]">
        <h2 className="text-xl font-bold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Site Name</label>
            <input
              type="text"
              className="w-full bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
              defaultValue="TilkTibeb"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Site Description</label>
            <textarea
              className="w-full bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
              rows={3}
              defaultValue="Premium business book summaries and business plans"
            />
          </div>
          <button className="bg-[#c9a52c] text-[#1a140d] px-4 py-2 rounded-md font-medium hover:bg-[#d9b53c]">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Admin Page Component
const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  // Define the main sections of the site that need to be managed
  const mainSections = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart3 size={20} /> },
    { id: 'home-content', name: 'Home Page', icon: <Home size={20} /> },
    { id: 'book-summaries', name: 'Book Summaries', icon: <BookOpen size={20} /> },
    { id: 'business-plans', name: 'Business Plans', icon: <Briefcase size={20} /> },
    { id: 'blog-posts', name: 'Blog', icon: <FileText size={20} /> },
    { id: 'purchases', name: 'Purchases', icon: <CreditCard size={20} /> },
    { id: 'users', name: 'Users', icon: <Users size={20} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={20} /> }
  ];
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  // Check if user is authorized to access admin panel
  if (user?.email !== 'biniyam.getachew@aastustudent.edu.et') {
    return <Navigate to="/" replace />;
  }

  // Render different content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'home-content':
        return <HomeContentSection />;
      case 'blog-posts':
        return <BlogPostsSection />;
      case 'book-summaries':
        return <BookSummariesSection />;
      case 'business-plans':
        return <BusinessPlansSection />;
      case 'users':
        return <UsersSection />;
      case 'purchases':
        return <PurchasesSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#2d1e14] text-white overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-[#1a140d] border-b border-[#4a2e1c] p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-[#3a2819]"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          <div className="flex items-center gap-2">
            <Book className="text-[#c9a52c]" size={24} />
            <h1 className="text-xl font-bold text-white">TilkTibeb Admin</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#3a2819] relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-[#3a2819]"
            >
              <div className="w-8 h-8 rounded-full bg-[#4a2e1c] flex items-center justify-center">
                <User size={16} className="text-[#c9a52c]" />
              </div>
              <span className="hidden md:block">{user?.email?.split('@')[0]}</span>
              <ChevronDown size={16} />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a140d] border border-[#4a2e1c] rounded-md shadow-lg z-10">
                <div className="p-3 border-b border-[#4a2e1c]">
                  <p className="font-medium">{user?.email?.split('@')[0]}</p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => setActiveSection('settings')}
                    className="w-full flex items-center gap-2 p-2 text-left hover:bg-[#3a2819] rounded-md"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 p-2 text-left hover:bg-[#3a2819] rounded-md text-red-400 hover:text-red-300"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Admin Sidebar */}
        <div className={`${isMobile ? 'fixed z-20 h-full' : 'w-64 h-full'} ${isSidebarOpen ? 'block' : 'hidden'} bg-[#1a140d] border-r border-[#4a2e1c] flex flex-col`}>
          <nav className="flex-grow p-3 overflow-y-auto space-y-1">
            {mainSections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 py-3 px-4 text-left rounded-md ${activeSection === section.id ? 'bg-[#4a2e1c] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#3a2819] hover:text-white'}`}
              >
                {section.icon}
                <span>{section.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[#4a2e1c]">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <span>Back to Site</span>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </div>

        {/* Mobile overlay */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
