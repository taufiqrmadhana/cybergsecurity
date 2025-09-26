'use client';

import { useState } from 'react';
import PDFViewer from './PdfViewer';
import { VersionHistoryPopup } from './VersionHistoryPopup';
import { UploadPopup } from './UploadPopup';
import { NotePopup } from './NotePopup'; 
import { Clock, Upload, NotebookPen } from 'lucide-react';

export const EditorPanel = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false); 

  const closeAllPopups = () => {
    setIsHistoryOpen(false);
    setIsUploadOpen(false);
    setIsNotesOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900">Editor</h2>
        
        <div className="relative flex items-center gap-2">
          <button 
            onClick={() => {
              closeAllPopups();
              setIsNotesOpen(true);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Tambah Catatan"
          >
            <NotebookPen className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => {
              closeAllPopups();
              setIsHistoryOpen(true);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Riwayat Versi"
          >
            <Clock className="h-5 w-5" />
          </button>
          
          {/* Tombol Upload */}
          <button 
            onClick={() => {
              closeAllPopups();
              setIsUploadOpen(true);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Unggah Dokumen"
          >
            <Upload className="h-5 w-5" />
          </button>

          <VersionHistoryPopup isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
          <UploadPopup isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
          
          {/* Komponen NotePopup baru */}
          <NotePopup isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-4">
        <PDFViewer />
      </div>
    </div>
  );
};