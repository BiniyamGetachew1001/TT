import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  // Check if we're on a reading page, if so don't show footer
  const isReadingPage = window.location.pathname.includes('/reading/');
  
  if (isReadingPage) {
    return null;
  }
  
  // Don't show the default footer on the homepage as it has its own custom footer
  const isHomePage = window.location.pathname === '/';
  if (isHomePage) {
    return null;
  }
  
  return (
    <footer className="w-full border-t border-[#4a2e1c]/50 py-6 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Book className="text-[#c9a52c]" size={24} />
              <h2 className="text-xl font-bold">TILKTIBEB</h2>
            </div>
            <p className="text-sm text-gray-400">
              Premium business book summaries and business plans with a one-time payment.
            </p>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/book-summaries" className="text-sm text-gray-400 hover:text-white transition-colors">Book Summaries</Link></li>
              <li><Link to="/business-plans" className="text-sm text-gray-400 hover:text-white transition-colors">Business Plans</Link></li>
              <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Free Business Ideas</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-[#4a2e1c]/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-3 md:mb-0">© 2025 TILKTIBEB. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
