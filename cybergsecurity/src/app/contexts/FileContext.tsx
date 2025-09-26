"use client";

import * as mammoth from 'mammoth';
import { ReactNode, createContext, useContext, useRef, useState } from 'react';

// Types
export interface FileData {
  id: string;
  name: string;
  originalName: string;
  content: string | File;
  format: 'docx' | 'pdf' | 'rtf' | 'txt' | 'html';
  uploadedAt: Date;
  lastModified: Date;
  size: number;
}

interface FileContextType {
  files: FileData[];
  currentFile: FileData | null;
  isLoading: boolean;
  uploadFile: (file: File) => Promise<FileData | null>;
  triggerFileInput: () => void;
  updateFileContent: (content: string) => void;
  switchToFile: (fileId: string) => void;
  createNewFile: () => FileData;
  deleteFile: (fileId: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

// Context
const FileContext = createContext<FileContextType | undefined>(undefined);

// Hook
export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};

// Provider Props
interface FileProviderProps {
  children: ReactNode;
}

// Provider Component
export const FileProvider = ({ children }: FileProviderProps) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process different file types
  const processFile = async (file: File): Promise<FileData> => {
    let content: string | File = '';
    let format: FileData['format'] = 'html';

    if (file.name.endsWith('.docx')) {
      format = 'docx';
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      content = processDocxContent(result.value);
    } else if (file.name.endsWith('.txt')) {
      format = 'txt';
      const text = await file.text();
      content = text.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('');
    } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      format = 'html';
      const rawHtml = await file.text();
      const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      content = bodyMatch ? bodyMatch[1] : rawHtml;
    } else if (file.name.endsWith('.rtf')) {
      format = 'rtf';
      const text = await file.text();
      content = text
        .replace(/\\par/g, '</p><p>')
        .replace(/\\b\s/g, '<b>')
        .replace(/\\b0\s/g, '</b>')
        .replace(/\\i\s/g, '<i>')
        .replace(/\\i0\s/g, '</i>')
        .replace(/\\ul\s/g, '<u>')
        .replace(/\\ulnone\s/g, '</u>')
        .replace(/\{[^}]*\}/g, '')
        .replace(/\\/g, '');
      content = `<p>${content}</p>`;
    } else if (file.name.endsWith('.pdf')) {
      format = 'pdf';
      // For PDF, we'll store the file object itself
      content = file;
    }

    return {
      id: Date.now() + Math.random().toString(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      originalName: file.name,
      content,
      format,
      uploadedAt: new Date(),
      lastModified: new Date(),
      size: file.size
    };
  };

  const processDocxContent = (html: string): string => {
    let processed = html;
    processed = processed.replace(/<p[^>]*>/gi, '<p>');
    processed = processed.replace(/<span[^>]*>/gi, '<span>');
    processed = processed.replace(/<o:p\s*\/?>|<\/o:p>/gi, '');
    if (!processed.includes('<p>') && !processed.includes('<br>')) {
      processed = processed.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('');
    }
    return processed;
  };

  // Upload file handler
  const uploadFile = async (file: File): Promise<FileData | null> => {
    if (!file) return null;
    
    setIsLoading(true);
    try {
      const processedFile = await processFile(file);
      setFiles(prev => [...prev, processedFile]);
      setCurrentFile(processedFile);
      return processedFile;
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process file. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  // Update current file content
  const updateFileContent = (content: string) => {
    if (!currentFile) return;
    
    const updatedFile: FileData = {
      ...currentFile,
      content,
      lastModified: new Date()
    };
    
    setCurrentFile(updatedFile);
    setFiles(prev => 
      prev.map(file => 
        file.id === currentFile.id ? updatedFile : file
      )
    );
  };

  // Switch to different file
  const switchToFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      setCurrentFile(file);
    }
  };

  // Create new file
  const createNewFile = (): FileData => {
    const newFile: FileData = {
      id: Date.now() + Math.random().toString(),
      name: 'Untitled Document',
      originalName: 'untitled.html',
      content: '',
      format: 'html',
      uploadedAt: new Date(),
      lastModified: new Date(),
      size: 0
    };
    
    setFiles(prev => [...prev, newFile]);
    setCurrentFile(newFile);
    return newFile;
  };

  // Delete file
  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (currentFile?.id === fileId) {
      const remainingFiles = files.filter(f => f.id !== fileId);
      setCurrentFile(remainingFiles.length > 0 ? remainingFiles[0] : null);
    }
  };

  const value: FileContextType = {
    files,
    currentFile,
    isLoading,
    uploadFile,
    triggerFileInput,
    updateFileContent,
    switchToFile,
    createNewFile,
    deleteFile,
    fileInputRef,
    handleFileInputChange
  };

  return (
    <FileContext.Provider value={value}>
      {children}
      {/* Hidden file input yang bisa diakses dari mana saja */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.txt,.html,.htm,.rtf,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </FileContext.Provider>
  );
};