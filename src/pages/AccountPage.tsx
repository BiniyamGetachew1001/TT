import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Book, BookOpen, Calendar, Check, Clock, Download, Pencil, LayoutGrid } from 'lucide-react';

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'activity' | 'books' | 'plans'>('activity');

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD', // Initials
    membershipType: 'Premium Member',
    subscription: {
      plan: 'Medium Business',
      status: 'Active',
      purchaseDate: 'January 15, 2023'
    }
  };

  // Mock activity data
  const recentActivity = [
    {
      id: 1,
      type: 'read',
      title: 'The Psychology of Money',
      timeAgo: '2 hours ago',
      details: 'You read this book summary for 15 minutes'
    },
    {
      id: 2,
      type: 'viewed',
      title: 'Local Coffee Shop',
      timeAgo: '1 day ago',
      details: 'You viewed this business plan'
    },
    {
      id: 3,
      type: 'saved',
      title: 'Atomic Habits',
      timeAgo: '3 days ago',
      details: 'You saved this book for offline access'
    }
  ];

  // Mock books data
  const myBooks = [
    {
      id: 1,
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      lastRead: '2 hours ago',
      progress: 65,
      coverImage: 'https://images.unsplash.com/photo-1633158829875-e5316a358c6f?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Atomic Habits',
      author: 'James Clear',
      lastRead: '3 days ago',
      progress: 42,
      coverImage: 'https://images.unsplash.com/photo-1592496001020-d31bd830651f?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Zero to One',
      author: 'Peter Thiel',
      lastRead: '1 week ago',
      progress: 100,
      coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=200&auto=format&fit=crop'
    }
  ];

  // Mock plans data
  const myPlans = [
    {
      id: 1,
      title: 'Local Coffee Shop',
      category: 'Small Business',
      lastViewed: '1 day ago',
      coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=200&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'E-commerce Store',
      category: 'Small Business',
      lastViewed: '2 weeks ago',
      coverImage: 'https://images.unsplash.com/photo-1530543787849-128d94430c6b?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Account</h1>
            <p className="text-gray-400">Manage your account and view your activity</p>
          </div>
          <Link to="/settings" className="gold-button mt-4 md:mt-0">Settings</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <div className="bg-[#3a2819] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Profile</h2>
            <div className="flex flex-col items-center mb-4">
              <div className="w-20 h-20 rounded-full bg-[#4a2e1c] flex items-center justify-center text-[#c9a52c] text-xl font-bold mb-3">
                {user.avatar}
              </div>
              <h3 className="text-xl font-bold mb-1">{user.name}</h3>
              <p className="text-gray-400 mb-2">{user.email}</p>
              <div className="bg-[#2d1e14] px-3 py-1 rounded-full text-xs text-[#c9a52c]">
                {user.membershipType}
              </div>
            </div>
            <button className="w-full secondary-button flex items-center justify-center gap-2">
              <Pencil size={16} />
              <span>Pencil Profile</span>
            </button>
          </div>

          {/* Subscription Card */}
          <div className="bg-[#3a2819] rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Subscription</h2>
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Check size={18} className="text-[#c9a52c]" />
                <span className="font-medium">Current Plan</span>
              </div>
              <div className="bg-[#2d1e14] px-3 py-1 rounded-md inline-block mb-2 text-[#c9a52c]">
                Medium Business
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <Check size={18} className="text-[#c9a52c]" />
                <span className="font-medium">Status</span>
              </div>
              <div className="text-green-500 mb-2">Active</div>
              
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={18} className="text-[#c9a52c]" />
                <span className="font-medium">Purchased On</span>
              </div>
              <div className="text-gray-300 mb-2">{user.subscription.purchaseDate}</div>
            </div>
            <button className="w-full secondary-button">Upgrade Plan</button>
          </div>

          {/* Activity Overview Card (for mobile) */}
          <div className="bg-[#3a2819] rounded-xl p-6 md:hidden">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.slice(0, 2).map(activity => (
                <div key={activity.id} className="flex items-start gap-3">
                  {activity.type === 'read' && <BookOpen size={20} className="text-[#c9a52c] mt-1" />}
                  {activity.type === 'viewed' && <LayoutGrid size={20} className="text-[#c9a52c] mt-1" />}
                  {activity.type === 'saved' && <Download size={20} className="text-[#c9a52c] mt-1" />}
                  <div>
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-400">{activity.details}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock size={12} className="mr-1" />
                      <span>{activity.timeAgo}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button 
                className="text-[#c9a52c] text-sm hover:underline"
                onClick={() => setActiveTab('activity')}
              >
                View all activity
              </button>
            </div>
          </div>
        </div>

        {/* Activity Tabs */}
        <div className="bg-[#3a2819] rounded-xl overflow-hidden">
          <div className="bg-[#2d1e14] p-2 flex">
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium flex-1 md:flex-none ${activeTab === 'activity' ? 'bg-[#3a2819] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#4a2e1c]/50'}`}
              onClick={() => setActiveTab('activity')}
            >
              Recent Activity
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium flex-1 md:flex-none ${activeTab === 'books' ? 'bg-[#3a2819] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#4a2e1c]/50'}`}
              onClick={() => setActiveTab('books')}
            >
              My Books
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-sm font-medium flex-1 md:flex-none ${activeTab === 'plans' ? 'bg-[#3a2819] text-[#c9a52c]' : 'text-gray-300 hover:bg-[#4a2e1c]/50'}`}
              onClick={() => setActiveTab('plans')}
            >
              My Plans
            </button>
          </div>

          <div className="p-6">
            {/* Recent Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
                <p className="text-gray-400 mb-6">Your recent interactions with TilkTibeb</p>

                <div className="space-y-6">
                  {recentActivity.map(activity => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2d1e14] flex items-center justify-center">
                        {activity.type === 'read' && <Book size={20} className="text-[#c9a52c]" />}
                        {activity.type === 'viewed' && <LayoutGrid size={20} className="text-[#c9a52c]" />}
                        {activity.type === 'saved' && <Download size={20} className="text-[#c9a52c]" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          {activity.type === 'read' && <span className="font-medium">Read <span className="text-[#c9a52c]">"{activity.title}"</span></span>}
                          {activity.type === 'viewed' && <span className="font-medium">Viewed <span className="text-[#c9a52c]">"{activity.title}" Business Plan</span></span>}
                          {activity.type === 'saved' && <span className="font-medium">Saved <span className="text-[#c9a52c]">"{activity.title}"</span> for Offline Reading</span>}
                        </div>
                        <p className="text-sm text-gray-400 mb-1">{activity.details}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          <span>{activity.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Books Tab */}
            {activeTab === 'books' && (
              <div>
                <h2 className="text-xl font-bold mb-2">My Books</h2>
                <p className="text-gray-400 mb-6">Books you've read or saved</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {myBooks.map(book => (
                    <div key={book.id} className="bg-[#2d1e14] rounded-lg overflow-hidden">
                      <div className="h-32 bg-gray-700 relative">
                        {book.coverImage && (
                          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#2d1e14] to-transparent"></div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{book.author}</p>
                        
                        <div className="mb-2">
                          <div className="text-xs text-gray-400 mb-1">Reading Progress</div>
                          <div className="h-1.5 w-full bg-[#3a2819] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#c9a52c]" 
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{book.progress}%</span>
                            <span>Last read {book.lastRead}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Link to={`/reading/${book.id}`} className="text-sm text-[#c9a52c] hover:underline">
                            {book.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                          </Link>
                          <Link to={`/books/${book.id}`} className="text-sm text-gray-400 hover:text-white">Details</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Plans Tab */}
            {activeTab === 'plans' && (
              <div>
                <h2 className="text-xl font-bold mb-2">My Plans</h2>
                <p className="text-gray-400 mb-6">Business plans you've viewed or saved</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {myPlans.map(plan => (
                    <div key={plan.id} className="bg-[#2d1e14] rounded-lg overflow-hidden">
                      <div className="h-32 bg-gray-700 relative">
                        {plan.coverImage && (
                          <img src={plan.coverImage} alt={plan.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{plan.title}</h3>
                        <div className="mb-3">
                          <span className="text-xs bg-[#3a2819] text-[#c9a52c] py-1 px-2 rounded-md">
                            {plan.category}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            <span>Viewed {plan.lastViewed}</span>
                          </div>
                          <button className="text-sm text-[#c9a52c] hover:underline">
                            View Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
