'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { TableToolbar } from '@/app/components/policies/TableToolbar';
import { DataTable, type ColumnDef } from '@/app/components/policies/DataTable';
import { DocumentPreview } from '@/app/components/policies/DocumentPreview';
import type { Document } from '@/app/types/document';
import { useOnClickOutside } from '@/app/hooks/useOnclickOutside';

const allDocumentsData: Document[] = [
  { id: 'STD-001', title: 'Perjanjian Layanan Cloud', createdAt: '2025-09-15', updatedAt: '2025-09-20', category: 'Layanan TI', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'Accepted' },
  { id: 'STD-002', title: 'Kontrak Pengadaan ATK', createdAt: '2025-09-12', updatedAt: '2025-09-18', category: 'Pengadaan', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'Accepted' },
  { id: 'STD-003', title: 'Kerangka Kemitraan Strategis', createdAt: '2025-08-25', updatedAt: '2025-09-10', category: 'Kemitraan', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'On Review' },
  { id: 'STD-004', title: 'Regulasi Logistik & Pengiriman', createdAt: '2025-08-10', updatedAt: '2025-09-05', category: 'Logistik', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'On Verification' },
  { id: 'STD-005', title: 'SOP Jasa Kepelabuhan', createdAt: '2025-07-30', updatedAt: '2025-08-20', category: 'Kepelabuhan', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'New' },
  { id: 'STD-006', title: 'NDA untuk Vendor TI', createdAt: '2025-07-20', updatedAt: '2025-08-15', category: 'Layanan TI', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'Conflict' },
  { id: 'STD-007', title: 'Perjanjian Sewa Gudang', createdAt: '2025-06-15', updatedAt: '2025-07-01', category: 'Logistik', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'Accepted' },
  { id: 'STD-008', title: 'Kontrak Jasa Konsultan', createdAt: '2025-06-10', updatedAt: '2025-06-25', category: 'Kemitraan', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'On Review' },
  { id: 'STD-009', title: 'Panduan Pengadaan Software', createdAt: '2025-05-20', updatedAt: '2025-06-10', category: 'Pengadaan', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'New' },
  { id: 'STD-010', title: 'Tarif Layanan Bongkar Muat', createdAt: '2025-05-01', updatedAt: '2025-05-15', category: 'Kepelabuhan', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'Accepted' },
  { id: 'STD-011', title: 'Perjanjian Lisensi Merek', createdAt: '2025-04-18', updatedAt: '2025-04-28', category: 'Kemitraan', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'On Verification' },
  { id: 'STD-012', title: 'Kontrak Pemeliharaan Sistem IT', createdAt: '2025-04-10', updatedAt: '2025-04-22', category: 'Layanan TI', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', workflow: 'Accepted' },
];

const workflowColorMap: { [key: string]: string } = {
  'New': 'bg-blue-100 text-blue-800',
  'On Verification': 'bg-sky-100 text-sky-800',
  'On Review': 'bg-amber-100 text-amber-800',
  'Conflict': 'bg-red-100 text-red-800',
  'Accepted': 'bg-green-100 text-green-800',
};

export default function StandardPoliciesPage() {
  const [filteredDocuments, setFilteredDocuments] = useState(allDocumentsData);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(allDocumentsData[0]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);

  const [isFilterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(filterRef, () => setFilterOpen(false));

  const categories = useMemo(() => [...new Set(allDocumentsData.map(doc => doc.category))], []);
  const workflows = useMemo(() => ['New', 'On Verification', 'On Review', 'Conflict', 'Accepted'], []);
  
  const handleCategoryChange = (category: string) => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  const handleWorkflowChange = (workflow: string) => setSelectedWorkflows(prev => prev.includes(workflow) ? prev.filter(w => w !== workflow) : [...prev, workflow]);
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedWorkflows([]);
  };

  const columns: ColumnDef<Document>[] = [
    { accessorKey: 'title', header: 'Judul', className: 'col-span-3 font-semibold text-slate-800 group-hover:text-blue-default truncate' },
    { accessorKey: 'category', header: 'Kategori', className: 'col-span-2' },
    { 
      accessorKey: 'workflow', 
      header: 'Workflow', 
      className: 'col-span-3',
      cell: (row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${workflowColorMap[row.workflow]}`}>
          {row.workflow}
        </span>
      )
    },
    { accessorKey: 'createdAt', header: 'Created at', className: 'col-span-2' },
    { accessorKey: 'updatedAt', header: 'Updated at', className: 'col-span-2' },
  ];

  useEffect(() => {
    let filtered = allDocumentsData;
    if (searchTerm) { filtered = filtered.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase())); }
    if (selectedCategories.length > 0) { filtered = filtered.filter(doc => selectedCategories.includes(doc.category)); }
    if (selectedWorkflows.length > 0) { filtered = filtered.filter(doc => selectedWorkflows.includes(doc.workflow)); }
    setFilteredDocuments(filtered);
  }, [searchTerm, selectedCategories, selectedWorkflows]);

  const activeFilterCount = selectedCategories.length + selectedWorkflows.length;

  return (
    <div className="flex h-full gap-2">
      <div className="w-2/3 flex flex-col">
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col h-full">
          <div className="relative" ref={filterRef}>
            <TableToolbar 
              searchTerm={searchTerm} 
              onSearchChange={setSearchTerm}
              onFilterClick={() => setFilterOpen(!isFilterOpen)}
            />
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-10">
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Category</h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {categories.map((category) => (
                        <label key={category} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-default focus:ring-blue-default" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)}/>
                          {category}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-slate-200"></div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Workflow Status</h4>
                    <div className="space-y-2">
                      {workflows.map((workflow) => (
                        <label key={workflow} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-default focus:ring-blue-default" checked={selectedWorkflows.includes(workflow)} onChange={() => handleWorkflowChange(workflow)}/>
                          {workflow}
                        </label>
                      ))}
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <>
                      <div className="border-t border-slate-200"></div>
                      <button onClick={clearFilters} className="w-full text-center text-sm text-red-400 font-semibold hover:underline cursor-pointer">Clear all filters</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          <DataTable
            data={filteredDocuments}
            columns={columns}
            selectedItem={selectedDocument}
            onSelectItem={setSelectedDocument}
            gridClassName="grid-cols-12"
          />
        </div>
      </div>
      <div className="w-1/3 flex flex-col">
        <DocumentPreview document={selectedDocument} />
      </div>
    </div>
  );
}