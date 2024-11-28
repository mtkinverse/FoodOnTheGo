'use client'

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
    onSearch(term);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full px-6 py-3 text-gray-700 bg-white rounded-xl shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out pr-12
                   border-2 border-purple-500"
          aria-label="Search restaurants"
        />
        <div className="absolute right-0 inset-y-0 flex items-center pr-3">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
