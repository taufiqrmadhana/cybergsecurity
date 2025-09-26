import type { Document } from '@/app/types/document';

interface DocumentPreviewProps {
  document: Document | null;
}

export const DocumentPreview = ({ document }: DocumentPreviewProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
      <h3 className="font-bold text-lg text-slate-800 mb-4 flex-shrink-0">Document Preview</h3>
      
      {document ? (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-96 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center flex-shrink-0">
            <p className="text-slate-400 font-medium">PREVIEW PDF</p>
          </div>
          
          <div className="flex-1 overflow-y-auto mt-6 pr-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <span className="text-slate-500">Nama</span>
              <span className="font-semibold text-slate-800 text-right break-words">{document.title}</span>

              <span className="text-slate-500">Deskripsi</span>
              <span className="font-semibold text-slate-800 text-right break-words">{document.description}</span>

              <span className="text-slate-500">Last Updated</span>
              <span className="font-semibold text-slate-800 text-right">{document.updatedAt}</span>

              <span className="text-slate-500">Kategori</span>
              <span className="font-semibold text-slate-800 text-right">{document.category}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-slate-50 rounded-lg">
          <p className="text-slate-500">Select a document to see the preview</p>
        </div>
      )}
    </div>
  );
};