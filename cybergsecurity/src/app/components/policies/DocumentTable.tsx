'use client';

import { Search } from 'lucide-react';

export type ColumnDef<T> = {
  accessorKey: keyof T;
  header: string;
  className?: string; 
  cell?: (row: T) => React.ReactNode; 
};

interface DocumentTableProps<T extends { id: string | number }> {
  data: T[];
  columns: ColumnDef<T>[];
  selectedItem: T | null;
  onSelectItem: (item: T) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  gridClassName: string; 
}

export const DocumentTable = <T extends { id: string | number }>({
  data,
  columns,
  selectedItem,
  onSelectItem,
  searchTerm,
  onSearchChange,
  gridClassName,
}: DocumentTableProps<T>) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col h-full">
      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-4 flex-shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search for..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-default"
          />
        </div>
      </div>

      {/* Area Tabel */}
      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        <div className={`grid ${gridClassName} gap-4 sticky top-0 bg-slate-50 p-3 rounded-t-lg text-sm font-semibold text-slate-600 border-b`}>
          {columns.map((col) => (
            <div key={String(col.accessorKey)} className={col.className}>
              {col.header}
            </div>
          ))}
        </div>
        {/* Body Tabel */}
        <div className="divide-y divide-slate-100">
            {data.map((item) => (
                <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className={`grid ${gridClassName} gap-4 p-3 cursor-pointer transition-colors group ${
                    selectedItem?.id === item.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
                >
                {columns.map((col) => (
                    <div key={String(col.accessorKey)} className={`${col.className} text-sm text-slate-500 min-w-0`}>
                    {col.cell ? col.cell(item) : String(item[col.accessorKey])}
                    </div>
                ))}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};