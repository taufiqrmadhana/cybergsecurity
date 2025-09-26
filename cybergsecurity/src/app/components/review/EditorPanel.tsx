'use client';

import { Clock, Upload } from 'lucide-react';
import { useState } from 'react';
import PDFViewer from './PdfViewer';
import { UploadPopup } from './UploadPopup';
import { VersionHistoryPopup } from './VersionHistoryPopup';

export const EditorPanel = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900">Editor</h2>
        
        {/* Wrapper untuk tombol dan popup agar posisinya relatif */}
        <div className="relative flex items-center gap-2">
          {/* Tombol Riwayat Versi */}
          <button 
            onClick={() => {
              setIsHistoryOpen(!isHistoryOpen);
              setIsUploadOpen(false); // Tutup popup lain saat ini dibuka
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Clock className="h-5 w-5" />
          </button>
          
          {/* Tombol Upload */}
          <button 
            onClick={() => {
              setIsUploadOpen(!isUploadOpen);
              setIsHistoryOpen(false); // Tutup popup lain saat ini dibuka
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Upload className="h-5 w-5" />
          </button>

          {/* Komponen Popup yang dirender secara kondisional */}
          <VersionHistoryPopup isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
          <UploadPopup isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-4">
        <PDFViewer />
      </div>
    </div>
  );
};