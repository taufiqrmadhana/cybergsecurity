import { saveAs } from "file-saver";
import htmlDocx from "html-docx-js/dist/html-docx";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, FileText,
  Highlighter, Italic, List, ListOrdered, Palette,
  Redo,
  Save, Underline, Undo, Upload
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFileContext } from '../../contexts/FileContext';

const WordEditor = () => {
  const { currentFile, updateFileContent, createNewFile, triggerFileInput } = useFileContext();
  const [fontSize, setFontSize] = useState('16');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [history, setHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFF00');
  const [isSaved, setIsSaved] = useState(true);

  const editorRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const bgColorInputRef = useRef<HTMLInputElement>(null);

  // Initialize content when currentFile changes
  useEffect(() => {
    if (currentFile && editorRef.current) {
      const content = typeof currentFile.content === 'string' ? currentFile.content : '';
      editorRef.current.innerHTML = content;
      setHistory([content]);
      setHistoryIndex(0);
      setIsSaved(true);
    }
  }, [currentFile]);

  useEffect(() => {
    if (currentFile?.content) {
      setIsSaved(false);
    }
  }, [currentFile?.content]);

  const handleInput = () => {
    if (!editorRef.current || !currentFile) return;
    const newContent = editorRef.current.innerHTML;
    updateFileContent(newContent);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    if (newHistory.length > 50) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const executeCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value || undefined);
    handleInput();
  };

  const handleUndo = () => {
    if (historyIndex > 0 && editorRef.current) {
      const newIndex = historyIndex - 1;
      editorRef.current.innerHTML = history[newIndex];
      updateFileContent(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1 && editorRef.current) {
      const newIndex = historyIndex + 1;
      editorRef.current.innerHTML = history[newIndex];
      updateFileContent(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const handleSave = () => {
    if (!currentFile) return;
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"></head>
      <body>${typeof currentFile.content === 'string' ? currentFile.content : ''}</body>
      </html>
    `;
    const blob = htmlDocx.asBlob(html);
    saveAs(blob, `${currentFile.name}_edited.docx`);
    setIsSaved(true);
  };

  const getStats = () => {
    if (!currentFile || typeof currentFile.content !== 'string') return { words: 0, chars: 0 };
    const text = currentFile.content.replace(/<[^>]*>/g, '').trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;
    return { words, chars };
  };

  const stats = getStats();

  // Jika tidak ada currentFile, tampilkan placeholder editor
  if (!currentFile) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header kosong tapi konsisten */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 py-2 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">No document selected</span>
              </div>
              <div className="text-sm text-gray-500">
                0 words • 0 characters
              </div>
            </div>
          </div>

          {/* Toolbar - hanya file actions yang aktif */}
          <div className="px-4 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1 pr-4 border-r">
              <button 
                onClick={createNewFile} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                title="New"
              >
                <FileText size={18} />
              </button>
              <button 
                onClick={triggerFileInput} 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
                title="Open"
              >
                <Upload size={18} />
              </button>
            </div>
            <div className="text-sm text-gray-400 italic">
              Create or upload a document to start editing
            </div>
          </div>
        </div>

        {/* Editor placeholder */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-50 to-gray-100 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="min-h-[700px] bg-white shadow-xl rounded-lg p-16 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <FileText size={64} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">No document open</p>
                <p className="text-sm">Create a new document or upload an existing one to start editing</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header dengan file info dan stats */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-2 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{currentFile.name}</span>
              {!isSaved && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                  Unsaved
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {stats.words} words • {stats.chars} characters
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-3 flex flex-wrap items-center gap-3">
          {/* File Actions */}
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button 
              onClick={createNewFile} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="New"
            >
              <FileText size={18} />
            </button>
            <button 
              onClick={triggerFileInput} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Open"
            >
              <Upload size={18} />
            </button>
            <button 
              onClick={handleSave} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-600 font-medium flex items-center" 
              title="Save as Word"
            >
              <Save size={18} />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button 
              onClick={handleUndo} 
              disabled={historyIndex <= 0} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30" 
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={historyIndex >= history.length - 1} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30" 
              title="Redo"
            >
              <Redo size={18} />
            </button>
          </div>

          {/* Font Controls */}
          <div className="flex items-center space-x-2 pr-4 border-r">
            <select 
              value={fontFamily} 
              onChange={(e) => { 
                setFontFamily(e.target.value); 
                executeCommand('fontName', e.target.value); 
              }} 
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Calibri">Calibri</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
              <option value="Courier New">Courier New</option>
            </select>
            <select 
              value={fontSize} 
              onChange={(e) => { 
                setFontSize(e.target.value); 
                if (editorRef.current) {
                  editorRef.current.style.fontSize = e.target.value + 'px';
                }
              }} 
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
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

          {/* Text Formatting */}
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button 
              onClick={() => executeCommand('bold')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Bold"
            >
              <Bold size={18} />
            </button>
            <button 
              onClick={() => executeCommand('italic')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Italic"
            >
              <Italic size={18} />
            </button>
            <button 
              onClick={() => executeCommand('underline')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Underline"
            >
              <Underline size={18} />
            </button>
          </div>

          {/* Colors */}
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button 
              onClick={() => colorInputRef.current?.click()} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Text Color"
            >
              <Palette size={18} />
            </button>
            <input 
              ref={colorInputRef} 
              type="color" 
              value={textColor} 
              onChange={(e) => { 
                setTextColor(e.target.value); 
                executeCommand('foreColor', e.target.value); 
              }} 
              className="hidden"
            />
            <button 
              onClick={() => bgColorInputRef.current?.click()} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Highlight"
            >
              <Highlighter size={18} />
            </button>
            <input 
              ref={bgColorInputRef} 
              type="color" 
              value={bgColor} 
              onChange={(e) => { 
                setBgColor(e.target.value); 
                executeCommand('backColor', e.target.value); 
              }} 
              className="hidden"
            />
          </div>

          {/* Alignment */}
          <div className="flex items-center space-x-1 pr-4 border-r">
            <button 
              onClick={() => executeCommand('justifyLeft')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Align Left"
            >
              <AlignLeft size={18} />
            </button>
            <button 
              onClick={() => executeCommand('justifyCenter')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Center"
            >
              <AlignCenter size={18} />
            </button>
            <button 
              onClick={() => executeCommand('justifyRight')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Align Right"
            >
              <AlignRight size={18} />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => executeCommand('insertUnorderedList')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Bullet List"
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => executeCommand('insertOrderedList')} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-50 to-gray-100 p-8">
        <div className="max-w-5xl mx-auto">
          <div 
            ref={editorRef} 
            contentEditable 
            onInput={handleInput} 
            className="min-h-[700px] bg-white shadow-xl rounded-lg p-16 outline-none focus:ring-2 focus:ring-blue-400 transition-shadow" 
            style={{
              fontFamily: fontFamily,
              fontSize: fontSize + 'px',
              lineHeight: '1.8'
            }} 
            data-placeholder="Start typing your document..."
            suppressContentEditableWarning={true}
          />
        </div>
      </div>
    </div>
  );
};

export default WordEditor;