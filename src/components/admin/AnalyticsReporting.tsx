import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Calendar, Download, Filter, TrendingUp } from 'lucide-react';
import { BookSummary } from '../../services/BookSummaryService';
import { BusinessPlan } from '../../services/businessPlanService';
import { BlogPost } from '../../services/blogService';
import { Purchase } from '../../services/purchaseService';

interface AnalyticsReportingProps {
  bookSummaries: BookSummary[];
  businessPlans: BusinessPlan[];
  blogPosts: BlogPost[];
  purchases: Purchase[];
  isLoading: boolean;
}

const AnalyticsReporting: React.FC<AnalyticsReportingProps> = ({
  bookSummaries,
  businessPlans,
  blogPosts,
  purchases,
  isLoading
}) => {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [reportType, setReportType] = useState<'revenue' | 'content' | 'purchases'>('revenue');

  // Generate date ranges
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case 'all':
      default:
        startDate.setFullYear(startDate.getFullYear() - 1); // Default to 1 year
        break;
    }

    return { startDate, endDate };
  };

  // Filter purchases by date range
  const getFilteredPurchases = () => {
    const { startDate } = getDateRange();

    return purchases.filter(purchase => {
      if (!purchase.created_at) return false;
      const purchaseDate = new Date(purchase.created_at);
      return purchaseDate >= startDate;
    });
  };

  // Generate revenue data for chart
  const generateRevenueData = () => {
    const { startDate, endDate } = getDateRange();
    const filteredPurchases = getFilteredPurchases();

    // Determine the interval based on time range
    let interval: 'day' | 'week' | 'month' = 'day';
    if (timeRange === '90days' || timeRange === 'all') {
      interval = 'week';
    }
    if (timeRange === 'all' && endDate.getTime() - startDate.getTime() > 180 * 24 * 60 * 60 * 1000) {
      interval = 'month';
    }

    // Generate date buckets
    const dateBuckets: Record<string, number> = {};
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      let key: string;

      if (interval === 'day') {
        key = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (interval === 'week') {
        // Get the week number
        const weekNumber = Math.ceil((currentDate.getDate() + new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()) / 7);
        key = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-W${weekNumber}`;
      } else {
        key = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      }

      if (!dateBuckets[key]) {
        dateBuckets[key] = 0;
      }

      // Increment date based on interval
      if (interval === 'day') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (interval === 'week') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    // Fill buckets with purchase data
    filteredPurchases.forEach(purchase => {
      if (!purchase.created_at) return;

      const purchaseDate = new Date(purchase.created_at);
      let key: string;

      if (interval === 'day') {
        key = purchaseDate.toISOString().split('T')[0]; // YYYY-MM-DD
      } else if (interval === 'week') {
        const weekNumber = Math.ceil((purchaseDate.getDate() + new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), 1).getDay()) / 7);
        key = `${purchaseDate.getFullYear()}-${(purchaseDate.getMonth() + 1).toString().padStart(2, '0')}-W${weekNumber}`;
      } else {
        key = `${purchaseDate.getFullYear()}-${(purchaseDate.getMonth() + 1).toString().padStart(2, '0')}`;
      }

      if (dateBuckets[key] !== undefined) {
        dateBuckets[key] += purchase.amount || 0;
      }
    });

    // Convert to array format for chart
    return Object.entries(dateBuckets).map(([date, amount]) => {
      let displayDate = date;

      if (interval === 'day') {
        // Format as MM/DD
        const [year, month, day] = date.split('-');
        displayDate = `${month}/${day}`;
      } else if (interval === 'week') {
        // Format as MM-WX
        const [yearMonth, week] = date.split('-W');
        const [year, month] = yearMonth.split('-');
        displayDate = `${month}-W${week}`;
      } else {
        // Format as MM/YYYY
        const [year, month] = date.split('-');
        displayDate = `${month}/${year}`;
      }

      return {
        date: displayDate,
        amount: parseFloat(amount.toFixed(2))
      };
    });
  };

  // Generate content distribution data for pie chart
  const generateContentDistributionData = () => {
    const bookCount = bookSummaries.length;
    const businessPlanCount = businessPlans.length;
    const blogPostCount = blogPosts.length;

    return [
      { name: 'Book Summaries', value: bookCount, color: '#c9a52c' },
      { name: 'Business Plans', value: businessPlanCount, color: '#3b82f6' },
      { name: 'Blog Posts', value: blogPostCount, color: '#a855f7' }
    ];
  };

  // Generate purchase type distribution data for pie chart
  const generatePurchaseDistributionData = () => {
    const filteredPurchases = getFilteredPurchases();

    const bookPurchases = filteredPurchases.filter(p => p.item_type === 'book-summary').length;
    const planPurchases = filteredPurchases.filter(p => p.item_type === 'business-plan').length;

    return [
      { name: 'Book Summaries', value: bookPurchases, color: '#c9a52c' },
      { name: 'Business Plans', value: planPurchases, color: '#3b82f6' }
    ];
  };

  // Generate top selling items
  const generateTopSellingItems = () => {
    const filteredPurchases = getFilteredPurchases();

    // Count purchases by item
    const itemCounts: Record<string, { count: number, revenue: number, title: string, type: string }> = {};

    filteredPurchases.forEach(purchase => {
      if (!purchase.item_id || !purchase.item_type) return;

      const itemId = purchase.item_id;
      const itemType = purchase.item_type;
      let itemTitle = 'Unknown Item';

      if (itemType === 'book-summary' && purchase.book_summary) {
        itemTitle = purchase.book_summary.title;
      } else if (itemType === 'business-plan' && purchase.business_plan) {
        itemTitle = purchase.business_plan.title;
      }

      const key = `${itemType}-${itemId}`;

      if (!itemCounts[key]) {
        itemCounts[key] = {
          count: 0,
          revenue: 0,
          title: itemTitle,
          type: itemType
        };
      }

      itemCounts[key].count += 1;
      itemCounts[key].revenue += purchase.amount || 0;
    });

    // Convert to array and sort by count
    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5
  };

  // Calculate total revenue for the period
  const calculateTotalRevenue = () => {
    const filteredPurchases = getFilteredPurchases();
    return filteredPurchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
  };

  // Calculate average order value
  const calculateAverageOrderValue = () => {
    const filteredPurchases = getFilteredPurchases();
    if (filteredPurchases.length === 0) return 0;

    const totalRevenue = filteredPurchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);
    return totalRevenue / filteredPurchases.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c9a52c]"></div>
      </div>
    );
  }

  const revenueData = generateRevenueData();
  const contentDistributionData = generateContentDistributionData();
  const purchaseDistributionData = generatePurchaseDistributionData();
  const topSellingItems = generateTopSellingItems();
  const totalRevenue = calculateTotalRevenue();
  const averageOrderValue = calculateAverageOrderValue();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <TrendingUp className="mr-2 h-5 w-5 text-[#c9a52c]" />
          Analytics & Reporting
        </h2>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c] appearance-none pr-8"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
            <Calendar size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="rounded-md bg-[#2d1e14] border border-[#7a4528]/50 px-3 py-2 text-white focus:border-[#c9a52c] focus:outline-none focus:ring-1 focus:ring-[#c9a52c] appearance-none pr-8"
            >
              <option value="revenue">Revenue</option>
              <option value="content">Content</option>
              <option value="purchases">Purchases</option>
            </select>
            <Filter size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          <button
            onClick={() => {/* Mock export functionality */}}
            className="px-3 py-2 bg-[#3a2819] hover:bg-[#4a3829] rounded text-sm flex items-center"
          >
            <Download size={16} className="mr-1" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#2d1e14] rounded-lg p-4 shadow-md">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <h3 className="text-2xl font-bold mt-1 text-white">${totalRevenue.toFixed(2)}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {timeRange === '7days' ? 'Last 7 days' :
             timeRange === '30days' ? 'Last 30 days' :
             timeRange === '90days' ? 'Last 90 days' : 'All time'}
          </p>
        </div>

        <div className="bg-[#2d1e14] rounded-lg p-4 shadow-md">
          <p className="text-gray-400 text-sm">Total Purchases</p>
          <h3 className="text-2xl font-bold mt-1 text-white">{getFilteredPurchases().length}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {timeRange === '7days' ? 'Last 7 days' :
             timeRange === '30days' ? 'Last 30 days' :
             timeRange === '90days' ? 'Last 90 days' : 'All time'}
          </p>
        </div>

        <div className="bg-[#2d1e14] rounded-lg p-4 shadow-md">
          <p className="text-gray-400 text-sm">Average Order Value</p>
          <h3 className="text-2xl font-bold mt-1 text-white">${averageOrderValue.toFixed(2)}</h3>
          <p className="text-xs text-gray-400 mt-1">
            {timeRange === '7days' ? 'Last 7 days' :
             timeRange === '30days' ? 'Last 30 days' :
             timeRange === '90days' ? 'Last 90 days' : 'All time'}
          </p>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-[#2d1e14] rounded-lg p-4 shadow-md mb-6">
        <h3 className="font-medium text-white mb-4">
          {reportType === 'revenue' ? 'Revenue Over Time' :
           reportType === 'content' ? 'Content Distribution' : 'Purchase Distribution'}
        </h3>

        <div className="h-80">
          {reportType === 'revenue' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3a2819" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2d1e14', border: '1px solid #7a4528', borderRadius: '0.375rem' }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Bar dataKey="amount" fill="#c9a52c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {reportType === 'content' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {contentDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#2d1e14', border: '1px solid #7a4528', borderRadius: '0.375rem' }}
                  formatter={(value) => [value, 'Count']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}

          {reportType === 'purchases' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={purchaseDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {purchaseDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#2d1e14', border: '1px solid #7a4528', borderRadius: '0.375rem' }}
                  formatter={(value) => [value, 'Purchases']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-[#2d1e14] rounded-lg p-4 shadow-md">
        <h3 className="font-medium text-white mb-4">Top Selling Items</h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#3a2819] text-left">
                <th className="p-3 rounded-tl-lg">Item</th>
                <th className="p-3">Type</th>
                <th className="p-3">Purchases</th>
                <th className="p-3 rounded-tr-lg">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topSellingItems.length > 0 ? (
                topSellingItems.map((item, index) => (
                  <tr key={index} className="border-b border-[#3a2819] hover:bg-[#3a2819]/50">
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.type === 'book-summary' ? 'bg-[#c9a52c]/20 text-[#c9a52c]' : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {item.type === 'book-summary' ? 'Book Summary' : 'Business Plan'}
                      </span>
                    </td>
                    <td className="p-3">{item.count}</td>
                    <td className="p-3">${item.revenue.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-400">
                    No purchases in the selected time period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReporting;
