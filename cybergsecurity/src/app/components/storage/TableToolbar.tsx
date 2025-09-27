'use client';

import { Search, Filter, UploadCloud, Table, LayoutList } from 'lucide-react'; 
import React from 'react';

const ViewToggle = ({ currentMode, setMode }) => {
  const buttonClass = (mode: string) => 
    `p-2 text-sm font-medium rounded-md transition-colors 
     ${currentMode === mode 
        ? 'bg-white text-indigo-600 shadow-md' 
        : 'text-slate-700 hover:bg-slate-200'}`;

  return (
    <div className="flex space-x-0 p-1 bg-slate-100 rounded-xl border border-slate-200">
      <button 
        onClick={() => setMode('tabular')} 
        className={buttonClass('tabular')}
        aria-label="Table View"
      >
        <Table className="h-5 w-5" />
      </button>
      <button 
        onClick={() => setMode('kanban')} 
        className={buttonClass('kanban')}
        aria-label="Kanban View"
      >
        <LayoutList className="h-5 w-5" />
      </button>
    </div>
  );
};

interface TableToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick: () => void; 
  viewMode: 'tabular' | 'kanban';
  onViewModeChange: (mode: 'tabular' | 'kanban') => void;
  onUploadClick: () => void;
}

export const TableToolbar = ({ 
  searchTerm, 
  onSearchChange, 
  onFilterClick,
  viewMode,
  onViewModeChange,
  onUploadClick
}: TableToolbarProps) => {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for document title, category, or status..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      
      </div>

      <div className="flex items-center gap-4">
        
        <ViewToggle 
            currentMode={viewMode} 
            setMode={onViewModeChange} 
        />

        <button
          onClick={onUploadClick}
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <UploadCloud className="h-5 w-5" />
          <span>Upload File</span>
        </button>
      </div>
    </div>
  );
};