import React, { useState } from 'react';
import { ActivityLog as ActivityLogType } from '../../lib/supabase';
// import { getRecentActivityLogs } from '../../services/activityLogService';
import { Clock, FileText, Book, ShoppingCart, Plus, Edit, Trash2, Archive, Calendar, CheckCircle } from 'lucide-react';

interface ActivityLogProps {
  limit?: number;
  className?: string;
}

/**
 * Activity Log component
 *
 * Displays a list of recent activities in the system
 */
const ActivityLog: React.FC<ActivityLogProps> = ({ limit = 10, className = '' }) => {
  // Mock activities for now until the database table is created
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Sample mock data
  const activities: ActivityLogType[] = [
    {
      id: '1',
      user_email: 'admin@example.com',
      action: 'create',
      item_type: 'blog-post',
      item_id: '123',
      item_title: 'Getting Started with React',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString() // 5 minutes ago
    },
    {
      id: '2',
      user_email: 'admin@example.com',
      action: 'update',
      item_type: 'book-summary',
      item_id: '456',
      item_title: 'The Lean Startup',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
    },
    {
      id: '3',
      user_email: 'admin@example.com',
      action: 'delete',
      item_type: 'business-plan',
      item_id: '789',
      item_title: 'Coffee Shop Business Plan',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
      id: '4',
      user_email: 'admin@example.com',
      action: 'publish',
      item_type: 'blog-post',
      item_id: '101',
      item_title: 'Top 10 Marketing Strategies',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
    },
    {
      id: '5',
      user_email: 'admin@example.com',
      action: 'schedule',
      item_type: 'blog-post',
      item_id: '102',
      item_title: 'Future of AI in Business',
      details: 'Scheduled for tomorrow at 9:00 AM',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
    }
  ].slice(0, limit);

  // Helper function to get icon for item type
  const getItemTypeIcon = (itemType: ActivityLogType['item_type']) => {
    switch (itemType) {
      case 'blog-post':
        return <FileText size={16} className="text-blue-400" />;
      case 'book-summary':
        return <Book size={16} className="text-green-400" />;
      case 'business-plan':
        return <FileText size={16} className="text-yellow-400" />;
      case 'purchase':
        return <ShoppingCart size={16} className="text-purple-400" />;
      default:
        return <FileText size={16} className="text-gray-400" />;
    }
  };

  // Helper function to get icon for action
  const getActionIcon = (action: ActivityLogType['action']) => {
    switch (action) {
      case 'create':
        return <Plus size={16} className="text-green-400" />;
      case 'update':
        return <Edit size={16} className="text-blue-400" />;
      case 'delete':
        return <Trash2 size={16} className="text-red-400" />;
      case 'publish':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'archive':
        return <Archive size={16} className="text-gray-400" />;
      case 'schedule':
        return <Calendar size={16} className="text-yellow-400" />;
      default:
        return <Edit size={16} className="text-gray-400" />;
    }
  };

  // Helper function to format activity message
  const formatActivityMessage = (activity: ActivityLogType) => {
    const { action, item_type, item_title, user_email } = activity;
    const itemTypeFormatted = item_type.replace('-', ' ');
    const userDisplay = user_email || 'A user';

    switch (action) {
      case 'create':
        return (
          <>
            <span className="font-medium">{userDisplay}</span> created a new {itemTypeFormatted}
            {item_title && <span className="font-medium"> "{item_title}"</span>}
          </>
        );
      case 'update':
        return (
          <>
            <span className="font-medium">{userDisplay}</span> updated {itemTypeFormatted}
            {item_title && <span className="font-medium"> "{item_title}"</span>}
          </>
        );
      case 'delete':
        return (
          <>
            <span className="font-medium">{userDisplay}</span> deleted {itemTypeFormatted}
            {item_title && <span className="font-medium"> "{item_title}"</span>}
          </>
        );
      case 'publish':
        return (
          <>
            <span className="font-medium">{userDisplay}</span> published {itemTypeFormatted}
            {item_title && <span className="font-medium"> "{item_title}"</span>}
          </>
        );
      case 'archive':
        return (
          <>
            <span className="font-medium">{userDisplay}</span> archived {itemTypeFormatted}
            {item_title && <span className="font-medium"> "{item_title}"</span>}
          </>
        );
      case 'schedule':
        return (
          <>
            <span className="font-medium">{userDisplay}</span> scheduled {itemTypeFormatted}
            {item_title && <span className="font-medium"> "{item_title}"</span>}
          </>
        );
      default:
        return (
          <>
            <span className="font-medium">{userDisplay}</span> performed an action on {itemTypeFormatted}
            {item_title && <span className="font-medium"> "{item_title}"</span>}
          </>
        );
    }
  };

  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    // For older dates, just show the actual date
    return date.toLocaleDateString();
  };

  return (
    <div className={`bg-[#2d1e14] rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Clock size={18} className="mr-2 text-[#c9a52c]" /> Recent Activity
      </h3>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#c9a52c]"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-sm py-4">
          {error}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-gray-400 text-sm py-4">
          No recent activity found.
        </div>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id} className="border-b border-[#3a2819] pb-3 last:border-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3 mt-1">
                  {getItemTypeIcon(activity.item_type)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <div className="mr-2">
                      {getActionIcon(activity.action)}
                    </div>
                    <div className="text-sm">
                      {formatActivityMessage(activity)}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatRelativeTime(activity.created_at)}
                    {activity.details && (
                      <span className="ml-2 text-gray-500">{activity.details}</span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;
