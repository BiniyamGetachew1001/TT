import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CheckCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { purchaseBook } from '../services/purchaseService';

interface BookPurchaseProps {
  book: any;
  isPurchased: boolean;
  onPurchaseComplete: () => void;
}

const BookPurchase: React.FC<BookPurchaseProps> = ({ book, isPurchased, onPurchaseComplete }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would redirect to Chapa payment
      // For now, we'll simulate a successful payment
      const result = await purchaseBook(user.id, book.id, book.price);
      
      if (result.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          onPurchaseComplete();
        }, 2000);
      } else {
        setError(result.message || 'Payment failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during payment. Please try again.');
      console.error('Purchase error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-[#3a2819] rounded-xl p-6 border border-[#7a4528]/30">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover and Info */}
        <div className="md:col-span-1">
          <div className="bg-[#2d1e14] p-4 rounded-lg mb-4">
            <img 
              src={book.coverImage || '/placeholder-book.jpg'} 
              alt={book.title} 
              className="w-full h-auto rounded-md"
            />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{book.title}</h3>
          <p className="text-gray-400 mb-2">By {book.author}</p>
          <div className="flex items-center justify-between">
            <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-[#c9a52c]/20 text-[#c9a52c]">
              {book.category}
            </span>
            <span className="text-gray-400 text-sm">{book.readTime}</span>
          </div>
        </div>
        
        {/* Purchase Details */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-white mb-4">Purchase Summary</h2>
          
          <p className="text-gray-300 mb-6">{book.description}</p>
          
          <div className="border-t border-b border-[#7a4528] py-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">What You'll Get</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <CheckCircle size={18} className="text-[#c9a52c] mr-2 mt-0.5" />
                <span className="text-gray-300">Full access to the book summary</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="text-[#c9a52c] mr-2 mt-0.5" />
                <span className="text-gray-300">Key insights and takeaways</span>
              </li>
              <li className="flex items-start">
                <CheckCircle size={18} className="text-[#c9a52c] mr-2 mt-0.5" />
                <span className="text-gray-300">Lifetime access to content updates</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg text-white">Price:</span>
            <span className="text-2xl font-bold text-[#c9a52c]">${book.price.toFixed(2)} USD</span>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {paymentSuccess && (
            <div className="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-md mb-4">
              Payment successful! You now have access to this book summary.
            </div>
          )}
          
          <div className="flex flex-col items-center">
            {isPurchased ? (
              <button
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center justify-center transition-colors"
                onClick={() => navigate(`/reading/${book.id}`)}
              >
                <CheckCircle size={20} className="mr-2" />
                Read Now
              </button>
            ) : (
              <button
                className={`w-full py-3 px-6 bg-[#c9a52c] hover:bg-[#b08d1e] text-[#2d1e14] font-medium rounded-md flex items-center justify-center transition-colors ${
                  isLoading || paymentSuccess ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={isLoading || paymentSuccess}
                onClick={handlePurchase}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2d1e14] mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} className="mr-2" />
                    Purchase Now
                  </>
                )}
              </button>
            )}
            
            <div className="flex items-center mt-3 text-gray-400 text-sm">
              <Lock size={14} className="mr-1" />
              Secure payment powered by Chapa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPurchase;
