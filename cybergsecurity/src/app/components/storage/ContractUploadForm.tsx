// components/storage/ContractUploadForm.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/Button'; 
import { Input } from '../ui/Input'; 
import { Modal } from '../ui/Modal'; 
import type { ContractCategory } from '@/app/types/contract'; 

interface ContractUploadFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const ENDPOINTS = {
    CONTRACT_CREATE: `${API_BASE_URL}/contracts/`,
    SESSION_CREATE: `${API_BASE_URL}/sessions/`,
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

const CATEGORY_OPTIONS: Record<ContractCategory, string> = {
    "LAYANAN_TEKNOLOGI_INFORMASI": 'Layanan Teknologi Informasi',
    "PENGADAAN_BARANG_JASA": 'Pengadaan Barang Jasa',
    "KEMITRAAN_GLOBAL": 'Kemitraan Global',
    "INTEGRASI_LOGISTIK": 'Integrasi Logistik',
    "JASA_KEPELABUHAN_DIGITAL": 'Jasa Kepelabuhan Digital',
};

export const ContractUploadForm = ({ isOpen, onClose, onSuccess }: ContractUploadFormProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [jenisKontrak, setJenisKontrak] = useState<ContractCategory>('LAYANAN_TEKNOLOGI_INFORMASI');
    const [dueDate, setDueDate] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleReset = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setFile(null);
        setJenisKontrak('LAYANAN_TEKNOLOGI_INFORMASI');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file || !title || !jenisKontrak || !dueDate) {
            setError('Please fill all required fields and select a file.');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            // STEP 1: UPLOAD KONTRAK DAN FILE (POST /api/contracts)
            const contractFormData = new FormData();
            contractFormData.append('title', title);
            contractFormData.append('description', description);
            contractFormData.append('jenis_kontrak', jenisKontrak);
            contractFormData.append('file', file);

            const contractResponse = await api.post(ENDPOINTS.CONTRACT_CREATE, contractFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newContractId = contractResponse.data.id;
            
            // STEP 2: BUAT SESI (POST /api/sessions)
            const sessionPayload = {
                contract_id: newContractId,
                current_version_id: null,
                summary: `Initial session for contract: ${title}`,
                due_date: dueDate,
                risk_status: 'COMPLY',
                status: 'NEW',
            };

            await api.post(ENDPOINTS.SESSION_CREATE, sessionPayload);
            
            // *Langkah 3 (Buat Session Reference) DIHAPUS*

            handleReset();
            onSuccess();
            onClose();

        } catch (err) {
            console.error('Submission Error:', err);
            let errorMessage = 'Failed to submit contract. Network error or server issues.';
            if (axios.isAxiosError(err) && err.response?.data?.detail) {
                errorMessage = err.response.data.detail;
            } else if (axios.isAxiosError(err) && err.response?.status) {
                errorMessage = `Server Error (${err.response.status}): Could not process one of the steps.`;
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Upload New Contract Document">
            <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                <Input
                    id="title"
                    label="Contract Title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <Input
                    id="description"
                    label="Description"
                    type="textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <div>
                    <label htmlFor="jenisKontrak" className="block text-sm font-medium text-gray-700 mb-1">
                        Contract Category
                    </label>
                    <select
                        id="jenisKontrak"
                        required
                        value={jenisKontrak}
                        onChange={(e) => setJenisKontrak(e.target.value as ContractCategory)}
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {Object.entries(CATEGORY_OPTIONS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    id="dueDate"
                    label="Due Date"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />

                <div>
                    <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                        Contract File
                    </label>
                    <Input
                        id="file"
                        type="file"
                        required
                        onChange={handleFileChange}
                    />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Uploading...' : 'Upload & Create Contract'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};