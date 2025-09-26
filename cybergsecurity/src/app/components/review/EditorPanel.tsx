"use client";

import { Clock, Upload } from 'lucide-react';
import { useState } from 'react';
import { useFileContext } from '../../contexts/FileContext';
import PdfViewer from './PdfViewer';
import { UploadPopup } from './UploadPopup';
import { VersionHistoryPopup } from './VersionHistoryPopup';

export const EditorPanel = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { currentFile } = useFileContext();

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-lg font-semibold text-slate-900">
          Editor {currentFile && `- ${currentFile.name}`}
        </h2>
        
        <div className="relative flex items-center gap-2">
          <button 
            onClick={() => {
              setIsHistoryOpen(!isHistoryOpen);
              setIsUploadOpen(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Clock className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => {
              setIsUploadOpen(!isUploadOpen);
              setIsHistoryOpen(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Upload className="h-5 w-5" />
          </button>

          <VersionHistoryPopup isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
          <UploadPopup isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </div>
      </div>
      
      <div className="flex-1 bg-slate-50 p-4">
        <PdfViewer />
      </div>
    </div>
  );
};