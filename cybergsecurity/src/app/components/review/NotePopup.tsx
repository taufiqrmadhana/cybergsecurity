'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Toast from '../ui/Toast'; 

interface NotePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotePopup: React.FC<NotePopupProps> = ({ isOpen, onClose }) => {
  const [noteContent, setNoteContent] = useState('');
  const [showToast, setShowToast] = useState(false);
  const handleSave = () => {
    console.log('Catatan yang Disimpan:', noteContent);   
    setShowToast(true); 
    setNoteContent('');
    onClose(); 
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  if (!isOpen && !showToast) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs" 
          onClick={onClose}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-semibold text-slate-900">Create new notes 📝</h3>
              <button 
                onClick={onClose}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                title="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write your note here..."
              rows={6}
              className="w-full p-3 border border-slate-300 rounded-md text-slate-700 resize-none focus:ring-blue-500 focus:border-blue-500"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={noteContent.trim() === ''}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Komponen Toast */}
      <Toast 
        message="Note saved successfully!" 
        show={showToast} 
        onClose={handleCloseToast} 
      />
    </>
  );
};