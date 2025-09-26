'use client'

import { DocumentListSidebar } from '@/app/components/review/DocumentListSidebar'
import { EditorPanel } from '@/app/components/review/EditorPanel'
import { SendHorizonal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Message = { sender: 'user' | 'ai'; text: string }
type Status = 'Conflict' | 'Approved' | 'Checking'

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
)

interface AIAssistantPanelProps {
  llmResponse: string
  chatMessages: Message[]
  status: Status
  isAiTyping: boolean
  isSummarizing: boolean
  onSendMessage: (m: string) => void
  onCheckStatus: () => void
  onSummarize: (q: string) => void
}

const AIAssistantPanel = ({
  llmResponse,
  chatMessages,
  status,
  isAiTyping,
  isSummarizing,
  onSendMessage,
  onCheckStatus,
  onSummarize
}: AIAssistantPanelProps) => {
  const [newMessage, setNewMessage] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [chatMessages, isAiTyping, llmResponse, isSummarizing])
  const statusStyles: Record<Status, string> = {
    Approved: 'bg-green-50 text-green-700 border border-green-200',
    Conflict: 'bg-red-50 text-red-700 border border-red-200',
    Checking: 'bg-amber-50 text-amber-700 border border-amber-200',
  }
  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
    }
  }
  return (
    <div className="w-96 flex-shrink-0 flex flex-col bg-white h-full border-l border-slate-200 shadow-sm">
      <div className="p-6 border-b border-slate-100 bg-slate-50 flex flex-col h-64">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-base text-slate-800">AI Summary</h3>
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 text-sm text-slate-600 leading-relaxed">
          {isSummarizing ? <TypingIndicator /> : llmResponse ? <ReactMarkdown>{llmResponse}</ReactMarkdown> : <span className="text-slate-400 italic">No summary available yet</span>}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button onClick={onCheckStatus} className="w-full bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-800 transition-all">Check Status</button>
          <button onClick={() => onSummarize("Ringkas kontrak ini")} className="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors">Summarize</button>
        </div>
      </div>
      <div ref={chatRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-5">
        {chatMessages.length === 0 && !isAiTyping && <span className="text-slate-400 text-sm italic">Mulai percakapan dengan AI...</span>}
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-t-xl px-4 py-3 shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-bl-xl' : 'bg-slate-100 text-slate-800 rounded-br-xl'}`}>
              <div className="text-sm leading-relaxed"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
            </div>
          </div>
        ))}
        {isAiTyping && <TypingIndicator />}
      </div>
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="relative flex items-center">
          <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any) }}} placeholder="Tanya pada AI..." className="w-full bg-slate-50 text-sm text-slate-800 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none pr-12"/>
          <button onClick={handleSubmit} className="absolute right-2 h-8 w-8 bg-slate-800 text-white rounded-lg flex items-center justify-center hover:bg-slate-900 transition-colors disabled:opacity-50" disabled={!newMessage.trim() || isAiTyping}><SendHorizonal className="h-4 w-4"/></button>
        </div>
      </div>
    </div>
  )
}

const ReviewPage = () => {
  const [llmResponse, setLlmResponse] = useState('')
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<Status>('Checking')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const API_BASE_URL = 'http://localhost:8000'

  const handleSendMessage = async (message: string) => {
    setChatMessages(p => [...p, { sender: 'user', text: message }])
    setIsAiTyping(true)
    try {
      const r = await fetch(`${API_BASE_URL}/chatbot/chat/stream`, { method: 'POST', mode: 'cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sessionId, message }) })
      if (!r.ok || !r.body) throw new Error("stream error")
      const reader = r.body.getReader()
      const decoder = new TextDecoder()
      let aiText = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        aiText += chunk
        setChatMessages(prev => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (last && last.sender === 'ai') updated[updated.length - 1] = { sender: 'ai', text: aiText }
          else updated.push({ sender: 'ai', text: aiText })
          return updated
        })
      }
    } catch {
      setChatMessages(p => [...p, { sender: 'ai', text: "⚠️ Error saat streaming" }])
    }
    setIsAiTyping(false)
  }

  const handleSummarize = async (query: string) => {
    setIsSummarizing(true)
    try {
      const r = await fetch(`${API_BASE_URL}/chatbot/summarize`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ session_id: sessionId, query }) })
      if (r.ok) {
        const d = await r.json()
        setLlmResponse(d.response)
        // setChatMessages(p => [...p, { sender: 'ai', text: `Ringkasan: ${d.response}` }])
      }
    } catch {
      const fallback = "Ringkasan gagal diambil."
      setLlmResponse(fallback)
      // setChatMessages(p => [...p, { sender: 'ai', text: fallback }])
    }
    setIsSummarizing(false)
  }

  const handleCheckStatus = async () => {
    setStatus('Checking')
    setIsSummarizing(true)
    try {
      const r = await fetch(`${API_BASE_URL}/api/compliance/evaluate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ file_url: "https://storage.googleapis.com/bucket/contract.pdf" }) })
      if (!r.ok) throw new Error()
      const d = await r.json()
      setStatus(d.status === "comply" ? "Approved" : "Conflict")
      setLlmResponse(d.summary)
      setChatMessages(p => [...p, { sender: 'ai', text: `Compliance result: ${d.summary}` }])
    } catch {
      setStatus('Conflict')
      setChatMessages(p => [...p, { sender: 'ai', text: "⚠️ Error saat compliance check" }])
    }
    setIsSummarizing(false)
  }

  return (
    <div className="flex h-full">
      <DocumentListSidebar />
      <EditorPanel />
      <AIAssistantPanel llmResponse={llmResponse} chatMessages={chatMessages} status={status} isAiTyping={isAiTyping} isSummarizing={isSummarizing} onSendMessage={handleSendMessage} onCheckStatus={handleCheckStatus} onSummarize={handleSummarize}/>
    </div>
  )
}

export default ReviewPage
