"use client";

import { SendHorizonal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useFileContext } from '../../contexts/FileContext';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};

type Status = 'Conflict' | 'Approved' | 'Checking';

const TypingIndicator = () => (
  <div className="flex items-end gap-2">
    <div className="max-w-[80%] rounded-t-xl rounded-br-xl bg-slate-100 px-4 py-3">
      <div className="flex items-center justify-center gap-1.5">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
      </div>
    </div>
  </div>
);

interface AIAssistantPanelProps {
  llmResponse: string;
  chatMessages: Message[];
  status: Status;
  isAiTyping: boolean;
  isSummarizing: boolean;
  onSendMessage: (message: string) => void;
  onCheckStatus: () => void;
  onSummarize: (query: string) => void;
}

export const AIAssistantPanel = ({
  llmResponse,
  chatMessages,
  status,
  isAiTyping,
  isSummarizing,
  onSendMessage,
  onCheckStatus,
  onSummarize
}: AIAssistantPanelProps) => {
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { currentFile } = useFileContext();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isAiTyping, llmResponse, isSummarizing]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e);
    }
  };

  const statusStyles: Record<Status, string> = {
    Approved: 'bg-green-50 text-green-700 border border-green-200',
    Conflict: 'bg-red-50 text-red-700 border border-red-200',
    Checking: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  return (
    <div className="w-96 flex-shrink-0 flex flex-col bg-white h-full border-l border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col h-64">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-base text-slate-800">AI Summary</h3>
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
        
        {/* Display current file info */}
        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
          {currentFile ? `Analyzing: ${currentFile.name}` : 'No document selected'}
        </p>
        
        <div className="flex-1 overflow-y-auto pr-1 text-sm text-slate-600 leading-relaxed">
          {isSummarizing ? (
            <TypingIndicator />
          ) : llmResponse ? (
            <ReactMarkdown>{llmResponse}</ReactMarkdown>
          ) : (
            <span className="text-slate-400 italic">No summary available yet</span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button 
            onClick={onCheckStatus} 
            className="w-full bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition-all"
          >
            Check Status
          </button>
          <button 
            onClick={() => onSummarize("Ringkas dokumen ini")} 
            className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Summarize
          </button>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
        {chatMessages.length === 0 && !isAiTyping && (
          <span className="text-slate-400 text-sm italic">Mulai percakapan dengan AI...</span>
        )}
        
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                max-w-[80%] rounded-t-xl px-4 py-3 shadow-sm
                ${
                  msg.sender === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-bl-xl'
                  : 'bg-slate-100 text-slate-800 rounded-br-xl'
                }
            `}>
              <div className="text-sm leading-relaxed">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        
        {isAiTyping && <TypingIndicator />}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleFormSubmit} className="relative flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya pada AI..."
            className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all pr-12"
          />
          <button 
            type="submit" 
            className="absolute right-2 h-8 w-8 bg-slate-800 text-white rounded-lg flex items-center justify-center hover:bg-slate-900 transition-colors disabled:opacity-50"
            disabled={!newMessage.trim() || isAiTyping} 
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};