import React, { useState } from 'react';
import { BellRing, Book, ChevronRight, Eye, EyeOff, Moon, Palette, Settings, User } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'reading'>('profile');
  const [firstName, setFirstName] = useState('John');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Appearance settings
  const [darkMode, setDarkMode] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [theme, setTheme] = useState('default');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newSummaries, setNewSummaries] = useState(true);
  const [newBusinessPlans, setNewBusinessPlans] = useState(true);
  const [promotions, setPromotions] = useState(false);
  
  // Reading settings
  const [autoSave, setAutoSave] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [readingMode, setReadingMode] = useState('scroll');

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Profile information saved!');
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Handle password update
    alert('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-300 mb-6">Manage your account settings and preferences</p>
        
        {/* Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Profile</span>
            </div>
          </button>
          <button 
            className={`tab-button ${activeTab === 'appearance' ? 'active' : ''}`}
            onClick={() => setActiveTab('appearance')}
          >
            <div className="flex items-center gap-2">
              <Palette size={16} />
              <span>Appearance</span>
            </div>
          </button>
          <button 
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <div className="flex items-center gap-2">
              <BellRing size={16} />
              <span>Notifications</span>
            </div>
          </button>
          <button 
            className={`tab-button ${activeTab === 'reading' ? 'active' : ''}`}
            onClick={() => setActiveTab('reading')}
          >
            <div className="flex items-center gap-2">
              <Book size={16} />
              <span>Reading</span>
            </div>
          </button>
        </div>
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="settings-card">
              <h2 className="text-xl font-bold mb-2">Personal Information</h2>
              <p className="text-gray-300 text-sm mb-4">Update your personal details</p>
              
              <form onSubmit={handleSubmitProfile}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="glass-input w-full p-2 rounded-md input-glow"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="glass-input w-full p-2 rounded-md input-glow"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full p-2 rounded-md input-glow"
                  />
                </div>
                
                <button type="submit" className="gold-button px-4 py-2">
                  Save Changes
                </button>
              </form>
            </div>
            
            {/* Password */}
            <div className="settings-card">
              <h2 className="text-xl font-bold mb-2">Password</h2>
              <p className="text-gray-300 text-sm mb-4">Change your password</p>
              
              <form onSubmit={handlePasswordUpdate}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">Current Password</label>
                  <div className="relative">
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      id="currentPassword" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="glass-input w-full p-2 rounded-md pr-10 input-glow"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1">New Password</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      id="newPassword" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="glass-input w-full p-2 rounded-md pr-10 input-glow"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      id="confirmPassword" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="glass-input w-full p-2 rounded-md pr-10 input-glow"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 px-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <button type="submit" className="gold-button px-4 py-2">
                  Update Password
                </button>
              </form>
            </div>
          </div>
        )}
        
        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="settings-card">
            <h2 className="text-xl font-bold mb-6">Appearance</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Theme</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  className={`glass-button px-4 py-2 rounded-md flex items-center gap-2 ${theme === 'default' ? 'ring-2 ring-[#c9a52c]' : ''}`}
                  onClick={() => setTheme('default')}
                >
                  <Moon size={18} className="text-[#c9a52c]" />
                  <span>Dark Brown (Default)</span>
                </button>
                <button 
                  className={`glass-button px-4 py-2 rounded-md flex items-center gap-2 ${theme === 'dark' ? 'ring-2 ring-[#c9a52c]' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={18} className="text-[#c9a52c]" />
                  <span>Dark</span>
                </button>
                <button 
                  className={`glass-button px-4 py-2 rounded-md flex items-center gap-2 ${theme === 'sepia' ? 'ring-2 ring-[#c9a52c]' : ''}`}
                  onClick={() => setTheme('sepia')}
                >
                  <Settings size={18} className="text-[#c9a52c]" />
                  <span>Sepia</span>
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Dark Mode</h3>
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                  <div className="relative w-11 h-6 bg-[#3a2819] rounded-full peer peer-checked:bg-[#c9a52c] peer-focus:ring-2 peer-focus:ring-[#c9a52c] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                  <span className="ml-3 text-sm font-medium">
                    {darkMode ? 'On' : 'Off'}
                  </span>
                </label>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Font Size</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  className={`glass-button px-4 py-2 rounded-md ${fontSize === 'small' ? 'ring-2 ring-[#c9a52c]' : ''}`}
                  onClick={() => setFontSize('small')}
                >
                  Small
                </button>
                <button 
                  className={`glass-button px-4 py-2 rounded-md ${fontSize === 'medium' ? 'ring-2 ring-[#c9a52c]' : ''}`}
                  onClick={() => setFontSize('medium')}
                >
                  Medium
                </button>
                <button 
                  className={`glass-button px-4 py-2 rounded-md ${fontSize === 'large' ? 'ring-2 ring-[#c9a52c]' : ''}`}
                  onClick={() => setFontSize('large')}
                >
                  Large
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="settings-card">
            <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
              <div className="flex items-center mb-4">
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <div className="relative w-11 h-6 bg-[#3a2819] rounded-full peer peer-checked:bg-[#c9a52c] peer-focus:ring-2 peer-focus:ring-[#c9a52c] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                  <span className="ml-3 text-sm font-medium">
                    Receive email notifications
                  </span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 glass-button rounded-md">
                <div className="flex items-center gap-3">
                  <BellRing size={20} className="text-[#c9a52c]" />
                  <div>
                    <h4 className="font-medium">New Book Summaries</h4>
                    <p className="text-sm text-gray-400">Get notified when new summaries are available</p>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={newSummaries}
                    onChange={() => setNewSummaries(!newSummaries)}
                    disabled={!emailNotifications}
                  />
                  <div className={`relative w-11 h-6 rounded-full peer ${!emailNotifications ? 'bg-[#2d1e14] opacity-50' : 'bg-[#3a2819] peer-checked:bg-[#c9a52c]'} peer-focus:ring-2 peer-focus:ring-[#c9a52c] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5`}></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 glass-button rounded-md">
                <div className="flex items-center gap-3">
                  <BellRing size={20} className="text-[#c9a52c]" />
                  <div>
                    <h4 className="font-medium">New Business Plans</h4>
                    <p className="text-sm text-gray-400">Get notified when new business plans are added</p>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={newBusinessPlans}
                    onChange={() => setNewBusinessPlans(!newBusinessPlans)}
                    disabled={!emailNotifications}
                  />
                  <div className={`relative w-11 h-6 rounded-full peer ${!emailNotifications ? 'bg-[#2d1e14] opacity-50' : 'bg-[#3a2819] peer-checked:bg-[#c9a52c]'} peer-focus:ring-2 peer-focus:ring-[#c9a52c] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5`}></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 glass-button rounded-md">
                <div className="flex items-center gap-3">
                  <BellRing size={20} className="text-[#c9a52c]" />
                  <div>
                    <h4 className="font-medium">Promotions & Offers</h4>
                    <p className="text-sm text-gray-400">Receive special offers and promotional updates</p>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={promotions}
                    onChange={() => setPromotions(!promotions)}
                    disabled={!emailNotifications}
                  />
                  <div className={`relative w-11 h-6 rounded-full peer ${!emailNotifications ? 'bg-[#2d1e14] opacity-50' : 'bg-[#3a2819] peer-checked:bg-[#c9a52c]'} peer-focus:ring-2 peer-focus:ring-[#c9a52c] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5`}></div>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Reading Tab */}
        {activeTab === 'reading' && (
          <div className="settings-card">
            <h2 className="text-xl font-bold mb-6">Reading Preferences</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Reading Mode</h3>
              <div className="flex flex-wrap gap-4">
                <button 
                  className={`glass-button px-4 py-2 rounded-md flex items-center gap-2 ${readingMode === 'scroll' ? 'ring-2 ring-[#c9a52c]' : ''}`}
                  onClick={() => setReadingMode('scroll')}
                >
                  <ChevronRight size={18} className="text-[#c9a52c]" />
                  <span>Scrolling</span>
                </button>
                <button 
                  className={`glass-button px-4 py-2 rounded-md flex items-center gap-2 ${readingMode === 'paginated' ? 'ring-2 ring-[#c9a52c]' : ''}`}
                  onClick={() => setReadingMode('paginated')}
                >
                  <Book size={18} className="text-[#c9a52c]" />
                  <span>Paginated</span>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 glass-button rounded-md">
                <div className="flex items-center gap-3">
                  <Book size={20} className="text-[#c9a52c]" />
                  <div>
                    <h4 className="font-medium">Auto-Save Reading Progress</h4>
                    <p className="text-sm text-gray-400">Automatically save your reading position</p>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={autoSave}
                    onChange={() => setAutoSave(!autoSave)}
                  />
                  <div className="relative w-11 h-6 bg-[#3a2819] rounded-full peer peer-checked:bg-[#c9a52c] peer-focus:ring-2 peer-focus:ring-[#c9a52c] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 glass-button rounded-md">
                <div className="flex items-center gap-3">
                  <Book size={20} className="text-[#c9a52c]" />
                  <div>
                    <h4 className="font-medium">Show Progress Bar</h4>
                    <p className="text-sm text-gray-400">Display reading progress at the top of the page</p>
                  </div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={showProgressBar}
                    onChange={() => setShowProgressBar(!showProgressBar)}
                  />
                  <div className="relative w-11 h-6 bg-[#3a2819] rounded-full peer peer-checked:bg-[#c9a52c] peer-focus:ring-2 peer-focus:ring-[#c9a52c] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
