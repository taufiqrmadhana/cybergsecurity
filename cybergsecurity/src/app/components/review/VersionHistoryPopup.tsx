import { useFileContext } from '../../contexts/FileContext';

interface VersionHistoryPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistoryPopup = ({ isOpen, onClose }: VersionHistoryPopupProps) => {
  const { files, currentFile, switchToFile, deleteFile } = useFileContext();

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-12 bg-white border border-slate-200 rounded-lg shadow-lg w-80 max-h-96 overflow-y-auto z-10">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-sm">Document History</h3>
      </div>
      <div className="p-2">
        {files.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">
            No documents uploaded yet
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.id}
              className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                currentFile?.id === file.id 
                  ? 'bg-blue-50 border border-blue-200' 
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => {
                switchToFile(file.id);
                onClose();
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-900">{file.name}</div>
                  <div className="text-xs text-slate-500">
                    {file.format.toUpperCase()} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                  className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};