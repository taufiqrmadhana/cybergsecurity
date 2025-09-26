'use client';

import { Search, Filter } from 'lucide-react'; 

interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick: () => void; 
}

export const TableToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  onFilterClick 
}: TableToolbarProps) => {
  return (
    <div className="flex items-center gap-4 mb-4 flex-shrink-0">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search for..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-black w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-default)]"
        />
      </div>
      <button 
        onClick={onFilterClick} 
        className="hover:bg-[var(--color-blue-default)] bg-[var(--color-blue-dark)] text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-dark transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
      </button>
    </div>
  );
};