'use client';

import { useState, useEffect } from 'react';
import { DocumentTable, type ColumnDef } from '@/app/components/policies/DocumentTable';
import { DocumentPreview } from '@/app/components/policies/DocumentPreview';
import type { Document } from '@/app/types/document';

const allDocumentsData: Document[] = [
  { id: 'STD-001', title: 'Perjanjian Layanan Cloud Tingkat Lanjut', createdAt: '2025-09-15', updatedAt: '2025-09-20', category: 'Layanan TI', description: 'Perjanjian standar untuk semua layanan cloud yang disediakan untuk klien enterprise.' },
  { id: 'STD-002', title: 'Kontrak Pengadaan ATK', createdAt: '2025-09-12', updatedAt: '2025-09-18', category: 'Pengadaan', description: 'Kontrak standar untuk pengadaan alat tulis kantor tahunan.' },
  { id: 'STD-003', title: 'Kerangka Kemitraan Strategis Global', createdAt: '2025-08-25', updatedAt: '2025-09-10', category: 'Kemitraan', description: 'Dokumen kerangka kerja untuk kemitraan strategis dengan partner internasional.' },
  { id: 'STD-004', title: 'Regulasi Logistik & Pengiriman Internal', createdAt: '2025-08-10', updatedAt: '2025-09-05', category: 'Logistik', description: 'Regulasi internal untuk proses logistik dan pengiriman barang.' },
  { id: 'STD-005', title: 'SOP Jasa Kepelabuhan Digital', createdAt: '2025-07-30', updatedAt: '2025-08-20', category: 'Kepelabuhan', description: 'Standar Operasional Prosedur untuk layanan digital di pelabuhan.' },
  { id: 'STD-006', title: 'NDA untuk Vendor Teknologi Informasi', createdAt: '2025-07-20', updatedAt: '2025-08-15', category: 'Layanan TI', description: 'Non-Disclosure Agreement standar untuk semua vendor teknologi.' },
  { id: 'STD-007', title: 'Perjanjian Sewa Gudang Logistik', createdAt: '2025-06-15', updatedAt: '2025-07-01', category: 'Logistik', description: 'Kontrak sewa untuk fasilitas gudang logistik di berbagai lokasi.' },
  { id: 'STD-008', title: 'Kontrak Jasa Konsultan Keuangan', createdAt: '2025-06-10', updatedAt: '2025-06-25', category: 'Kemitraan', description: 'Perjanjian kerja sama dengan konsultan keuangan eksternal.' },
  { id: 'STD-009', title: 'Panduan Pengadaan Software Baru', createdAt: '2025-05-20', updatedAt: '2025-06-10', category: 'Pengadaan', description: 'Panduan dan syarat ketentuan untuk pengadaan software baru.' },
  { id: 'STD-010', title: 'Tarif Layanan Bongkar Muat 2025', createdAt: '2025-05-01', updatedAt: '2025-05-15', category: 'Kepelabuhan', description: 'Dokumen tarif resmi untuk semua layanan bongkar muat di pelabuhan.' },
  { id: 'STD-011', title: 'Perjanjian Lisensi Penggunaan Merek', createdAt: '2025-04-18', updatedAt: '2025-04-28', category: 'Kemitraan', description: 'Perjanjian lisensi untuk penggunaan merek dagang oleh pihak ketiga.' },
  { id: 'STD-012', title: 'Kontrak Pemeliharaan Sistem IT', createdAt: '2025-04-10', updatedAt: '2025-04-22', category: 'Layanan TI', description: 'Kontrak tahunan untuk pemeliharaan semua sistem internal.' },
  { id: 'STD-013', title: 'Perjanjian Lisensi Penggunaan Merek', createdAt: '2025-04-18', updatedAt: '2025-04-28', category: 'Kemitraan', description: 'Perjanjian lisensi untuk penggunaan merek dagang oleh pihak ketiga.' },
  { id: 'STD-014', title: 'Kontrak Pemeliharaan Sistem IT', createdAt: '2025-04-10', updatedAt: '2025-04-22', category: 'Layanan TI', description: 'Kontrak tahunan untuk pemeliharaan semua sistem internal.' },
];

export default function StandardPoliciesPage() {
  const [filteredDocuments, setFilteredDocuments] = useState(allDocumentsData);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(allDocumentsData[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const columns: ColumnDef<Document>[] = [
    { 
      accessorKey: 'id', 
      header: 'ID Standar', 
      className: 'col-span-2'
    },
    { 
      accessorKey: 'title', 
      header: 'Judul', 
      className: 'col-span-4 font-semibold text-slate-800 group-hover:text-blue-default truncate',
    },
    { 
      accessorKey: 'createdAt', 
      header: 'Created at', 
      className: 'col-span-2' 
    },
    { 
      accessorKey: 'updatedAt', 
      header: 'Updated at', 
      className: 'col-span-2' 
    },
    { 
      accessorKey: 'category', 
      header: 'Kategori', 
      className: 'col-span-1' 
    },
  ];

  useEffect(() => {
    const filtered = allDocumentsData.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocuments(filtered);
  }, [searchTerm]);

  return (
    <div className="flex h-full gap-2">
      <div className="w-2/3 flex flex-col">
        <DocumentTable
          data={filteredDocuments}
          columns={columns}
          selectedItem={selectedDocument}
          onSelectItem={setSelectedDocument}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          gridClassName="grid-cols-12" 
        />
      </div>
      <div className="w-1/3 flex flex-col">
        <DocumentPreview document={selectedDocument} />
      </div>
    </div>
  );
}