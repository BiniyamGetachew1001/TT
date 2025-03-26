import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Check, Coffee, Download, Laptop, LayoutGrid, MonitorSmartphone, Moon, Play, Smartphone, Star, Wifi } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-[#2d1e14] text-white">
      {/* Hero Section */}
      <section className="py-12 px-6 md:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="col-span-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Unlock Business Wisdom <br />
              <span className="gold-text">with Premium Summaries</span>
            </h1>
            <p className="text-lg text-gray-300 mb-4">
              Get lifetime access to 200+ business book summaries and
              20 free business ideas with a one-time payment.
            </p>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check size={20} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                <span>Access 200+ premium business book summaries</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                <span>Get 20 free business ideas with detailed plans</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                <span>Unlock premium business plans for different business sizes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                <span>Lifetime access with a one-time payment</span>
              </li>
            </ul>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/pricing" className="gold-button">
                Get Started
              </Link>
              <Link to="/pricing" className="secondary-button">
                View Pricing
              </Link>
            </div>
          </div>
          
          <div className="col-span-1 flex justify-center">
            <div className="relative glass-card p-6 w-full max-w-md">
              <Link to="#" className="block bg-[#c9a52c] text-[#2d1e14] font-medium py-2 px-4 rounded-md text-center mb-4">
                Watch Demo
              </Link>
              <div className="aspect-video bg-[#3a2819] rounded-xl flex items-center justify-center">
                <Play size={48} className="text-[#c9a52c] cursor-pointer hover:text-[#b89225] transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Book Summaries Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Book Summaries</h2>
            <Link to="/book-summaries" className="text-[#c9a52c] hover:underline flex items-center">
              View all
            </Link>
          </div>
          
          <p className="text-gray-300 mb-8">Unlock 200+ premium business book summaries</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Book Card 1 */}
            <div className="glass-card overflow-hidden">
              <div className="h-48 bg-[#3a2819] flex items-center justify-center">
                <Book size={32} className="text-[#c9a52c]" />
              </div>
              <div className="p-4">
                <div className="bg-[#c9a52c] text-[#2d1e14] text-xs px-2 py-0.5 rounded inline-block mb-2">Premium</div>
                <h3 className="text-lg font-bold mb-1">Zero to One</h3>
                <p className="text-sm text-gray-300 mb-2">Peter Thiel</p>
                <div className="flex items-center">
                  <Star size={16} fill="#c9a52c" className="text-[#c9a52c]" />
                  <span className="ml-1 text-sm">4.8</span>
                </div>
              </div>
            </div>
            
            {/* Book Card 2 */}
            <div className="glass-card overflow-hidden">
              <div className="h-48 bg-[#3a2819] flex items-center justify-center">
                <Book size={32} className="text-[#c9a52c]" />
              </div>
              <div className="p-4">
                <div className="bg-[#c9a52c] text-[#2d1e14] text-xs px-2 py-0.5 rounded inline-block mb-2">Premium</div>
                <h3 className="text-lg font-bold mb-1">Good to Great</h3>
                <p className="text-sm text-gray-300 mb-2">Jim Collins</p>
                <div className="flex items-center">
                  <Star size={16} fill="#c9a52c" className="text-[#c9a52c]" />
                  <span className="ml-1 text-sm">4.7</span>
                </div>
              </div>
            </div>
            
            {/* Book Card 3 */}
            <div className="glass-card overflow-hidden">
              <div className="h-48 bg-[#3a2819] flex items-center justify-center">
                <Book size={32} className="text-[#c9a52c]" />
              </div>
              <div className="p-4">
                <div className="bg-[#c9a52c] text-[#2d1e14] text-xs px-2 py-0.5 rounded inline-block mb-2">Premium</div>
                <h3 className="text-lg font-bold mb-1">The Lean Startup</h3>
                <p className="text-sm text-gray-300 mb-2">Eric Ries</p>
                <div className="flex items-center">
                  <Star size={16} fill="#c9a52c" className="text-[#c9a52c]" />
                  <span className="ml-1 text-sm">4.8</span>
                </div>
              </div>
            </div>
            
            {/* Book Card 4 */}
            <div className="glass-card overflow-hidden">
              <div className="h-48 bg-[#3a2819] flex items-center justify-center">
                <Book size={32} className="text-[#c9a52c]" />
              </div>
              <div className="p-4">
                <div className="bg-[#c9a52c] text-[#2d1e14] text-xs px-2 py-0.5 rounded inline-block mb-2">Premium</div>
                <h3 className="text-lg font-bold mb-1">Atomic Habits</h3>
                <p className="text-sm text-gray-300 mb-2">James Clear</p>
                <div className="flex items-center">
                  <Star size={16} fill="#c9a52c" className="text-[#c9a52c]" />
                  <span className="ml-1 text-sm">4.9</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Business Plans Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Premium Business Plans</h2>
            <Link to="/business-plans" className="text-[#c9a52c] hover:underline flex items-center">
              View all
            </Link>
          </div>
          
          <p className="text-gray-300 mb-8">Detailed business plans for different business sizes</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Small Business Card */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-xl font-bold mb-2">
                  <Coffee size={20} className="text-[#c9a52c]" />
                  <span>Small Business</span>
                </h3>
                <p className="text-gray-300">
                  Perfect for solopreneurs and small teams looking to start a business with minimal investment.
                </p>
              </div>
              <Link to="/business-plans" className="gold-button block text-center">
                Explore Plans
              </Link>
            </div>
            
            {/* Medium Business Card */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-xl font-bold mb-2">
                  <LayoutGrid size={20} className="text-[#c9a52c]" />
                  <span>Medium Business</span>
                </h3>
                <p className="text-gray-300">
                  Comprehensive plans for growing businesses looking to scale operations and increase market share.
                </p>
              </div>
              <Link to="/business-plans" className="gold-button block text-center">
                Explore Plans
              </Link>
            </div>
            
            {/* Large Business Card */}
            <div className="glass-card p-6">
              <div className="mb-4">
                <h3 className="flex items-center gap-2 text-xl font-bold mb-2">
                  <Laptop size={20} className="text-[#c9a52c]" />
                  <span>Large Business</span>
                </h3>
                <p className="text-gray-300">
                  Enterprise-level business plans for established companies seeking expansion and optimization.
                </p>
              </div>
              <Link to="/business-plans" className="gold-button block text-center">
                Explore Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Simple, Transparent Pricing</h2>
            <p className="text-gray-300">One-time payment for lifetime access to premium business content</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Base Access Plan */}
            <div className="glass-card p-6 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Base Access</h3>
              <p className="text-gray-300 text-sm mb-2">One-time payment for lifetime access</p>
              <div className="flex items-baseline mb-6">
                <span className="text-[#c9a52c] text-4xl font-bold">$99</span>
                <span className="text-gray-300 ml-2 text-sm">one-time</span>
              </div>
              
              <div className="flex-grow space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">200+ business book summaries</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">20 free business ideas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Interactive reading experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Offline reading mode</span>
                </div>
              </div>
              
              <Link to="/pricing" className="gold-button block text-center">
                Get Started
              </Link>
            </div>
            
            {/* Small Business Plan */}
            <div className="glass-card p-6 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Small Business</h3>
              <p className="text-gray-300 text-sm mb-2">Premium small business plans</p>
              <div className="flex items-baseline mb-6">
                <span className="text-[#c9a52c] text-4xl font-bold">$149</span>
                <span className="text-gray-300 ml-2 text-sm">one-time</span>
              </div>
              
              <div className="flex-grow space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Everything in Base Access</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Small business plan collection</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Low investment requirements</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Solopreneur-friendly</span>
                </div>
              </div>
              
              <Link to="/pricing" className="secondary-button block text-center">
                Choose Plan
              </Link>
            </div>
            
            {/* Medium Business Plan */}
            <div className="glass-card p-6 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Medium Business</h3>
              <p className="text-gray-300 text-sm mb-2">Premium medium business plans</p>
              <div className="flex items-baseline mb-6">
                <span className="text-[#c9a52c] text-4xl font-bold">$249</span>
                <span className="text-gray-300 ml-2 text-sm">one-time</span>
              </div>
              
              <div className="flex-grow space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Everything in Base Access</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Medium business plan collection</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Scaling strategies</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Team management frameworks</span>
                </div>
              </div>
              
              <Link to="/pricing" className="secondary-button block text-center">
                Choose Plan
              </Link>
            </div>
            
            {/* Large Business Plan */}
            <div className="glass-card p-6 flex flex-col h-full">
              <h3 className="text-xl font-bold mb-2">Large Business</h3>
              <p className="text-gray-300 text-sm mb-2">Premium large business plans</p>
              <div className="flex items-baseline mb-6">
                <span className="text-[#c9a52c] text-4xl font-bold">$399</span>
                <span className="text-gray-300 ml-2 text-sm">one-time</span>
              </div>
              
              <div className="flex-grow space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Everything in Base Access</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Large business plan collection</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Enterprise expansion strategies</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-[#c9a52c] mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Market domination frameworks</span>
                </div>
              </div>
              
              <Link to="/pricing" className="secondary-button block text-center">
                Choose Plan
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Premium Features</h2>
            <p className="text-gray-300">Designed to enhance your reading and business planning experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Feature 1 */}
            <div className="text-center">
              <Book className="mx-auto text-[#c9a52c] mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Interactive Reading</h3>
              <p className="text-gray-300 text-sm">
                Adjustable font size, night mode, scroll/pagination options, highlighting, and note-taking features.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center">
              <LayoutGrid className="mx-auto text-[#c9a52c] mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Business Plan Marketplace</h3>
              <p className="text-gray-300 text-sm">
                Browse and unlock premium business plans for different business sizes with detailed, structured guidance.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center">
              <Moon className="mx-auto text-[#c9a52c] mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Night Mode</h3>
              <p className="text-gray-300 text-sm">
                Comfortable reading experience in low-light environments with our customizable dark theme.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 4 */}
            <div className="text-center">
              <Wifi className="mx-auto text-[#c9a52c] mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Offline Reading</h3>
              <p className="text-gray-300 text-sm">
                Cache content for offline access. Recently opened books stay available without internet.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="text-center">
              <MonitorSmartphone className="mx-auto text-[#c9a52c] mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Modern UI/UX</h3>
              <p className="text-gray-300 text-sm">
                Clean, modern interface with smooth animations and easy navigation for a seamless reading experience.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="text-center">
              <Smartphone className="mx-auto text-[#c9a52c] mb-4" size={40} />
              <h3 className="text-xl font-bold mb-3">Mobile-Friendly</h3>
              <p className="text-gray-300 text-sm">
                Responsive design optimized for reading on any device, from desktop to smartphone.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* TILKTIBEB Footer Section - This now uses the global Footer component in Layout.tsx */}
      <section className="py-6 px-6 md:px-10 bg-[#2d1e14] border-t border-[#4a2e1c]/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Book className="text-[#c9a52c]" size={24} />
            <h2 className="text-xl font-bold text-white">TILKTIBEB</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Premium business book summaries and business plans with a one-time payment.
          </p>
          <p className="text-sm text-gray-400">
            © 2025 TILKTIBEB. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
