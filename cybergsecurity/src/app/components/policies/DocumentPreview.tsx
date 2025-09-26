import type { Document } from '@/app/types/document';

interface DocumentPreviewProps {
  document: Document | null;
}

export const DocumentPreview = ({ document }: DocumentPreviewProps) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col">
      <h3 className="font-bold text-lg text-slate-800 mb-4 flex-shrink-0">
        Document Preview
      </h3>

      {document ? (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-96 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-center flex-shrink-0">
            <p className="text-slate-400 font-medium">PREVIEW PDF</p>
          </div>

          <div className="flex-1 overflow-y-auto mt-4 pr-2">
            <div className="grid grid-cols-[auto,1fr] gap-x-3 text-sm items-start">
              {/* Nama */}
              <span className="text-black font-semibold">Nama</span>
              <span className="text-slate-800 break-words pb-2">
                {document.title}
              </span>

              {/* Kategori */}
              <span className="text-black font-semibold">Kategori</span>
              <span className="text-slate-800 break-words pb-2">
                {document.category}
              </span>

              {/* Deskripsi */}
              <span className="text-black font-semibold">Deskripsi</span>
              <span className="text-slate-800 break-words whitespace-pre-line pb-2">
                {document.description}
              </span>
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
