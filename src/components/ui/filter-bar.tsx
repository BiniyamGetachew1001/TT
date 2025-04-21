import React, { useState } from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface SortOption {
  label: string;
  value: string;
  direction?: 'asc' | 'desc';
}

interface FilterBarProps {
  filterOptions: FilterOption[];
  sortOptions: SortOption[];
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string, direction: 'asc' | 'desc') => void;
  activeFilter?: string;
  activeSort?: string;
  activeSortDirection?: 'asc' | 'desc';
}

/**
 * FilterBar component
 * 
 * Provides filtering and sorting options for content lists
 */
const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  sortOptions,
  onFilterChange,
  onSortChange,
  activeFilter = '',
  activeSort = '',
  activeSortDirection = 'desc'
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const handleFilterClick = (value: string) => {
    onFilterChange(value);
    setIsFilterOpen(false);
  };

  const handleSortClick = (value: string) => {
    // Toggle direction if clicking the same sort option
    const newDirection = 
      activeSort === value && activeSortDirection === 'desc' ? 'asc' : 'desc';
    
    onSortChange(value, newDirection);
    setIsSortOpen(false);
  };

  const clearFilter = () => {
    onFilterChange('');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Filter dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setIsFilterOpen(!isFilterOpen);
            setIsSortOpen(false);
          }}
          className="flex items-center gap-1 px-3 py-2 bg-[#3a2819] hover:bg-[#4a3829] rounded-md transition-colors"
        >
          <Filter size={16} />
          <span>Filter</span>
          {activeFilter && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#c9a52c] text-[#2d1e14] rounded-full">
              1
            </span>
          )}
        </button>

        {isFilterOpen && (
          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#2d1e14] ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterClick(option.value)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    activeFilter === option.value
                      ? 'bg-[#4a3829] text-white'
                      : 'text-gray-200 hover:bg-[#3a2819]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setIsSortOpen(!isSortOpen);
            setIsFilterOpen(false);
          }}
          className="flex items-center gap-1 px-3 py-2 bg-[#3a2819] hover:bg-[#4a3829] rounded-md transition-colors"
        >
          <ArrowUpDown size={16} />
          <span>Sort</span>
          {activeSort && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#c9a52c] text-[#2d1e14] rounded-full">
              {activeSortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </button>

        {isSortOpen && (
          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-[#2d1e14] ring-1 ring-black ring-opacity-5 z-10">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortClick(option.value)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    activeSort === option.value
                      ? 'bg-[#4a3829] text-white'
                      : 'text-gray-200 hover:bg-[#3a2819]'
                  }`}
                >
                  {option.label}
                  {activeSort === option.value && (
                    <span className="float-right">
                      {activeSortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active filter indicator */}
      {activeFilter && (
        <div className="flex items-center gap-1 px-2 py-1 bg-[#3a2819] rounded-md">
          <span className="text-sm">
            {filterOptions.find(opt => opt.value === activeFilter)?.label || activeFilter}
          </span>
          <button
            onClick={clearFilter}
            className="p-0.5 hover:bg-[#4a3829] rounded-full transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
