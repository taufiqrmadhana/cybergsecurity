'use client'

import { AIAssistantPanel } from '@/app/components/review/AIAssistantPanel'
import { DocumentListSidebar } from '@/app/components/review/DocumentListSidebar'
import { FileProvider } from '@/app/contexts/FileContext'
import { saveAs } from 'file-saver'
import htmlDocx from 'html-docx-js/dist/html-docx'
import { AlertTriangle, Check, FileText, Loader2, Save, Upload } from 'lucide-react'
import * as mammoth from 'mammoth'
import { useEffect, useRef, useState } from 'react'

type Message = { sender: 'user' | 'ai'; text: string }
type Status = 'Conflict' | 'Approved' | 'Checking'

const OnboardingScreen = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  return (
    <div className="flex-1 h-full flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FileText size={32} className="text-white sm:w-10 sm:h-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Contract Compliance</h1>
          <p className="text-slate-600 text-sm sm:text-base">Upload your contract to start checking</p>
        </div>
        <div className="space-y-3">
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.html,.htm,.rtf"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFileSelect(file)
            }}
          />
          <button
            onClick={() => document.getElementById('fileInput')?.click()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 sm:py-4 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
          >
            <Upload size={18} className="mr-2" />
            Select Contract
          </button>
        </div>
        <div className="mt-6 text-center text-xs sm:text-sm text-slate-400">DOCX • RTF • TXT • HTML</div>
      </div>
    </div>
  )
}

const WordEditor = ({ initialContent, fileName }: { initialContent: string; fileName: string }) => {
  const [content, setContent] = useState(initialContent || '')
  const [isSaved, setIsSaved] = useState(true)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent
    }
  }, [initialContent])

  const handleInput = () => {
    if (!editorRef.current) return
    setContent(editorRef.current.innerHTML)
    setIsSaved(false)
  }

  const handleSaveDocs = () => {
    const html = `<!DOCTYPE html><html><body>${content}</body></html>`
    const blob = htmlDocx.asBlob(html)
    saveAs(blob, `${fileName.replace(/\.[^/.]+$/, '')}_edited.docx`)
    setIsSaved(true)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between bg-white px-4 py-2 border-b">
        <span className="text-sm text-gray-600">{fileName}</span>
        {!isSaved && <span className="text-xs text-yellow-600">Unsaved</span>}
        <button onClick={handleSaveDocs} className="flex items-center text-blue-600 text-sm">
          <Save size={16} className="mr-1" /> Save
        </button>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="min-h-[600px] bg-white shadow rounded-lg p-6 outline-none"
        />
      </div>
    </div>
  )
}

const MainContent = () => {
  const [currentView, setCurrentView] = useState<'viewer' | 'editor'>('viewer')
  const [llmResponse, setLlmResponse] = useState('')
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [status, setStatus] = useState<Status>('Checking')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileContent, setFileContent] = useState<string>('')

  const API_BASE_URL = 'http://localhost:8000'

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const processDocxContent = (html: string) => {
    let processed = html
    processed = processed.replace(/<p[^>]*>/gi, '<p>')
    processed = processed.replace(/<span[^>]*>/gi, '<span>')
    processed = processed.replace(/<o:p\s*\/?>|<\/o:p>/gi, '')
    if (!processed.includes('<p>') && !processed.includes('<br>')) {
      processed = processed.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('')
    }
    return processed
  }

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
    let htmlContent = ''
    if (file.name.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      htmlContent = processDocxContent(result.value)
    } else if (file.name.endsWith('.txt')) {
      const text = await file.text()
      htmlContent = text.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('')
    } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      const rawHtml = await file.text()
      const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      htmlContent = bodyMatch ? bodyMatch[1] : rawHtml
    } else if (file.name.endsWith('.rtf')) {
      const text = await file.text()
      htmlContent = text
        .replace(/\\par/g, '</p><p>')
        .replace(/\\b\s/g, '<b>')
        .replace(/\\b0\s/g, '</b>')
        .replace(/\\i\s/g, '<i>')
        .replace(/\\i0\s/g, '</i>')
        .replace(/\\ul\s/g, '<u>')
        .replace(/\\ulnone\s/g, '</u>')
        .replace(/\{[^}]*\}/g, '')
        .replace(/\\/g, '')
      htmlContent = `<p>${htmlContent}</p>`
    } else {
      htmlContent = '📄 Preview not supported.'
    }
    setFileContent(htmlContent)
  }

  const handleUploadAndCheck = async () => {
    if (!selectedFile) return
    setStatus('Checking')
    setIsSummarizing(true)
    try {
      const formData = new FormData()
      formData.append('title', selectedFile.name.replace(/\.[^/.]+$/, ''))
      formData.append('description', `Legal compliance analysis for ${selectedFile.name}`)
      formData.append('jenis_kontrak', 'LAYANAN_TEKNOLOGI_INFORMASI')
      formData.append('file', selectedFile)
      const r = await fetch(`${API_BASE_URL}/api/compliance/upload-and-evaluate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      const isCompliant = data.status === 'comply'
      setStatus(isCompliant ? 'Approved' : 'Conflict')
      setLlmResponse(data.summary)
      const statusIcon = isCompliant ? '✅' : '⚠️'
      const statusText = isCompliant ? 'COMPLIANT' : 'ISSUES FOUND'
      setChatMessages(p => [...p, { sender: 'ai', text: `${statusIcon} Analysis Complete\n\nStatus: ${statusText}\nSummary: ${data.summary}` }])
    } catch {
      setStatus('Conflict')
      setLlmResponse('Analysis failed')
      setChatMessages(p => [...p, { sender: 'ai', text: '⚠️ Analysis failed. Please try again.' }])
    }
    setIsSummarizing(false)
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'Approved': return <Check size={16} className="text-emerald-600" />
      case 'Conflict': return <AlertTriangle size={16} className="text-amber-600" />
      default: return <Loader2 size={16} className="text-blue-600 animate-spin" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Conflict': return 'bg-amber-50 text-amber-700 border-amber-200'
      default: return 'bg-blue-50 text-blue-700 border-blue-200'
    }
  }

  if (!selectedFile) {
    return <OnboardingScreen onFileSelect={handleFileSelect} />
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden h-full">
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Compliance Checker</h1>
          <div className={`text-xs px-3 py-1 rounded-full border ${getStatusColor()} flex items-center space-x-1`}>
            {getStatusIcon()}
            <span>{selectedFile.name.length > 20 ? selectedFile.name.substring(0, 20) + '...' : selectedFile.name}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleUploadAndCheck}
            disabled={isSummarizing}
            className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center text-sm"
          >
            {isSummarizing ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Check size={14} className="mr-2" />
                Check Compliance
              </>
            )}
          </button>
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('viewer')}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                currentView === 'viewer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Viewer
            </button>
            <button
              onClick={() => setCurrentView('editor')}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                currentView === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Editor
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {currentView === 'viewer' ? (
          <>
            <div className="hidden lg:block">
              <DocumentListSidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-6 whitespace-pre-wrap text-slate-700 overflow-y-auto">
                <div dangerouslySetInnerHTML={{ __html: fileContent }} />
              </div>
            </div>
            <div className="w-full sm:w-80 lg:w-96">
              <AIAssistantPanel
                llmResponse={llmResponse}
                chatMessages={chatMessages}
                status={status}
                isAiTyping={isAiTyping}
                isSummarizing={isSummarizing}
                onSendMessage={() => {}}
                onCheckStatus={handleUploadAndCheck}
                onSummarize={handleUploadAndCheck}
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-hidden overflow-y-auto">
              <WordEditor initialContent={fileContent} fileName={selectedFile.name} />
            </div>
            <div className="w-full sm:w-80 lg:w-96">
              <AIAssistantPanel
                llmResponse={llmResponse}
                chatMessages={chatMessages}
                status={status}
                isAiTyping={isAiTyping}
                isSummarizing={isSummarizing}
                onSendMessage={() => {}}
                onCheckStatus={handleUploadAndCheck}
                onSummarize={handleUploadAndCheck}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function ReviewPage() {
  return (
    <FileProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <MainContent />
      </div>
    </FileProvider>
  )
}
