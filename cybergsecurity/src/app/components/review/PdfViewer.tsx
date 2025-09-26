
import { FileText } from 'lucide-react';
import { useFileContext } from '../../contexts/FileContext';

const PdfViewer = () => {
  const { currentFile } = useFileContext();

  if (!currentFile) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>No document selected</p>
        </div>
      </div>
    );
  }

  if (currentFile.format === 'pdf') {
    return (
      <div className="h-full bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">{currentFile.name}</h3>
        </div>
        <div className="h-full p-4 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <FileText size={48} className="mx-auto mb-4" />
            <p>PDF Viewer</p>
            <p className="text-sm">{currentFile.originalName}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">{currentFile.name}</h3>
        <p className="text-sm text-slate-500">{currentFile.format.toUpperCase()} Document</p>
      </div>
      <div className="p-4 h-full overflow-y-auto">
        <div 
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: typeof currentFile.content === 'string' ? currentFile.content : '' }}
        />
      </div>
    </div>
  );
};

export default PdfViewer;