import React from 'react';
import { BookOpen, LayoutGrid, MonitorSmartphone, Moon, Smartphone, Wifi } from 'lucide-react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h1>
          <p className="text-lg text-gray-300">Everything you need to enhance your business knowledge</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Interactive Reading */}
          <div className="bg-[#3a2819] rounded-xl p-6 text-center">
            <BookOpen className="mx-auto text-[#c9a52c] mb-4" size={40} />
            <h3 className="text-xl font-bold mb-3">Interactive Reading</h3>
            <p className="text-gray-300">
              Adjustable font size, night mode, scroll/pagination options, highlighting, and note-taking features.
            </p>
          </div>
          
          {/* Business Plan Marketplace */}
          <div className="bg-[#3a2819] rounded-xl p-6 text-center">
            <LayoutGrid className="mx-auto text-[#c9a52c] mb-4" size={40} />
            <h3 className="text-xl font-bold mb-3">Business Plan Marketplace</h3>
            <p className="text-gray-300">
              Browse and unlock premium business plans for different business sizes with detailed, structured guidance.
            </p>
          </div>
          
          {/* Night Mode */}
          <div className="bg-[#3a2819] rounded-xl p-6 text-center">
            <Moon className="mx-auto text-[#c9a52c] mb-4" size={40} />
            <h3 className="text-xl font-bold mb-3">Night Mode</h3>
            <p className="text-gray-300">
              Comfortable reading experience in low-light environments with our customizable dark theme.
            </p>
          </div>
          
          {/* Offline Reading */}
          <div className="bg-[#3a2819] rounded-xl p-6 text-center">
            <Wifi className="mx-auto text-[#c9a52c] mb-4" size={40} />
            <h3 className="text-xl font-bold mb-3">Offline Reading</h3>
            <p className="text-gray-300">
              Cache last-read content for offline access. Recently opened books stay available without internet.
            </p>
          </div>
          
          {/* Modern UI/UX */}
          <div className="bg-[#3a2819] rounded-xl p-6 text-center">
            <MonitorSmartphone className="mx-auto text-[#c9a52c] mb-4" size={40} />
            <h3 className="text-xl font-bold mb-3">Modern UI/UX</h3>
            <p className="text-gray-300">
              Clean, modern interface with smooth animations and easy navigation for a seamless reading experience.
            </p>
          </div>
          
          {/* Mobile-Friendly */}
          <div className="bg-[#3a2819] rounded-xl p-6 text-center">
            <Smartphone className="mx-auto text-[#c9a52c] mb-4" size={40} />
            <h3 className="text-xl font-bold mb-3">Mobile-Friendly</h3>
            <p className="text-gray-300">
              Responsive design optimized for reading on any device, from desktop to smartphone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
