import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, Check, Coffee, Download, Laptop, LayoutGrid, MonitorSmartphone, Moon, Play, Smartphone, Star, Wifi, AlertCircle, CheckCircle } from 'lucide-react';
import { getAllBookSummaries } from '../services/bookSummaryService';
import { getAllBusinessPlans } from '../services/businessPlanService';
import { subscribeToNewsletter } from '../services/newsletterService';

const HomePage: React.FC = () => {
  // State for dynamic content
  const [bookSummaries, setBookSummaries] = useState<any[]>([]);
  const [businessPlans, setBusinessPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    books: true,
    plans: true,
    newsletter: false
  });
  const [error, setError] = useState({
    books: null as string | null,
    plans: null as string | null,
    newsletter: null as string | null
  });

  // Newsletter form state
  const [newsletterForm, setNewsletterForm] = useState({
    email: '',
    name: ''
  });
  const [newsletterSuccess, setNewsletterSuccess] = useState<string | null>(null);

  // Fetch book summaries and business plans
  useEffect(() => {
    const fetchData = async () => {
      // Fetch book summaries
      try {
        const bookResponse = await getAllBookSummaries();
        if (bookResponse.success) {
          setBookSummaries(bookResponse.data);
        } else {
          setError(prev => ({ ...prev, books: bookResponse.message || 'Failed to fetch book summaries' }));
        }
      } catch (err: any) {
        setError(prev => ({ ...prev, books: err.message || 'An error occurred while fetching book summaries' }));
      } finally {
        setLoading(prev => ({ ...prev, books: false }));
      }

      // Fetch business plans
      try {
        const planResponse = await getAllBusinessPlans();
        if (planResponse.success) {
          setBusinessPlans(planResponse.data);
        } else {
          setError(prev => ({ ...prev, plans: planResponse.message || 'Failed to fetch business plans' }));
        }
      } catch (err: any) {
        setError(prev => ({ ...prev, plans: err.message || 'An error occurred while fetching business plans' }));
      } finally {
        setLoading(prev => ({ ...prev, plans: false }));
      }
    };

    fetchData();
  }, []);
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
              <button
                onClick={() => {
                  // In a real implementation, this would open a modal with a video player
                  alert('Video demo would play in a modal here');
                }}
                className="block bg-[#c9a52c] text-[#2d1e14] font-medium py-2 px-4 rounded-md text-center mb-4 w-full"
              >
                <Play size={16} className="inline mr-2" />
                Watch Demo
              </button>
              <div className="aspect-video bg-[#3a2819] rounded-xl overflow-hidden relative group cursor-pointer"
                onClick={() => {
                  // In a real implementation, this would open a modal with a video player
                  alert('Video demo would play in a modal here');
                }}
              >
                {/* Replace with an actual thumbnail image */}
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  alt="Demo video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={48} className="text-[#c9a52c]" />
                </div>
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
            {loading.books ? (
              // Loading state
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="glass-card overflow-hidden animate-pulse">
                  <div className="h-48 bg-[#3a2819] flex items-center justify-center">
                    <Book size={32} className="text-[#4a2e1c]" />
                  </div>
                  <div className="p-4">
                    <div className="h-4 bg-[#4a2e1c] rounded w-16 mb-2"></div>
                    <div className="h-5 bg-[#4a2e1c] rounded w-3/4 mb-1"></div>
                    <div className="h-4 bg-[#4a2e1c] rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-[#4a2e1c] rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : error.books ? (
              // Error state
              <div className="col-span-full text-center py-4">
                <p className="text-red-400">{error.books}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-[#c9a52c] text-[#2d1e14] rounded-md"
                >
                  Retry
                </button>
              </div>
            ) : bookSummaries.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-4">
                <p className="text-gray-400">No book summaries found</p>
              </div>
            ) : (
              // Display book summaries
              bookSummaries.slice(0, 4).map((book) => (
                <Link to={`/books/${book.id}`} key={book.id} className="glass-card overflow-hidden block hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-[#3a2819] overflow-hidden">
                    {book.cover_image ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-book.jpg';
                        }}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <Book size={32} className="text-[#c9a52c]" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="bg-[#c9a52c] text-[#2d1e14] text-xs px-2 py-0.5 rounded inline-block mb-2">
                      {book.price > 0 ? 'Premium' : 'Free'}
                    </div>
                    <h3 className="text-lg font-bold mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-300 mb-2 line-clamp-1">{book.author}</p>
                    <div className="flex items-center">
                      <Star size={16} fill="#c9a52c" className="text-[#c9a52c]" />
                      <span className="ml-1 text-sm">4.8</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
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
            {loading.plans ? (
              // Loading state
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="glass-card p-6 animate-pulse">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-[#4a2e1c] rounded-full"></div>
                      <div className="h-6 bg-[#4a2e1c] rounded w-1/2"></div>
                    </div>
                    <div className="h-4 bg-[#4a2e1c] rounded w-full mb-2"></div>
                    <div className="h-4 bg-[#4a2e1c] rounded w-3/4"></div>
                  </div>
                  <div className="h-10 bg-[#4a2e1c] rounded"></div>
                </div>
              ))
            ) : error.plans ? (
              // Error state
              <div className="col-span-full text-center py-4">
                <p className="text-red-400">{error.plans}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-[#c9a52c] text-[#2d1e14] rounded-md"
                >
                  Retry
                </button>
              </div>
            ) : businessPlans.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-4">
                <p className="text-gray-400">No business plans found</p>
              </div>
            ) : (
              // Display business plans (grouped by size/type)
              <>
                {/* Small Business Card */}
                <div className="glass-card p-6">
                  <div className="mb-4">
                    <h3 className="flex items-center gap-2 text-xl font-bold mb-2">
                      <Coffee size={20} className="text-[#c9a52c]" />
                      <span>Small Business</span>
                    </h3>
                    <p className="text-gray-300">
                      {businessPlans.filter(plan => plan.industry?.toLowerCase().includes('small')).length} plans for solopreneurs and small teams looking to start a business with minimal investment.
                    </p>
                  </div>
                  <Link to="/business-plans?type=small" className="gold-button block text-center">
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
                      {businessPlans.filter(plan => plan.industry?.toLowerCase().includes('medium')).length} plans for growing businesses looking to scale operations and increase market share.
                    </p>
                  </div>
                  <Link to="/business-plans?type=medium" className="gold-button block text-center">
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
                      {businessPlans.filter(plan => plan.industry?.toLowerCase().includes('large')).length} plans for established companies seeking expansion and optimization.
                    </p>
                  </div>
                  <Link to="/business-plans?type=large" className="gold-button block text-center">
                    Explore Plans
                  </Link>
                </div>
              </>
            )}
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

      {/* Testimonials Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">What Our Users Say</h2>
            <p className="text-gray-300">Trusted by entrepreneurs and business professionals worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Testimonial 1 */}
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#3a2819] flex items-center justify-center mr-3">
                  <span className="text-[#c9a52c] font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-sm text-gray-400">Startup Founder</p>
                </div>
              </div>
              <p className="text-gray-300 mb-3">
                "The book summaries saved me countless hours. I can quickly absorb key business concepts without reading entire books."
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="#c9a52c" className="text-[#c9a52c]" />
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#3a2819] flex items-center justify-center mr-3">
                  <span className="text-[#c9a52c] font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-bold">Jane Smith</h4>
                  <p className="text-sm text-gray-400">Marketing Director</p>
                </div>
              </div>
              <p className="text-gray-300 mb-3">
                "The business plans are incredibly detailed and practical. I used one to secure funding for my new venture."
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="#c9a52c" className="text-[#c9a52c]" />
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-[#3a2819] flex items-center justify-center mr-3">
                  <span className="text-[#c9a52c] font-bold">RJ</span>
                </div>
                <div>
                  <h4 className="font-bold">Robert Johnson</h4>
                  <p className="text-sm text-gray-400">Business Consultant</p>
                </div>
              </div>
              <p className="text-gray-300 mb-3">
                "I recommend TilkTibeb to all my clients. The one-time payment model is refreshing in a world of endless subscriptions."
              </p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={16} fill="#c9a52c" className="text-[#c9a52c]" />
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/pricing" className="gold-button inline-block">
              Join Thousands of Satisfied Users
            </Link>
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

      {/* FAQ Section */}
      <section className="py-12 px-6 md:px-10 bg-[#2d1e14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-300">Everything you need to know about our service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* FAQ Item 1 */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-2">What is included in the one-time payment?</h3>
              <p className="text-gray-300">
                Your one-time payment gives you lifetime access to our entire library of book summaries and business plans. This includes all future updates and additions to our content library.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-2">Are there any recurring fees or subscriptions?</h3>
              <p className="text-gray-300">
                No. We believe in transparent pricing. You pay once and get lifetime access to all our content. There are no hidden fees or recurring charges.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-2">Can I access the content offline?</h3>
              <p className="text-gray-300">
                Yes. Our offline reading feature allows you to download content for reading without an internet connection. Perfect for travel or areas with limited connectivity.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-bold mb-2">How often is new content added?</h3>
              <p className="text-gray-300">
                We add new book summaries and business plans every month. Our team is constantly working to bring you the latest and most valuable business content.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-300 mb-4">Still have questions?</p>
            <Link to="/contact" className="secondary-button inline-block">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 px-6 md:px-10 bg-[#3a2819]">
        <div className="max-w-6xl mx-auto">
          <div className="glass-card p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Stay Updated</h2>
                <p className="text-gray-300 mb-4">
                  Subscribe to our newsletter to receive updates on new book summaries, business plans, and exclusive content.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                    <span className="text-gray-300">New book summary notifications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                    <span className="text-gray-300">Business tips and insights</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={18} className="text-[#c9a52c] flex-shrink-0 mt-1" />
                    <span className="text-gray-300">Exclusive subscriber-only content</span>
                  </li>
                </ul>
              </div>

              <div>
                {newsletterSuccess ? (
                  <div className="bg-green-900/30 border border-green-500/50 text-green-200 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={20} className="text-green-400" />
                      <h3 className="font-bold">Success!</h3>
                    </div>
                    <p>{newsletterSuccess}</p>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={async (e) => {
                    e.preventDefault();

                    if (!newsletterForm.email || !newsletterForm.name) {
                      setError(prev => ({ ...prev, newsletter: 'Please fill in all fields' }));
                      return;
                    }

                    setLoading(prev => ({ ...prev, newsletter: true }));
                    setError(prev => ({ ...prev, newsletter: null }));

                    try {
                      const response = await subscribeToNewsletter(newsletterForm.email, newsletterForm.name);
                      if (response.success) {
                        setNewsletterSuccess(response.message);
                        setNewsletterForm({ email: '', name: '' });
                      } else {
                        setError(prev => ({ ...prev, newsletter: response.message }));
                      }
                    } catch (err: any) {
                      setError(prev => ({ ...prev, newsletter: err.message || 'An error occurred' }));
                    } finally {
                      setLoading(prev => ({ ...prev, newsletter: false }));
                    }
                  }}>
                    {error.newsletter && (
                      <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-md flex items-start gap-2">
                        <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{error.newsletter}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-2 bg-[#2d1e14] border border-[#7a4528]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c9a52c] text-white"
                        value={newsletterForm.email}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Your Name"
                        className="w-full px-4 py-2 bg-[#2d1e14] border border-[#7a4528]/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c9a52c] text-white"
                        value={newsletterForm.name}
                        onChange={(e) => setNewsletterForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="gold-button w-full flex items-center justify-center"
                      disabled={loading.newsletter}
                    >
                      {loading.newsletter ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2d1e14] mr-2"></div>
                          Subscribing...
                        </>
                      ) : 'Subscribe'}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                )}
              </div>
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
