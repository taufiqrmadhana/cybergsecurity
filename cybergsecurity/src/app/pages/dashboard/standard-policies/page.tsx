'use client';

import { useState, useEffect, useMemo, useRef } from 'react';

import { TableToolbar } from '@/app/components/policies/TableToolbar';
import { DataTable, type ColumnDef } from '@/app/components/policies/DataTable';
import { DocumentPreview } from '@/app/components/policies/DocumentPreview';
import { useOnClickOutside } from '@/app/hooks/useOnclickOutside';

export interface Document {
  id: string; 
  title: string;
  description: string;
  category: string; 
  createdAt: string;
  updatedAt: string;
  filePath: string;
}

export interface BackendContract {
  id: number; 
  title: string;
  description: string;
  file_path: string; 
  jenis_kontrak: string; 
  created_by: string;
  created_at: string; 
  updated_at: string; 
}


const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formatDate = (isoDate: string): string => {
  if (!isoDate) return '';
  return new Date(isoDate).toISOString().split('T')[0];
};

const mapBackendToDocument = (item: BackendContract): Document => ({
  id: item.id.toString(),
  title: item.title,
  description: item.description || '',
  category: item.jenis_kontrak || 'Lainnya', 
  createdAt: formatDate(item.created_at),
  updatedAt: formatDate(item.updated_at),
  filePath: item.file_path || '',
});

export default function StandardPoliciesPage() {
  const [allDocumentsData, setAllDocumentsData] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [isFilterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(filterRef, () => setFilterOpen(false));

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!API_URL) {
        setError("Konfigurasi API URL hilang.");
        setIsLoading(false);
        return;
      }

      const authToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null; 

      if (!authToken) {
        setError("Autentikasi diperlukan. Silakan login terlebih dahulu.");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_URL}/contracts/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          const errorDetail = await response.json().catch(() => ({}));
          throw new Error(`Gagal mengambil data: ${response.status} ${response.statusText}. Detail: ${errorDetail.detail || errorDetail.message || 'Token mungkin tidak valid/kadaluarsa.'}`);
        }

        const data = await response.json();
        
        const documents: Document[] = data.map(mapBackendToDocument);
        
        setAllDocumentsData(documents);
        setFilteredDocuments(documents);
        if (documents.length > 0) {
          setSelectedDocument(documents[0]); 
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Terjadi kesalahan saat mengambil data');
        setAllDocumentsData([]);
        setFilteredDocuments([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
        fetchDocuments();
    }
  }, []); 

  const categories = useMemo(() => [...new Set(allDocumentsData.map(doc => doc.category))], [allDocumentsData]);

  const handleCategoryChange = (category: string) => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  const clearFilters = () => {
    setSelectedCategories([]);
  };

  const columns: ColumnDef<Document>[] = [
    { accessorKey: 'title', header: 'Judul', className: 'col-span-3 font-semibold text-slate-800 group-hover:text-blue-default truncate' }, 
    { accessorKey: 'category', header: 'Kategori', className: 'col-span-5' }, 
    { accessorKey: 'createdAt', header: 'Created at', className: 'col-span-2' }, 
    { accessorKey: 'updatedAt', header: 'Updated at', className: 'col-span-2' },
  ];


  useEffect(() => {
    let filtered = allDocumentsData;
    if (searchTerm) { filtered = filtered.filter(doc => doc.title.toLowerCase().includes(searchTerm.toLowerCase())); }
    if (selectedCategories.length > 0) { filtered = filtered.filter(doc => selectedCategories.includes(doc.category)); }
    setFilteredDocuments(filtered);
    
    if (selectedDocument && !filtered.find(doc => doc.id === selectedDocument.id)) {
      setSelectedDocument(filtered.length > 0 ? filtered[0] : null);
    } else if (!selectedDocument && filtered.length > 0) {
      setSelectedDocument(filtered[0]);
    }

  }, [searchTerm, selectedCategories, allDocumentsData, selectedDocument]);

  const activeFilterCount = selectedCategories.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white rounded-xl border border-slate-200 p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-default"></div>
        <p className="mt-4 text-xl font-semibold text-slate-700">Memuat data kontrak...</p>
        <p className="text-sm text-slate-500">Mohon tunggu sebentar.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-red-50 rounded-xl border border-red-200 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-4 text-xl font-bold text-red-700">Gagal Mengambil Data 😔</p>
        <p className="mt-2 text-md text-red-600">Pesan Error: {error}</p>
        <p className="text-sm text-red-500">Pastikan Anda sudah *login* dan API *backend* berjalan dengan baik.</p>
      </div>
    );
  }
  
  if (allDocumentsData.length === 0 && !isLoading) {
      return (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] bg-white rounded-xl border border-slate-200 p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-default" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 text-xl font-bold text-slate-700">Data Kontrak Kosong</p>
              <p className="mt-2 text-md text-slate-500">Tidak ada kebijakan standar yang ditemukan di *backend* saat ini.</p>
          </div>
      );
  }

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
                  {/* Div Workflow Status Dihapus */}
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