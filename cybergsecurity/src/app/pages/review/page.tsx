'use client';

import { useState } from 'react';
import { DocumentListSidebar } from '@/app/components/review/DocumentListSidebar';
import { EditorPanel } from '@/app/components/review/EditorPanel';
import { AIAssistantPanel } from '@/app/components/review/AIAssistantPanel';

type Message = {
  sender: 'user' | 'ai';
  text: string;
};
type Status = 'Conflict' | 'Approved' | 'Checking';

const ReviewPage = () => {
  const [llmResponse, setLlmResponse] = useState(
    'Agent has identified 3 potential conflicts with Government Regulation No. 5 of 2021 regarding commercial licensing.'
  );
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { sender: 'user', text: 'Please check this contract against PP No. 5/2021.' },
    { sender: 'ai', text: 'Checking... I found 3 clauses that might conflict. They are Clause 5.2, Clause 8.1, and Appendix A.' },
    { sender: 'user', text: 'Can you specify the issue in Clause 5.2?' }
  ]);
  const [status, setStatus] = useState<Status>('Conflict');
  const [isAiTyping, setIsAiTyping] = useState(false); 

  const handleSendMessage = (message: string) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: message }]);
    
    setIsAiTyping(true);

    setTimeout(() => {
      const aiReply = "This is a simulated AI response. In a real application, I would provide details about the conflicts found in the document.";
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleCheckStatus = () => {
    setStatus('Checking');
    setTimeout(() => {
      const newStatus = Math.random() > 0.5 ? 'Approved' : 'Conflict';
      setStatus(newStatus);
      if (newStatus === 'Approved') {
        setLlmResponse('No more conflicts found based on the latest edits. The document is ready for the next stage.');
      } else {
        setLlmResponse('Agent has re-identified 1 potential conflict in Clause 8.1. Please review the changes.');
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
        isAiTyping={isAiTyping} // Berikan state loading ke komponen anak
        onSendMessage={handleSendMessage}
        onCheckStatus={handleCheckStatus}
      />
    </div>
  );
};

export default ReviewPage;