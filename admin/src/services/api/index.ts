export * from './blogPostsApi';
export * from './bookSummariesApi';
export * from './businessPlansApi';
export * from './usersApi';
export * from './purchasesApi';
export * from './settingsApi';

// Dashboard API
import { supabase } from '../../lib/supabase';

export const dashboardApi = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;
      
      // Get total book summaries count
      const { count: totalBooks, error: booksError } = await supabase
        .from('book_summaries')
        .select('*', { count: 'exact', head: true });
      
      if (booksError) throw booksError;
      
      // Get total blog posts count
      const { count: totalBlogs, error: blogsError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
      
      if (blogsError) throw blogsError;
      
      // Get total purchases count
      const { count: totalPurchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('*', { count: 'exact', head: true });
      
      if (purchasesError) throw purchasesError;
      
      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('purchases')
        .select('amount')
        .eq('status', 'completed');
      
      if (revenueError) throw revenueError;
      
      const revenue = revenueData.reduce((sum, purchase) => sum + purchase.amount, 0);
      
      // Get recent purchases
      const { data: recentPurchases, error: recentPurchasesError } = await supabase
        .from('purchases')
        .select(`
          *,
          user:user_id(id, name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (recentPurchasesError) throw recentPurchasesError;
      
      // Get popular content (this would typically come from analytics)
      // For now, we'll use mock data
      const popularContent = [
        { id: 'c1', title: 'The Psychology of Money', type: 'book', views: 1245 },
        { id: 'c2', title: 'How to Start a Successful Business in 2023', type: 'blog', views: 987 },
        { id: 'c3', title: 'E-commerce Business Plan', type: 'plan', views: 876 },
        { id: 'c4', title: 'Atomic Habits', type: 'book', views: 754 },
      ];
      
      // Get active users (this would typically come from analytics)
      // For now, we'll use a mock number
      const activeUsers = 89;
      
      return {
        totalUsers: totalUsers || 0,
        totalBooks: totalBooks || 0,
        totalBlogs: totalBlogs || 0,
        totalPurchases: totalPurchases || 0,
        revenue,
        activeUsers,
        recentPurchases,
        popularContent
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};
