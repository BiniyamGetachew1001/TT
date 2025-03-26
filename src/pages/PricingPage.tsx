import React from 'react';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-gray-300">One-time payment for lifetime access to premium business content</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Base Access Plan */}
          <div className="bg-[#3a2819] rounded-xl p-6 flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-2">Base Access</h3>
            <p className="text-gray-300 mb-2">One-time payment for lifetime access</p>
            <div className="flex items-baseline mb-6">
              <span className="text-[#c9a52c] text-4xl font-bold">$99</span>
              <span className="text-gray-300 ml-2">one-time</span>
            </div>
            
            <div className="flex-grow space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>200+ business book summaries</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>20 free business ideas</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Interactive reading system</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Offline reading mode</span>
              </div>
            </div>
            
            <button className="gold-button w-full">Get Started</button>
          </div>
          
          {/* Small Business Plan */}
          <div className="bg-[#3a2819] rounded-xl p-6 flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-2">Small Business</h3>
            <p className="text-gray-300 mb-2">Premium small business plans</p>
            <div className="flex items-baseline mb-6">
              <span className="text-[#c9a52c] text-4xl font-bold">$149</span>
              <span className="text-gray-300 ml-2">one-time</span>
            </div>
            
            <div className="flex-grow space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Everything in Base Access</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Small business plan collection</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Low investment requirements</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Solopreneur-friendly</span>
              </div>
            </div>
            
            <button className="secondary-button w-full">Choose Plan</button>
          </div>
          
          {/* Medium Business Plan */}
          <div className="bg-[#3a2819] rounded-xl p-6 flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-2">Medium Business</h3>
            <p className="text-gray-300 mb-2">Premium medium business plans</p>
            <div className="flex items-baseline mb-6">
              <span className="text-[#c9a52c] text-4xl font-bold">$249</span>
              <span className="text-gray-300 ml-2">one-time</span>
            </div>
            
            <div className="flex-grow space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Everything in Base Access</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Medium business plan collection</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Scaling strategies</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Team management frameworks</span>
              </div>
            </div>
            
            <button className="secondary-button w-full">Choose Plan</button>
          </div>
          
          {/* Large Business Plan */}
          <div className="bg-[#3a2819] rounded-xl p-6 flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-2">Large Business</h3>
            <p className="text-gray-300 mb-2">Premium large business plans</p>
            <div className="flex items-baseline mb-6">
              <span className="text-[#c9a52c] text-4xl font-bold">$399</span>
              <span className="text-gray-300 ml-2">one-time</span>
            </div>
            
            <div className="flex-grow space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Everything in Base Access</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Large business plan collection</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Enterprise expansion strategies</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="text-[#c9a52c] mt-0.5 flex-shrink-0" size={20} />
                <span>Market domination frameworks</span>
              </div>
            </div>
            
            <button className="secondary-button w-full">Choose Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
