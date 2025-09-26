import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import { AlignCenter, AlignLeft, AlignRight, Bold, FileText, FolderOpen, Highlighter, Italic, List, ListOrdered, Palette, Plus, Redo, Save, Underline, Undo, Upload } from 'lucide-react';
import * as mammoth from 'mammoth';
import { useEffect, useRef, useState } from 'react';

const WordEditor = () => {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('document');
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isLoading, setIsLoading] = useState(false);
  const [hasDocument, setHasDocument] = useState(false);
  const [history, setHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFF00');
  const [isSaved, setIsSaved] = useState(true);
  const [originalFormat, setOriginalFormat] = useState('html');

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const landingFileInputRef = useRef(null);
  const colorInputRef = useRef(null);
  const bgColorInputRef = useRef(null);

  useEffect(() => {
    if (content) {
      setIsSaved(false);
    }
  }, [content]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleUndo = () => {
    if (historyIndex > 0 && editorRef.current) {
      const newIndex = historyIndex - 1;
      editorRef.current.innerHTML = history[newIndex];
      setContent(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && editorRef.current) {
      const newIndex = historyIndex + 1;
      editorRef.current.innerHTML = history[newIndex];
      setContent(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const processDocxContent = (html) => {
    let processed = html;
    processed = processed.replace(/<p[^>]*>/gi, '<p>');
    processed = processed.replace(/<span[^>]*>/gi, '<span>');
    processed = processed.replace(/<o:p\s*\/?>|<\/o:p>/gi, '');
    if (!processed.includes('<p>') && !processed.includes('<br>')) {
      processed = processed.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('');
    }
    return processed;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    let htmlContent = '';
    let fileFormat = 'html';
    try {
      if (file.name.endsWith('.docx')) {
        fileFormat = 'docx';
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        htmlContent = processDocxContent(result.value);
      } else if (file.name.endsWith('.txt')) {
        fileFormat = 'txt';
        const text = await file.text();
        htmlContent = text.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('');
      } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
        fileFormat = 'html';
        const rawHtml = await file.text();
        const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        htmlContent = bodyMatch ? bodyMatch[1] : rawHtml;
      } else if (file.name.endsWith('.rtf')) {
        fileFormat = 'rtf';
        const text = await file.text();
        htmlContent = text
          .replace(/\\par/g, '</p><p>')
          .replace(/\\b\s/g, '<b>')
          .replace(/\\b0\s/g, '</b>')
          .replace(/\\i\s/g, '<i>')
          .replace(/\\i0\s/g, '</i>')
          .replace(/\\ul\s/g, '<u>')
          .replace(/\\ulnone\s/g, '</u>')
          .replace(/\{[^}]*\}/g, '')
          .replace(/\\/g, '');
        htmlContent = `<p>${htmlContent}</p>`;
      }
      setContent(htmlContent);
      setFileName(file.name.replace(/\.[^/.]+$/, ''));
      setOriginalFormat(fileFormat);
      setHasDocument(true);
      setHistory([htmlContent]);
      setHistoryIndex(0);
      setIsSaved(true);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = htmlContent;
          editorRef.current.focus();
        }
      }, 100);
    } catch (err) {
      alert('Failed to load file. Please try again.');
    }
    setIsLoading(false);
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleSave = () => {
    handleSaveDocs();
  };

  const handleSaveDocs = () => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body>${content}</body>
      </html>
    `;
    const blob = htmlDocx.asBlob(html);
    saveAs(blob, `${fileName}_edited.docx`);
    setIsSaved(true);
  };

  const handleNew = () => {
    if (!isSaved && content) {
      if (!confirm('You have unsaved changes. Continue without saving?')) return;
    }
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
    setContent('');
    setFileName('document');
    setOriginalFormat('html');
    setHasDocument(true);
    setHistory(['']);
    setHistoryIndex(0);
    setIsSaved(true);
  };

  const getStats = () => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    return { words, chars };
  };

  const stats = getStats();

  if (!hasDocument) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FileText size={40} className="text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleNew}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
            >
              <Plus size={20} className="mr-2" />
              Create New Document
            </button>
            <div className="relative">
              <input
                ref={landingFileInputRef}
                type="file"
                accept=".docx,.txt,.html,.htm,.rtf"
                onChange={handleFileUpload}
                className="hidden"
                id="landing-file-input"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('landing-file-input');
                  if (input) input.click();
                }}
                disabled={isLoading}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:border-blue-400 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
              >
                <FolderOpen size={20} className="mr-2" />
                {isLoading ? 'Loading...' : 'Open Existing Document'}
              </button>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            Supports: DOCX, RTF, TXT, HTML
          </div>
        </div>
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 shadow-2xl">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-700 font-medium">Processing document...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{fileName}</span>
              {!isSaved && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Unsaved</span>}
            </div>
            <div className="text-sm text-gray-500">
              {stats.words} words • {stats.chars} characters
            </div>
          </div>
        </div>
        <div className="px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button onClick={handleNew} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="New">
              <FileText size={18} />
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Open">
              <Upload size={18} />
            </button>
            <button 
              onClick={handleSave} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 font-medium flex items-center" 
              title="Save as Word"
            >
              <Save size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.txt,.html,.htm,.rtf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button onClick={handleUndo} disabled={historyIndex <= 0} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30" title="Undo">
              <Undo size={18} />
            </button>
            <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30" title="Redo">
              <Redo size={18} />
            </button>
          </div>
          <div className="flex items-center space-x-2 pr-4 border-r">
            <select value={fontFamily} onChange={(e) => { setFontFamily(e.target.value); executeCommand('fontName', e.target.value); }} className="px-3 py-1.5 border rounded-lg text-sm">
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Calibri">Calibri</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
            </select>
            <select value={fontSize} onChange={(e) => { setFontSize(e.target.value); if (editorRef.current) editorRef.current.style.fontSize = e.target.value + 'px'; }} className="px-3 py-1.5 border rounded-lg text-sm">
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="24">24</option>
              <option value="28">28</option>
              <option value="32">32</option>
            </select>
          </div>
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button onClick={() => executeCommand('bold')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Bold"><Bold size={18} /></button>
            <button onClick={() => executeCommand('italic')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Italic"><Italic size={18} /></button>
            <button onClick={() => executeCommand('underline')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Underline"><Underline size={18} /></button>
          </div>
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button onClick={() => colorInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Text Color"><Palette size={18} /></button>
            <input ref={colorInputRef} type="color" value={textColor} onChange={(e) => { setTextColor(e.target.value); executeCommand('foreColor', e.target.value); }} className="hidden"/>
            <button onClick={() => bgColorInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Highlight"><Highlighter size={18} /></button>
            <input ref={bgColorInputRef} type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); executeCommand('backColor', e.target.value); }} className="hidden"/>
          </div>
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button onClick={() => executeCommand('justifyLeft')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Align Left"><AlignLeft size={18} /></button>
            <button onClick={() => executeCommand('justifyCenter')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Center"><AlignCenter size={18} /></button>
            <button onClick={() => executeCommand('justifyRight')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Align Right"><AlignRight size={18} /></button>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => executeCommand('insertUnorderedList')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Bullet List"><List size={18} /></button>
            <button onClick={() => executeCommand('insertOrderedList')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Numbered List"><ListOrdered size={18} /></button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div ref={editorRef} contentEditable onInput={handleInput} className="min-h-[700px] bg-white shadow-xl rounded-lg p-16 outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" style={{fontFamily: fontFamily,fontSize: fontSize + 'px',lineHeight: '1.8'}} placeholder="Start typing your document..."/>
        </div>
      </div>
    </div>
  );
};

export default WordEditor;
