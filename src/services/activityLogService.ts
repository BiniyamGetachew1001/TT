// Define ActivityLog type locally since we removed the Supabase import
export type ActivityLog = {
  id: string;
  user_id?: string;
  action: string;
  item_type: 'book-summary' | 'business-plan' | 'blog-post' | 'user' | 'purchase';
  item_id: string;
  details?: any;
  created_at: string;
};

/**
 * Get recent activity logs
 * @param limit Number of logs to return
 * @returns Activity logs
 */
export const getRecentActivityLogs = async (limit = 10) => {
  try {
    console.log('Using mock data for activity logs');

    // Create mock activity logs
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        user_id: 'user-1',
        action: 'created',
        item_type: 'book-summary',
        item_id: '1',
        details: { title: 'The Lean Startup' },
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: '2',
        user_id: 'user-2',
        action: 'purchased',
        item_type: 'book-summary',
        item_id: '2',
        details: { title: 'Atomic Habits', amount: 9.99 },
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      },
      {
        id: '3',
        user_id: 'user-1',
        action: 'updated',
        item_type: 'blog-post',
        item_id: '1',
        details: { title: '10 Essential Entrepreneurship Lessons' },
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
      },
      {
        id: '4',
        user_id: 'user-3',
        action: 'created',
        item_type: 'business-plan',
        item_id: '1',
        details: { title: 'Coffee Shop Business Plan' },
        created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString()
      },
      {
        id: '5',
        user_id: 'user-1',
        action: 'deleted',
        item_type: 'blog-post',
        item_id: '3',
        details: { title: 'Deleted Blog Post' },
        created_at: new Date(Date.now() - 1000 * 60 * 300).toISOString()
      }
    ];

    // Sort by created_at in descending order and limit
    const sortedLogs = mockLogs
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);

    return {
      success: true,
      data: sortedLogs
    };
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch activity logs',
      data: []
    };
  }
};

/**
 * Create a new activity log entry
 * @param log Activity log data
 * @returns Created activity log
 */
export const createActivityLog = async (log: Omit<ActivityLog, 'id' | 'created_at'>) => {
  try {
    console.log('Using mock data for creating activity log');

    // Create a mock activity log with a unique ID
    const mockLog = {
      id: Date.now().toString(),
      ...log,
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      data: mockLog
    };
  } catch (error: any) {
    console.error('Error creating activity log:', error);
    return {
      success: false,
      message: error.message || 'Failed to create activity log'
    };
  }
};

/**
 * Get activity logs for a specific item
 * @param itemType Type of item
 * @param itemId ID of the item
 * @returns Activity logs for the item
 */
export const getItemActivityLogs = async (itemType: ActivityLog['item_type'], itemId: string) => {
  try {
    console.log('Using mock data for item activity logs');

    // Create mock activity logs for the specific item
    const mockLogs: ActivityLog[] = [
      {
        id: '1',
        user_id: 'user-1',
        action: 'created',
        item_type: itemType,
        item_id: itemId,
        details: { title: 'Created Item' },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
      },
      {
        id: '2',
        user_id: 'user-1',
        action: 'updated',
        item_type: itemType,
        item_id: itemId,
        details: { title: 'Updated Item', changes: ['title', 'description'] },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      },
      {
        id: '3',
        user_id: 'user-2',
        action: 'viewed',
        item_type: itemType,
        item_id: itemId,
        details: { title: 'Viewed Item' },
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
      }
    ];

    // Sort by created_at in descending order
    const sortedLogs = mockLogs.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      success: true,
      data: sortedLogs
    };
  } catch (error: any) {
    console.error('Error fetching item activity logs:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch item activity logs',
      data: []
    };
  }
};
