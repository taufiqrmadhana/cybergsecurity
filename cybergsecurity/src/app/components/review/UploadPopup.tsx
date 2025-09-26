import { Upload } from 'lucide-react';
import { useFileContext } from '../../contexts/FileContext';

interface UploadPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadPopup = ({ isOpen, onClose }: UploadPopupProps) => {
  const { triggerFileInput, isLoading } = useFileContext();

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-lg shadow-lg p-4 w-64 z-10">
      <h3 className="font-semibold text-sm mb-3">Upload Document</h3>
      <button
        onClick={() => {
          triggerFileInput();
          onClose();
        }}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
      >
        <Upload size={16} className="mr-2" />
        {isLoading ? 'Processing...' : 'Choose File'}
      </button>
      <div className="mt-3 text-xs text-slate-500">
        Supports: DOCX, PDF, RTF, TXT, HTML
      </div>
    </div>
  );
};