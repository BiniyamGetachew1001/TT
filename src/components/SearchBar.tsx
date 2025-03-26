import React from 'react';
import { Search } from 'lucide-react';

const SearchBar: React.FC = () => {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search for books"
        className="glass-input w-full rounded-md py-2 pl-9 pr-3 text-sm text-white placeholder-gray-400 input-glow"
      />
    </div>
  );
};

export default SearchBar;
