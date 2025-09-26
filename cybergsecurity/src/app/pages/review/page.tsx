'use client'

import { AIAssistantPanel } from '@/app/components/review/AIAssistantPanel'
import { DocumentListSidebar } from '@/app/components/review/DocumentListSidebar'
import { EditorPanel } from '@/app/components/review/EditorPanel'
import WordEditor from '@/app/components/review/WordEditor'
import { FileProvider, useFileContext } from '@/app/contexts/FileContext'
import { FileText, FolderOpen, Plus } from 'lucide-react'
import { useState } from 'react'

type Message = { sender: 'user' | 'ai'; text: string }
type Status = 'Conflict' | 'Approved' | 'Checking'

const ViewerLandingScreen = () => {
  const { createNewFile, triggerFileInput, isLoading } = useFileContext()
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Document Viewer</h1>
          <p className="text-gray-600">Upload a document to view and analyze</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={triggerFileInput}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center disabled:opacity-50"
          >
            <FolderOpen size={20} className="mr-2" />
            {isLoading ? 'Loading...' : 'Upload Document'}
          </button>
          <button
            onClick={createNewFile}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:border-blue-400 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
          >
            <Plus size={20} className="mr-2" />
            Create New Document
          </button>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">Supports: DOCX, PDF, RTF, TXT, HTML</div>
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
  )
}

const MainContent = () => {
  const [currentView, setCurrentView] = useState<'viewer' | 'editor'>('viewer')
  const { currentFile } = useFileContext()
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
      const r = await fetch(`${API_BASE_URL}/chatbot/chat/stream`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message })
      })
      if (!r.ok || !r.body) throw new Error('stream error')
      const reader = r.body.getReader()
      const decoder = new TextDecoder()
      let aiText = ''
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
      setChatMessages(p => [...p, { sender: 'ai', text: '⚠️ Error saat streaming' }])
    }
    setIsAiTyping(false)
  }

  const handleSummarize = async (query: string) => {
    setIsSummarizing(true)
    try {
      const r = await fetch(`${API_BASE_URL}/chatbot/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, query })
      })
      if (r.ok) {
        const d = await r.json()
        setLlmResponse(d.response)
      }
    } catch {
      const fallback = 'Ringkasan gagal diambil.'
      setLlmResponse(fallback)
    }
    setIsSummarizing(false)
  }

  const handleCheckStatus = async () => {
    setStatus('Checking')
    setIsSummarizing(true)
    try {
      const r = await fetch(`${API_BASE_URL}/api/compliance/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_url: 'https://storage.googleapis.com/bucket/contract.pdf' })
      })
      if (!r.ok) throw new Error()
      const d = await r.json()
      setStatus(d.status === 'comply' ? 'Approved' : 'Conflict')
      setLlmResponse(d.summary)
      setChatMessages(p => [...p, { sender: 'ai', text: `Compliance result: ${d.summary}` }])
    } catch {
      setStatus('Conflict')
      setChatMessages(p => [...p, { sender: 'ai', text: '⚠️ Error saat compliance check' }])
    }
    setIsSummarizing(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">Document Management System</h1>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('viewer')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'viewer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Document Viewer
            </button>
            <button
              onClick={() => setCurrentView('editor')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Word Editor
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {currentView === 'viewer' ? (
          <>
            <DocumentListSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">{currentFile ? <EditorPanel /> : <ViewerLandingScreen />}</div>
            </div>
            <AIAssistantPanel
              llmResponse={llmResponse}
              chatMessages={chatMessages}
              status={status}
              isAiTyping={isAiTyping}
              isSummarizing={isSummarizing}
              onSendMessage={handleSendMessage}
              onCheckStatus={handleCheckStatus}
              onSummarize={handleSummarize}
            />
          </>
        ) : (
          <>
            <div className="flex-1 overflow-hidden overflow-y-auto">
              <WordEditor />
            </div>
            <AIAssistantPanel
              llmResponse={llmResponse}
              chatMessages={chatMessages}
              status={status}
              isAiTyping={isAiTyping}
              isSummarizing={isSummarizing}
              onSendMessage={handleSendMessage}
              onCheckStatus={handleCheckStatus}
              onSummarize={handleSummarize}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default function ReviewPage() {
  return (
    <FileProvider>
      <div className="flex h-full overflow-hidden">
        <MainContent />
      </div>
    </FileProvider>
  )
}
