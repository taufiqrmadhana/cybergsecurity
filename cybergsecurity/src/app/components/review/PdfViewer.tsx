"use client"

import { ExternalLink, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useState } from 'react';

const PDFViewer: React.FC = () => {
  const [zoom, setZoom] = useState<number>(100);
  
  const pdfUrl = "https://www.datocms-assets.com/160653/1758899941-untitled-document-1.pdf";
  
  const handleZoom = (action: 'in' | 'out' | 'reset') => {
    if (action === 'in') {
      setZoom(prev => Math.min(prev + 25, 200));
    } else if (action === 'out') {
      setZoom(prev => Math.max(prev - 25, 50));
    } else {
      setZoom(100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-800">Document Viewer</h1>
                <p className="text-sm text-slate-500 mt-1">Untitled Document</p>
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center bg-slate-50 rounded-lg p-1">
                  <button
                    onClick={() => handleZoom('out')}
                    className="p-2 hover:bg-white rounded-md transition-colors"
                    disabled={zoom <= 50}
                  >
                    <ZoomOut size={16} className={zoom <= 50 ? 'text-slate-300' : 'text-slate-600'} />
                  </button>
                  
                  <span className="px-3 py-1 text-sm font-medium text-slate-700 min-w-16 text-center">
                    {zoom}%
                  </span>
                  
                  <button
                    onClick={() => handleZoom('in')}
                    className="p-2 hover:bg-white rounded-md transition-colors"
                    disabled={zoom >= 200}
                  >
                    <ZoomIn size={16} className={zoom >= 200 ? 'text-slate-300' : 'text-slate-600'} />
                  </button>
                </div>
                
                <button
                  onClick={() => handleZoom('reset')}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Reset zoom"
                >
                  <RotateCcw size={16} className="text-slate-600" />
                </button>
                
                <a 
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink size={16} className="text-slate-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 sm:p-6">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <div 
                  className="bg-white rounded-lg shadow-lg overflow-hidden mx-auto transition-transform duration-200"
                  style={{ 
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top center',
                    width: '100%'
                  }}
                >
                  <iframe
                    src={pdfUrl}
                    className="w-full border-none"
                    style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}
                    title="PDF Document"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;