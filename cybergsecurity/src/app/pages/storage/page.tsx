'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DocumentPreview } from '@/app/components/policies/DocumentPreview';
import { KanbanBoard } from '@/app/components/storage/KanbanBoard';
import { DataTable, ColumnDef } from '@/app/components/policies/DataTable';
import { TableToolbar } from '@/app/components/storage/TableToolbar';
import { ContractUploadForm } from '@/app/components/storage/ContractUploadForm';
import axios from 'axios';
import { useRouter } from 'next/navigation';

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
    id: number;
    title: string;
    description: string;
    updatedAt: string;
    category: ContractCategory;
    status: ContractStatus;
    deadline: string;
    session_id: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const CONTRACTS_ENDPOINT = `${API_BASE_URL}/contracts`;
const SESSIONS_ENDPOINT = `${API_BASE_URL}/sessions`;

type SessionMinimal = {
    id: number;
    contract_id: number;
    due_date: string;
    status: ContractStatus;
};

type SortKey = 'title' | 'deadline' | 'status';
type SortDirection = 'asc' | 'desc';

const CATEGORY_OPTIONS: ContractCategory[] = [
    "LAYANAN_TEKNOLOGI_INFORMASI", 
    "PENGADAAN_BARANG_JASA", 
    "KEMITRAAN_GLOBAL", 
    "INTEGRASI_LOGISTIK", 
    "JASA_KEPELABUHAN_DIGITAL"
];

const STATUS_OPTIONS: ContractStatus[] = [
    "NEW", 
    "ON_VERIFICATION", 
    "ON_REVIEW", 
    "ACCEPTED", 
    "CONFLICT"
];

const getCategoryDisplay = (category: ContractCategory) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const api = axios.create();
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

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
            <div className="max-h-full overflow-y-auto">
                <DataTable
                    data={data}
                    columns={contractColumns}
                    selectedItem={selectedContract}
                    onSelectItem={onSelectContract}
                    gridClassName="grid-cols-12 col-span-3 col-span-2 col-span-3"
                />
            </div>
        </div>
    );
};

const StoragePage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('tabular'); 
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const [sortKey, setSortKey] = useState<SortKey>('deadline');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [filterStatus, setFilterStatus] = useState<ContractStatus | 'ALL'>('ALL');
    const [filterCategory, setFilterCategory] = useState<ContractCategory | 'ALL'>('ALL');


    const fetchAndMergeData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const [contractsResponse, sessionsResponse] = await Promise.all([
                api.get<any[]>(CONTRACTS_ENDPOINT),
                api.get<SessionMinimal[]>(SESSIONS_ENDPOINT)
            ]);
            
            const sessionsData = sessionsResponse.data;
            
            const sessionMap = sessionsData.reduce((acc, session) => {
                if (!acc[session.contract_id]) {
                    acc[session.contract_id] = session;
                }
                return acc;
            }, {} as Record<number, SessionMinimal>);

            const mergedData: Contract[] = contractsResponse.data.map(contract => {
                const session = sessionMap[contract.id];
                
                const defaultContract: Contract = {
                    id: contract.id,
                    title: contract.title,
                    description: contract.description,
                    updatedAt: contract.updated_at ? contract.updated_at.split('T')[0] : 'N/A',
                    category: contract.jenis_kontrak || 'LAYANAN_TEKNOLOGI_INFORMASI',
                    deadline: '2099-12-31',
                    status: 'NEW', 
                    session_id: 0,
                };

                if (!session) return defaultContract;

                return {
                    ...defaultContract,
                    category: contract.jenis_kontrak,
                    deadline: session.due_date.split('T')[0], 
                    status: session.status,
                    session_id: session.id,
                } as Contract;
            });
            
            setContracts(mergedData);
            if (!selectedContract && mergedData.length > 0) {
                setSelectedContract(mergedData[0]);
            }

        } catch (err) {
            console.error('Fetch Data Error:', err);
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                localStorage.removeItem('access_token');
                router.push('/auth/login'); 
            } else {
                setError('Failed to load data from API. Check server status and network.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [router, selectedContract]);

    useEffect(() => {
        fetchAndMergeData();
    }, [fetchAndMergeData]);

    const handleUpdateContractStatus = useCallback(async (contractId: number, newStatus: ContractStatus) => {
        const contractToUpdate = contracts.find(c => c.id === contractId);

        if (!contractToUpdate || !contractToUpdate.session_id) {
            setError('Error: Contract session ID not found for update.');
            return;
        }

        setContracts(prevContracts => 
            prevContracts.map(c => c.id === contractId ? { ...c, status: newStatus } : c)
        );
        if (selectedContract && selectedContract.id === contractId) {
            setSelectedContract(prev => prev ? { ...prev, status: newStatus } : null);
        }

        try {
            const updatePayload = { status: newStatus };
            await api.patch(`${SESSIONS_ENDPOINT}/${contractToUpdate.session_id}`, updatePayload);
            
        } catch (err) {
            console.error('Update Status Error:', err);
            setError('Failed to update contract status on the server. Data reverted.');
            fetchAndMergeData(); 
        }
    }, [contracts, selectedContract, fetchAndMergeData]);

    const processedContracts = useMemo(() => {
        let result = [...contracts];
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        result = result.filter(contract => {
            const matchesStatus = filterStatus === 'ALL' || contract.status === filterStatus;
            const matchesCategory = filterCategory === 'ALL' || contract.category === filterCategory;
            return matchesStatus && matchesCategory;
        });

        if (lowerCaseSearchTerm) {
            result = result.filter(contract => 
                contract.title.toLowerCase().includes(lowerCaseSearchTerm) ||
                contract.category.toLowerCase().replace(/_/g, ' ').includes(lowerCaseSearchTerm) ||
                contract.status.toLowerCase().replace(/_/g, ' ').includes(lowerCaseSearchTerm) ||
                contract.description.toLowerCase().includes(lowerCaseSearchTerm)
            );
        }

        result.sort((a, b) => {
            let aValue: string | number = a[sortKey];
            let bValue: string | number = b[sortKey];

            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return result;
    }, [contracts, searchTerm, sortKey, sortDirection, filterStatus, filterCategory]);

    const handleSelectContract = (contract: Contract) => {
        setSelectedContract(contract);
    };

    const handleUploadClick = () => {
        setIsUploadModalOpen(true);
    };
    
    const handleUploadSuccess = () => {
        fetchAndMergeData();
        setIsUploadModalOpen(false);
    };

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
                    
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg mb-4" role="alert">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-4 mb-4 pt-2">
                        <p className="text-sm text-slate-600">Menampilkan {processedContracts.length} kontrak.</p>
                        
                        <select 
                            value={sortKey} 
                            onChange={(e) => setSortKey(e.target.value as SortKey)}
                            className="border p-1 rounded text-sm"
                        >
                            <option value="deadline">Sort by Deadline</option>
                            <option value="title">Sort by Title</option>
                            <option value="status">Sort by Status</option>
                        </select>
                        <button 
                            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                            className="border p-1 rounded text-sm bg-slate-100 hover:bg-slate-200"
                        >
                            {sortDirection === 'asc' ? 'ASC ↑' : 'DESC ↓'}
                        </button>

                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value as ContractStatus | 'ALL')}
                            className="border p-1 rounded text-sm"
                        >
                            <option value="ALL">Filter Status: All</option>
                            {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select 
                            value={filterCategory} 
                            onChange={(e) => setFilterCategory(e.target.value as ContractCategory | 'ALL')}
                            className="border p-1 rounded text-sm"
                        >
                            <option value="ALL">Filter Category: All</option>
                            {CATEGORY_OPTIONS.map(category => (
                                <option key={category} value={category}>{getCategoryDisplay(category)}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`flex flex-1 mt-4 ${viewMode === 'tabular' ? 'space-x-6' : ''}`}> 
                    
                        <div className="flex flex-col flex-1 min-w-0 h-full">
                            {isLoading ? (
                                <div className="text-center p-10 text-slate-500">
                                    <svg className="animate-spin h-5 w-5 mr-3 inline" viewBox="0 0 24 24"></svg>
                                    Loading contracts...
                                </div>
                            ) : (
                                <div className="flex-1 overflow-hidden">
                                    {viewMode === 'kanban' ? (
                                        <KanbanBoard 
                                            contracts={processedContracts} 
                                            onSelectContract={handleSelectContract}
                                            onUpdateStatus={handleUpdateContractStatus}
                                        />
                                    ) : (
                                        <TableView 
                                            data={processedContracts}
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
            
            <ContractUploadForm
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onSuccess={handleUploadSuccess}
            />
        </div>
    );
};

export default StoragePage;