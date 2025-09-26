'use client';

import { DocumentListSidebar } from '@/app/components/review/DocumentListSidebar';
import { EditorPanel } from '@/app/components/review/EditorPanel';
import { SendHorizonal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

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
  onSummarize: (query: string) => void;
}

const AIAssistantPanel = ({
  llmResponse,
  chatMessages,
  status,
  isAiTyping,
  onSendMessage,
  onCheckStatus,
  onSummarize
}: AIAssistantPanelProps) => {
  const [newMessage, setNewMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isAiTyping]);

  const handleFormSubmit = (e: React.FormEvent | React.MouseEvent) => {
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
        <div className="text-sm text-slate-600 mb-5 leading-relaxed">
          <ReactMarkdown>{llmResponse}</ReactMarkdown>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCheckStatus}
            className="w-full bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
            Check Status
          </button>
          <button
            onClick={() => onSummarize("Ringkas kontrak ini")}
            className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            Summarize
          </button>
        </div>
      </div>

      <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`
                max-w-[80%] rounded-t-xl px-4 py-3 
                cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1
                ${msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-bl-xl'
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
        <div className="relative flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e as any);
              }
            }}
            placeholder="Tanya pada AI..."
            className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all pr-12"
          />
          <button
            onClick={handleFormSubmit}
            className="absolute right-2 h-8 w-8 bg-slate-800 text-white rounded-lg flex items-center justify-center hover:bg-slate-900 transition-colors disabled:opacity-50"
            disabled={!newMessage.trim() || isAiTyping}
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewPage = () => {
  const [llmResponse, setLlmResponse] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<Status>('Checking');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const API_BASE_URL = 'http://localhost:8000';

  const handleSendMessage = async (message: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: message }]);
    setIsAiTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message })
      });

      if (!response.ok || !response.body) throw new Error("Streaming failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiText += chunk;

        setChatMessages(prev => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.sender === 'ai') {
            updated[updated.length - 1] = { sender: 'ai', text: aiText };
          } else {
            updated.push({ sender: 'ai', text: aiText });
          }
          return updated;
        });
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: "⚠️ Error saat streaming" }]);
    }

    setIsAiTyping(false);
  };

  const handleSummarize = async (query: string) => {
    setIsAiTyping(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, query })
      });
      if (response.ok) {
        const data = await response.json();
        setLlmResponse(data.response);
        setChatMessages(prev => [...prev, { sender: 'ai', text: `Ringkasan: ${data.response}` }]);
      }
    } catch (error) {
      const fallback = "Ringkasan gagal diambil.";
      setLlmResponse(fallback);
      setChatMessages(prev => [...prev, { sender: 'ai', text: fallback }]);
    }
    setIsAiTyping(false);
  };

  const handleCheckStatus = () => {
    setStatus('Checking');
    setTimeout(() => {
      const statuses: Status[] = ['Approved', 'Conflict'];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setStatus(newStatus);
      if (newStatus === 'Approved') {
        setLlmResponse('No more conflicts found. The document is ready for the next stage.');
        setChatMessages(prev => [...prev, { sender: 'ai', text: 'Status updated: Kontrak telah disetujui.' }]);
      } else {
        setLlmResponse('Still 1 potential conflict in Clause 8.1.');
        setChatMessages(prev => [...prev, { sender: 'ai', text: 'Status updated: Masih ada konflik di Clause 8.1.' }]);
      }
    }, 2000);
  };

  return (
    <div className="flex h-full">
      <DocumentListSidebar />
      <EditorPanel />
      <AIAssistantPanel
        llmResponse={llmResponse}
        chatMessages={chatMessages}
        status={status}
        isAiTyping={isAiTyping}
        onSendMessage={handleSendMessage}
        onCheckStatus={handleCheckStatus}
        onSummarize={handleSummarize}
      />
    </div>
  );
};

export default ReviewPage;
