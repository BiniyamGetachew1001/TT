import React from 'react';
import Modal from './ui/modal';
import { Download, ExternalLink, FileText, Book, Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PurchaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: any;
}

const PurchaseDetailModal: React.FC<PurchaseDetailModalProps> = ({ isOpen, onClose, purchase }) => {
  if (!purchase) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'refunded':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-400" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-400" />;
      default:
        return null;
    }
  };

  const isBookSummary = purchase.item_type === 'book-summary';
  const item = isBookSummary ? purchase.book_summary : purchase.business_plan;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Purchase Details"
      size="lg"
    >
      <div className="space-y-6">
        {/* Item details */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="rounded-lg overflow-hidden border border-[#7a4528]/30 h-48">
              <img
                src={item?.cover_image || (isBookSummary ? '/placeholder-book.jpg' : '/placeholder-business.jpg')}
                alt={item?.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = isBookSummary ? '/placeholder-book.jpg' : '/placeholder-business.jpg';
                }}
              />
            </div>
          </div>
          <div className="w-full md:w-2/3 space-y-4">
            <h3 className="text-xl font-bold">{item?.title}</h3>
            <div className="flex items-center gap-2 text-gray-300">
              {isBookSummary ? (
                <>
                  <Book size={16} />
                  <span>By {item?.author}</span>
                </>
              ) : (
                <>
                  <FileText size={16} />
                  <span>Industry: {item?.industry}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-300">
                <Calendar size={16} />
                <span>Purchased: {formatDate(purchase.created_at)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <DollarSign size={16} />
                <span>Amount: ${purchase.amount.toFixed(2)} {purchase.currency}</span>
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(purchase.status)}
                <span className={getStatusColor(purchase.status)}>
                  Status: {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="pt-4 flex flex-wrap gap-3">
              {isBookSummary ? (
                <Link
                  to={`/reading/${purchase.item_id}`}
                  className="inline-flex items-center px-4 py-2 bg-[#c9a52c] text-[#2d1e14] font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
                >
                  <Book size={16} className="mr-2" />
                  Read Now
                </Link>
              ) : (
                <Link
                  to={`/business-plans/${purchase.item_id}`}
                  className="inline-flex items-center px-4 py-2 bg-[#c9a52c] text-[#2d1e14] font-medium rounded-md hover:bg-[#b08d1e] transition-colors"
                >
                  <FileText size={16} className="mr-2" />
                  View Plan
                </Link>
              )}
              <button
                className="inline-flex items-center px-4 py-2 border border-[#c9a52c] text-[#c9a52c] font-medium rounded-md hover:bg-[#3a2819] transition-colors"
              >
                <Download size={16} className="mr-2" />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Purchase information */}
        <div className="border-t border-[#7a4528]/30 pt-4 mt-4">
          <h4 className="text-lg font-semibold mb-3">Purchase Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#2d1e14] p-3 rounded-md">
              <p className="text-gray-400 mb-1">Transaction ID</p>
              <p className="font-medium">{purchase.payment_id || 'N/A'}</p>
            </div>
            <div className="bg-[#2d1e14] p-3 rounded-md">
              <p className="text-gray-400 mb-1">Purchase Date</p>
              <p className="font-medium">{formatDate(purchase.created_at)}</p>
            </div>
            <div className="bg-[#2d1e14] p-3 rounded-md">
              <p className="text-gray-400 mb-1">Amount</p>
              <p className="font-medium">${purchase.amount.toFixed(2)} {purchase.currency}</p>
            </div>
            <div className="bg-[#2d1e14] p-3 rounded-md">
              <p className="text-gray-400 mb-1">Status</p>
              <p className={`font-medium ${getStatusColor(purchase.status)}`}>
                {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Receipt */}
        <div className="border-t border-[#7a4528]/30 pt-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold">Receipt</h4>
            <button className="text-[#c9a52c] hover:text-[#b08d1e] transition-colors flex items-center">
              <Download size={16} className="mr-1" />
              Download Receipt
            </button>
          </div>
          <div className="bg-[#2d1e14] p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Item:</span>
              <span>{item?.title}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Type:</span>
              <span>{isBookSummary ? 'Book Summary' : 'Business Plan'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Price:</span>
              <span>${purchase.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Tax:</span>
              <span>$0.00</span>
            </div>
            <div className="border-t border-[#7a4528]/30 my-2 pt-2 flex justify-between font-bold">
              <span>Total:</span>
              <span>${purchase.amount.toFixed(2)} {purchase.currency}</span>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="border-t border-[#7a4528]/30 pt-4 mt-4">
          <h4 className="text-lg font-semibold mb-3">Need Help?</h4>
          <p className="text-gray-300 mb-3">
            If you have any issues with your purchase, please contact our support team.
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-[#c9a52c] text-[#c9a52c] font-medium rounded-md hover:bg-[#3a2819] transition-colors">
            <ExternalLink size={16} className="mr-2" />
            Contact Support
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PurchaseDetailModal;
