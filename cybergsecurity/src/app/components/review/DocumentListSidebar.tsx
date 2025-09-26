// src/app/components/review/DocumentListSidebar.tsx
'use client';

import { FileText, AlertTriangle } from 'lucide-react';

const newDocuments = [
  { id: 'doc-a', name: 'Dokumen A' },
  { id: 'doc-b', name: 'Dokumen B' },
  { id: 'doc-c', name: 'Dokumen C' },
];

const conflictingDocuments = [
  { id: 'std-01', name: 'Dokumen Standar' },
  { id: 'law-01', name: 'Undang - Undang' },
];

export const DocumentListSidebar = () => {
  // State untuk melacak item yang aktif. Ganti dengan logika props jika diperlukan.
  const activeItemId = 'doc-a'; 

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-50 border-r border-slate-200 p-4">
      <nav className="flex flex-col space-y-6">
        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            New Documents
          </h3>
          <div className="flex flex-col space-y-1">
            {newDocuments.map((doc) => (
              <a
                key={doc.id}
                href="#"
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeItemId === doc.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>{doc.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Conflicting Documents
          </h3>
          <div className="flex flex-col space-y-1">
            {conflictingDocuments.map((doc) => (
              <a
                key={doc.id}
                href="#"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>{doc.name}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
};