'use client';

import { Search } from 'lucide-react';
import type { Document } from '@/app/types/document';

interface DocumentTableProps {
  documents: Document[];
  selectedDocument: Document | null;
  onSelectDocument: (document: Document) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const DocumentTable = ({
  documents,
  selectedDocument,
  onSelectDocument,
  searchTerm,
  onSearchChange,
}: DocumentTableProps) => {
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
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] text-black"
          />
        </div>
      </div>

      {/* Area Tabel (Scrollable) */}
      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        {/* Header Tabel */}
        <div className="grid grid-cols-12 gap-4 sticky top-0 bg-slate-50 p-3 rounded-t-lg text-sm font-semibold text-slate-600 border-b">
          <div className="col-span-2">ID Standar</div>
          <div className="col-span-4">Judul</div>
          <div className="col-span-2">Created at</div>
          <div className="col-span-2">Updated at</div>
          <div className="col-span-2">Kategori</div>
        </div>
        {/* Body Tabel */}
        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className={`grid grid-cols-12 gap-4 p-3 cursor-pointer transition-colors group ${
                selectedDocument?.id === doc.id ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="col-span-2 text-sm text-slate-500">{doc.id}</div>
              <div className="col-span-4 text-sm font-semibold text-slate-800 group-hover:text-blue-default">{doc.title}</div>
              <div className="col-span-2 text-sm text-slate-500">{doc.createdAt}</div>
              <div className="col-span-2 text-sm text-slate-500">{doc.updatedAt}</div>
              <div className="col-span-2 text-sm text-slate-500">{doc.category}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};