import { supabase } from '../lib/supabase';
import type { ActivityLog } from '../lib/supabase';

/**
 * Get recent activity logs
 * @param limit Number of logs to return
 * @returns Activity logs
 */
export const getRecentActivityLogs = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      data
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
    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{
        ...log,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    return {
      success: true,
      data: data[0]
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
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('item_type', itemType)
      .eq('item_id', itemId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data
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
