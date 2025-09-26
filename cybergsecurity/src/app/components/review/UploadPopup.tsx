'use client';

import { useRef, useState } from 'react';
import { useOnClickOutside } from '@/app/hooks/useOnclickOutside';
import { UploadCloud, File, X } from 'lucide-react';

interface UploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadPopup = ({ isOpen, onClose }: UploadPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useOnClickOutside(popupRef, onClose);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-14 right-4 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-20
                 origin-top-right animate-scale-in-ver-top"
    >
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-800">Upload Document</h3>
        <p className="text-xs text-slate-500">Upload a new version or document</p>
      </div>
      <div className="p-4">
        {!selectedFile ? (
          <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center">
            <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
            <p className="text-sm font-semibold text-slate-600">Drag & drop files here</p>
            <p className="text-xs text-slate-500">or</p>
            <label className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
              click to browse
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <div className="flex items-center gap-3">
              <File className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={handleRemoveFile} className="p-1 text-slate-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <button className="w-full mt-4 bg-blue-700 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer">
          Upload File
        </button>
      </div>
    </div>
  );
};