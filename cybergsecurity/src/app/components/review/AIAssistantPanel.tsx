'use client';

import { useState, useRef, useEffect } from 'react'; 
import { SendHorizonal } from 'lucide-react';

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
  onSendMessage: (message: string) => void;
  onCheckStatus: () => void;
}

export const AIAssistantPanel = ({ 
  llmResponse, 
  chatMessages, 
  status, 
  isAiTyping,
  onSendMessage, 
  onCheckStatus 
}: AIAssistantPanelProps) => {
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isAiTyping]); 

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  const statusStyles: Record<Status, string> = {
    Approved: 'bg-green-50 text-green-700 border border-green-200',
    Conflict: 'bg-red-50 text-red-700 border border-red-200',
    Checking: 'bg-amber-50 text-amber-700 border border-amber-200',
  };

  return (
    <div className="w-96 flex-shrink-0 flex flex-col bg-white h-full border-l border-slate-200">
      
      <div className="p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-base text-slate-800">AI Summary</h3>
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-slate-600 mb-5 leading-relaxed">
          {llmResponse}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onCheckStatus}
              className="w-full bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
                Check Status
            </button>
            <button className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                Move To
            </button>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                max-w-[80%] rounded-t-xl px-4 py-3 
                cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1
                ${
                  msg.sender === 'user' 
                  ? 'bg-[var(--color-blue-medium)] text-black rounded-bl-xl'
                  : 'bg-slate-100 text-slate-800 rounded-br-xl'
                }
            `}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
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