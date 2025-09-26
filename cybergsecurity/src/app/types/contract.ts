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

export interface Contract {
  id: string;
  title: string;
  deadline: string;
  category: ContractCategory;
  status: ContractStatus;
}