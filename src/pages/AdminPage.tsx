import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Book, BookOpen, FileText, Users, ShoppingCart, Settings, BarChart3, Plus } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('dashboard');

  // Check if user is authorized to access admin panel
  if (user?.email !== 'biniyam.getachew@aastustudent.edu.et') {
    return <Navigate to="/" replace />;
  }

  // Render different content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'blog-posts':
        return <BlogPostsSection />;
      case 'book-summaries':
        return <BookSummariesSection />;
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
    <div className="flex h-screen bg-[#2d1e14] text-white overflow-hidden">
      {/* Admin Sidebar */}
      <div className="w-64 h-full bg-[#1a140d] border-r border-[#4a2e1c] flex flex-col">
        <div className="p-4 border-b border-[#4a2e1c] flex items-center gap-2">
          <Book className="text-[#c9a52c]" size={24} />
          <h1 className="text-xl font-bold text-white">TilkTibeb Admin</h1>
        </div>

        <nav className="flex-grow p-3 overflow-y-auto">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`w-full flex items-center gap-3 py-3 px-4 text-left rounded-md ${activeSection === 'dashboard' ? 'bg-[#4a2e1c] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#3a2819] hover:text-white'}`}
          >
            <BarChart3 size={20} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveSection('blog-posts')}
            className={`w-full flex items-center gap-3 py-3 px-4 text-left rounded-md ${activeSection === 'blog-posts' ? 'bg-[#4a2e1c] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#3a2819] hover:text-white'}`}
          >
            <FileText size={20} />
            <span>Blog Posts</span>
          </button>

          <button
            onClick={() => setActiveSection('book-summaries')}
            className={`w-full flex items-center gap-3 py-3 px-4 text-left rounded-md ${activeSection === 'book-summaries' ? 'bg-[#4a2e1c] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#3a2819] hover:text-white'}`}
          >
            <BookOpen size={20} />
            <span>Book Summaries</span>
          </button>

          <button
            onClick={() => setActiveSection('users')}
            className={`w-full flex items-center gap-3 py-3 px-4 text-left rounded-md ${activeSection === 'users' ? 'bg-[#4a2e1c] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#3a2819] hover:text-white'}`}
          >
            <Users size={20} />
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveSection('purchases')}
            className={`w-full flex items-center gap-3 py-3 px-4 text-left rounded-md ${activeSection === 'purchases' ? 'bg-[#4a2e1c] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#3a2819] hover:text-white'}`}
          >
            <ShoppingCart size={20} />
            <span>Purchases</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`w-full flex items-center gap-3 py-3 px-4 text-left rounded-md ${activeSection === 'settings' ? 'bg-[#4a2e1c] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#3a2819] hover:text-white'}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-[#4a2e1c]">
          <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white">
            <span>Back to Site</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-6">
        {renderContent()}
      </div>
    </div>
  );
};

// Dashboard Section
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
              <h3 className="text-2xl font-bold mt-1">0</h3>
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
              <h3 className="text-2xl font-bold mt-1">0</h3>
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
              <h3 className="text-2xl font-bold mt-1">0</h3>
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
              <h3 className="text-2xl font-bold mt-1">0</h3>
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

// Blog Posts Section
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

// Book Summaries Section
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

// Users Section
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

// Purchases Section
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

// Settings Section
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
              value="TilkTibeb"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Site Description</label>
            <textarea
              className="w-full bg-[#2d1e14] border border-[#4a2e1c] rounded-md px-4 py-2 text-white"
              rows={3}
              value="Premium business book summaries and business plans"
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

export default AdminPage;
