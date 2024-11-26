import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Automatically trigger search on every change
  };

  return (
    <div className="mb-8 w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full px-5 py-3 text-gray-700 bg-white border-2 border-purple-300 rounded-full shadow-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 ease-in-out pr-12"
          aria-label="Search restaurants"
        />
        <button
          type="button"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
          aria-label="Search icon"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
