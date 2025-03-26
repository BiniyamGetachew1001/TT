import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Coffee, Lock, ShoppingBag, TrendingUp, Truck, Utensils, Wifi } from 'lucide-react';
import { businessPlans } from '../data/mockData';
import { useBookmarks } from '../contexts/BookmarkContext';

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee size={24} />,
  ShoppingBag: <ShoppingBag size={24} />,
  Utensils: <Utensils size={24} />,
  Truck: <Truck size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  Wifi: <Wifi size={24} />
};

const BusinessPlansPage: React.FC = () => {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  const handleBookmark = (e: React.MouseEvent, plan: typeof businessPlans[0]) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isBookmarked(plan.id)) {
      removeBookmark(plan.id);
    } else {
      addBookmark({
        id: plan.id,
        title: plan.title,
        type: 'business-plan',
        category: plan.category,
        description: plan.description
      });
    }
  };

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Business Plans</h1>
          <div className="flex gap-3">
            <select className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]">
              <option>All Categories</option>
              <option>Small Business</option>
              <option>Medium Business</option>
              <option>Large Business</option>
            </select>
            <select className="bg-[#3a2819] text-white rounded-md px-3 py-2 text-sm border border-[#7a4528] focus:outline-none focus:ring-1 focus:ring-[#c9a52c]">
              <option>All Investment Ranges</option>
              <option>Under $10,000</option>
              <option>$10,000 - $50,000</option>
              <option>$50,000 - $200,000</option>
              <option>$200,000+</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {businessPlans.map(plan => {
            const bookmarked = isBookmarked(plan.id);
            
            return (
              <div key={plan.id} className="bg-[#3a2819] rounded-xl overflow-hidden">
                <div className="h-40 overflow-hidden relative">
                  {plan.coverImage && (
                    <img 
                      src={plan.coverImage} 
                      alt={plan.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  <button 
                    onClick={(e) => handleBookmark(e, plan)}
                    className="absolute top-3 right-3 bg-[#2d1e14] bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    {bookmarked ? (
                      <BookmarkCheck size={18} className="text-[#c9a52c]" />
                    ) : (
                      <Bookmark size={18} className="text-white" />
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-[#2d1e14] p-3 rounded-lg text-[#c9a52c]">
                      {iconMap[plan.icon]}
                    </div>
                    {plan.isPremium && (
                      <div className="text-[#c9a52c] bg-[#2d1e14] p-1.5 rounded-full">
                        <Lock size={16} />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                  
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">Investment Range:</div>
                    <div className="text-sm font-medium">{plan.investment}</div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-xs bg-[#2d1e14] text-[#c9a52c] py-1 px-2 rounded-md">{plan.category}</span>
                  </div>
                  
                  <button className={plan.isPremium ? "secondary-button w-full" : "gold-button w-full"}>
                    {plan.isPremium ? "Unlock Business Plan" : "View Business Plan"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="bg-[#3a2819] rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Custom Business Plan?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our premium plans include access to customizable business plan templates 
            that you can adapt to your specific needs and market conditions.
          </p>
          <Link to="/pricing" className="gold-button">
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlansPage;
