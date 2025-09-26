'use client';

import React, { useState, useEffect } from 'react';
import { DocumentPreview } from '@/app/components/policies/DocumentPreview'; 
import { KanbanBoard } from '@/app/components/storage/KanbanBoard'; 
import { DataTable, ColumnDef } from '@/app/components/policies/DataTable'; 
import { TableToolbar } from '@/app/components/storage/TableToolbar'; 
// import { Search, Filter, UploadCloud, Table, LayoutList } from 'lucide-react'; 

export type ContractStatus = 
  | "NEW" 
  | "ON_VERIFICATION" 
  | "ON_REVIEW" 
  | "ACCEPTED" 
  | "CONFLICT";

export type ContractCategory = 
  | "LAYANAN_TEKNOLOGI_INFORMASI" 
  | "PENGADAAN_BARANG_JASA" 
  | "KEMITRAAN_GLOBAL" 
  | "INTEGRASI_LOGISTIK" 
  | "JASA_KEPELABUHAN_DIGITAL";

export type Contract = {
    id: number | string;
    title: string;
    description: string;
    updatedAt: string;
    category: ContractCategory;
    status: ContractStatus;
    deadline: string;
};

const initialContracts: Contract[] = [
    { id: 1, title: 'Kontrak Integrasi Payment Gateway', description: 'Perjanjian layanan teknologi untuk integrasi pembayaran.', updatedAt: '2025-09-25', deadline: '2025-10-15', category: 'LAYANAN_TEKNOLOGI_INFORMASI', status: 'ON_VERIFICATION' },
    { id: 2, title: 'Perjanjian Pengadaan Server A', description: 'Dokumen pengadaan untuk infrastruktur server baru.', updatedAt: '2025-09-20', deadline: '2025-09-30', category: 'PENGADAAN_BARANG_JASA', status: 'NEW' },
    { id: 3, title: 'MoU Kemitraan Pelabuhan Eropa', description: 'Nota kesepahaman dengan mitra global di Eropa.', updatedAt: '2025-09-15', deadline: '2025-11-01', category: 'KEMITRAAN_GLOBAL', status: 'ON_REVIEW' },
    { id: 4, title: 'Kontrak Layanan Digital Maritim', description: 'Perjanjian penyediaan jasa kepelabuhan digital.', updatedAt: '2025-09-10', deadline: '2025-10-25', category: 'JASA_KEPELABUHAN_DIGITAL', status: 'CONFLICT' },
];

const getCategoryDisplay = (category: ContractCategory) => {
  return category.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
};

interface TableViewProps {
    data: Contract[];
    selectedContract: Contract | null;
    onSelectContract: (contract: Contract) => void;
}

const contractColumns: ColumnDef<Contract>[] = [
    {
        accessorKey: 'title',
        header: 'Document Title',
        className: 'col-span-4',
    },
    {
        accessorKey: 'category',
        header: 'Category',
        className: 'col-span-3',
        cell: (row) => (
            <span className="font-medium text-blue-600">
                {getCategoryDisplay(row.category)}
            </span>
        ),
    },
    {
        accessorKey: 'deadline',
        header: 'Deadline',
        className: 'col-span-2',
        cell: (row) => (
             <span className="font-medium text-slate-700">
                {row.deadline}
             </span>
        ),
    },
    {
        accessorKey: 'status',
        header: 'Status',
        className: 'col-span-3',
        cell: (row) => (
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                {row.status.replace('_', ' ')}
            </span>
        )
    },
];

const TableView = ({ data, selectedContract, onSelectContract }: TableViewProps) => {
    return (
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden min-h-0">
            <DataTable
                data={data}
                columns={contractColumns}
                selectedItem={selectedContract}
                onSelectItem={onSelectContract}
                gridClassName="grid-cols-12 col-span-3 col-span-2 col-span-3"
            />
        </div>
    );
};

const StoragePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('tabular'); 
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleSelectContract = (contract: Contract) => {
        setSelectedContract(contract);
    };

    const handleUpdateContractStatus = (contractId: number | string, newStatus: ContractStatus) => {
        setContracts(prevContracts => 
            prevContracts.map(contract => 
                Number(contract.id) === Number(contractId) 
                    ? { ...contract, status: newStatus } 
                    : contract
            )
        );
        if (selectedContract && Number(selectedContract.id) === Number(contractId)) {
            setSelectedContract(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handleUploadClick = () => {
        alert('Upload Modal/Function Triggered!');
    };

    useEffect(() => {
        setTimeout(() => {
            setContracts(initialContracts);
            setSelectedContract(initialContracts[0] || null);
            setIsLoading(false);
        }, 800);
    }, []);

    return (
        <div className="flex min-h-screen bg-white">
            
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="flex flex-col h-full min-h-[calc(100vh-64px)]"> 

                    <TableToolbar 
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onFilterClick={() => alert('Filter Modal Triggered!')}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        onUploadClick={handleUploadClick}
                    />

                    <div className={`flex flex-1 mt-4 ${viewMode === 'tabular' ? 'space-x-6' : ''}`}> 
                    
                        <div className="flex flex-col flex-1 min-w-0">
                            {isLoading ? (
                                <div className="text-center p-10 text-slate-500">Loading contracts...</div>
                            ) : (
                                <div className="flex-1 overflow-hidden">
                                    {viewMode === 'kanban' ? (
                                        <KanbanBoard 
                                            contracts={contracts} 
                                            onSelectContract={handleSelectContract}
                                            onUpdateStatus={handleUpdateContractStatus}
                                        />
                                    ) : (
                                        <TableView 
                                            data={contracts}
                                            selectedContract={selectedContract}
                                            onSelectContract={handleSelectContract}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {viewMode === 'tabular' && (
                            <div className="w-[30rem] flex-shrink-0">
                                <DocumentPreview contract={selectedContract} />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StoragePage;