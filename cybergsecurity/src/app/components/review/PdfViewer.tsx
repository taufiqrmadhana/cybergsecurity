'use client';

// URL PDF bisa tetap di sini atau dipindahkan ke props nanti
const pdfUrl = "https://www.datocms-assets.com/160653/1758899941-untitled-document-1.pdf";

const PDFViewer = () => {
  return (
    // Wrapper ini akan mengisi seluruh area (width & height 100%)
    // yang diberikan oleh parent-nya di EditorPanel.
    <div className="w-full h-full bg-white rounded-lg shadow-inner overflow-hidden">
        <iframe
            src={pdfUrl}
            // Iframe juga dibuat mengisi 100% dari parent div-nya.
            // Scrollbar sekarang HANYA akan ada di dalam iframe ini.
            className="w-full h-full border-none"
            title="PDF Document"
        />
    </div>
  );
};

export default PDFViewer;