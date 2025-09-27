export type ContractStatus = 
    | "NEW" 
    | "ON_VERIFICATION" 
    | "ON_REVIEW" 
    | "ACCEPTED" 
    | "CONFLICT";

export type RiskStatus = 
    | "COMPLY" 
    | "RISK";

export type ContractCategory = 
    | "LAYANAN_TEKNOLOGI_INFORMASI" 
    | "PENGADAAN_BARANG_JASA" 
    | "KEMITRAAN_GLOBAL" 
    | "INTEGRASI_LOGISTIK" 
    | "JASA_KEPELABUHAN_DIGITAL";

export interface Session {
    id: number;
    contract_id: number;
    current_version_id: number;
    summary: string;
    due_date: string;
    risk_status: RiskStatus;
    status: ContractStatus;
    created_at: string;
    updated_at: string;
}

export interface Contract {
    id: number;
    title: string;
    category: ContractCategory;
    deadline: string;
    status: ContractStatus;
    
    description: string;
    file_path: string;
    created_by: string;
    
    session_id: number; 
}