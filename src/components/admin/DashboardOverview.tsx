import React from 'react';
import { Book, FileText, Newspaper, ShoppingCart, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { BookSummary } from '../../services/BookSummaryService';
import { BusinessPlan } from '../../services/businessPlanService';
import { BlogPost } from '../../services/blogService';
import { Purchase } from '../../services/purchaseService';

interface DashboardOverviewProps {
  bookSummaries: BookSummary[];
  businessPlans: BusinessPlan[];
  blogPosts: BlogPost[];
  purchases: Purchase[];
  isLoading: boolean;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  bookSummaries,
  businessPlans,
  blogPosts,
  purchases,
  isLoading
}) => {
  // Calculate total revenue
  const totalRevenue = purchases.reduce((sum, purchase) => {
    return sum + (purchase.amount || 0);
  }, 0);

  // Get recent purchases (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentPurchases = purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.created_at);
    return purchaseDate >= thirtyDaysAgo;
  });

  // Calculate recent revenue
  const recentRevenue = recentPurchases.reduce((sum, purchase) => {
    return sum + (purchase.amount || 0);
  }, 0);

  // Get unique users
  const uniqueUsers = new Set(purchases.map(purchase => purchase.user_id)).size;

  // Calculate stats for each content type
  const premiumBooks = bookSummaries.filter(book => (book.price || 0) > 0).length;
  const freeBooks = bookSummaries.length - premiumBooks;

  const premiumPlans = businessPlans.filter(plan => (plan.price || 0) > 0).length;
  const freePlans = businessPlans.length - premiumPlans;

  const publishedPosts = blogPosts.filter(post => post.status === 'published').length;
  const draftPosts = blogPosts.filter(post => post.status === 'draft').length;

  // Get recent content (added in the last 30 days)
  const recentBooks = bookSummaries.filter(book => {
    if (!book.created_at) return false;
    const createdDate = new Date(book.created_at);
    return createdDate >= thirtyDaysAgo;
  }).length;

  const recentPlans = businessPlans.filter(plan => {
    if (!plan.created_at) return false;
    const createdDate = new Date(plan.created_at);
    return createdDate >= thirtyDaysAgo;
  }).length;

  const recentPosts = blogPosts.filter(post => {
    if (!post.publishedAt) return false;
    const createdDate = new Date(post.publishedAt);
    return createdDate >= thirtyDaysAgo;
  }).length;

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Content',
      value: bookSummaries.length + businessPlans.length + blogPosts.length,
      icon: <FileText className="h-6 w-6 text-[#c9a52c]" />,
      change: recentBooks + recentPlans + recentPosts,
      changeLabel: 'new in 30 days'
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="h-6 w-6 text-green-400" />,
      change: `$${recentRevenue.toFixed(2)}`,
      changeLabel: 'last 30 days'
    },
    {
      title: 'Purchases',
      value: purchases.length,
      icon: <ShoppingCart className="h-6 w-6 text-blue-400" />,
      change: recentPurchases.length,
      changeLabel: 'last 30 days'
    },
    {
      title: 'Unique Users',
      value: uniqueUsers,
      icon: <Users className="h-6 w-6 text-purple-400" />,
      change: '',
      changeLabel: ''
    }
  ];

  // Content breakdown data
  const contentBreakdown = [
    {
      title: 'Book Summaries',
      total: bookSummaries.length,
      icon: <Book className="h-5 w-5 text-[#c9a52c]" />,
      details: [
        { label: 'Premium', value: premiumBooks, color: 'bg-[#c9a52c]' },
        { label: 'Free', value: freeBooks, color: 'bg-[#7a4528]' }
      ]
    },
    {
      title: 'Business Plans',
      total: businessPlans.length,
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      details: [
        { label: 'Premium', value: premiumPlans, color: 'bg-blue-400' },
        { label: 'Free', value: freePlans, color: 'bg-blue-800' }
      ]
    },
    {
      title: 'Blog Posts',
      total: blogPosts.length,
      icon: <Newspaper className="h-5 w-5 text-purple-400" />,
      details: [
        { label: 'Published', value: publishedPosts, color: 'bg-purple-400' },
        { label: 'Draft', value: draftPosts, color: 'bg-purple-800' }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-[#2d1e14] rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-white">{card.value}</h3>
                {card.change && (
                  <p className="text-xs text-gray-400 mt-1">
                    <span className="text-green-400">{card.change}</span> {card.changeLabel}
                  </p>
                )}
              </div>
              <div className="p-2 bg-[#3a2819] rounded-md">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contentBreakdown.map((content, index) => (
          <div key={index} className="bg-[#2d1e14] rounded-lg p-4 shadow-md">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-[#3a2819] rounded-md mr-3">
                {content.icon}
              </div>
              <div>
                <h3 className="font-medium text-white">{content.title}</h3>
                <p className="text-gray-400 text-sm">Total: {content.total}</p>
              </div>
            </div>

            <div className="space-y-2">
              {content.details.map((detail, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{detail.label}</span>
                    <span className="text-white">{detail.value}</span>
                  </div>
                  <div className="w-full bg-[#3a2819] rounded-full h-1.5">
                    <div
                      className={`${detail.color} h-1.5 rounded-full`}
                      style={{ width: content.total > 0 ? `${(detail.value / content.total) * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#2d1e14] rounded-lg p-4 shadow-md">
        <h3 className="font-medium text-white mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-[#c9a52c]" />
          Recent Activity
        </h3>

        <div className="space-y-3">
          {purchases.slice(0, 5).map((purchase, index) => {
            const date = new Date(purchase.created_at || new Date());
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let itemTitle = 'Unknown Item';
            if (purchase.item_type === 'book-summary' && purchase.book_summary) {
              itemTitle = purchase.book_summary.title;
            } else if (purchase.item_type === 'business-plan' && purchase.business_plan) {
              itemTitle = purchase.business_plan.title;
            }

            return (
              <div key={index} className="flex items-center p-2 hover:bg-[#3a2819] rounded-md transition-colors">
                <div className={`p-2 rounded-full ${
                  purchase.status === 'completed' ? 'bg-green-900/30 text-green-200' :
                  purchase.status === 'pending' ? 'bg-yellow-900/30 text-yellow-200' :
                  'bg-red-900/30 text-red-200'
                }`}>
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-white">
                    <span className="font-medium">{purchase.user?.name || 'Unknown User'}</span> purchased <span className="text-[#c9a52c]">{itemTitle}</span>
                  </p>
                  <p className="text-xs text-gray-400">{formattedDate} at {formattedTime}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">${(purchase.amount || 0).toFixed(2)}</p>
                  <p className={`text-xs ${
                    purchase.status === 'completed' ? 'text-green-400' :
                    purchase.status === 'pending' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {purchase.status}
                  </p>
                </div>
              </div>
            );
          })}

          {purchases.length === 0 && (
            <p className="text-gray-400 text-sm py-2">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
