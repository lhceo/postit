'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useRealtimeNotes } from '@/hooks/useRealtimeNotes'
import { createNote } from '@/lib/supabase/notes'
import { getSessionById } from '@/lib/supabase/sessions'
import { Session, NoteColor } from '@/types'
import { StickyNote } from '@/components/board/StickyNote'
import { NoteInput } from '@/components/board/NoteInput'
import { CategoryFilter } from '@/components/board/CategoryFilter'
import { AIInitialSuggestion } from '@/components/ai/AIInitialSuggestion'
import { AIGrouping } from '@/components/ai/AIGrouping'
import { AISummary } from '@/components/ai/AISummary'

export default function SessionPage() {
  const { sessionId } = useParams()
  const { notes, loading } = useRealtimeNotes(sessionId as string)
  const [session, setSession] = useState<Session | null>(null)
  const [nickname, setNickname] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiSummary, setAiSummary] = useState('')
  const [aiGroups, setAiGroups] = useState<Record<string, string[]>>({})
  const [aiLoading, setAiLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'board' | 'ai'>('board')
  const [filterColor, setFilterColor] = useState<NoteColor | 'all'>('all')

  useEffect(() => {
    const stored = localStorage.getItem('nickname')
    if (stored) setNickname(stored)
    getSessionById(sessionId as string).then(setSession)
  }, [sessionId])

  useEffect(() => {
    if (session && notes.length === 0 && !aiSuggestion) {
      fetchSuggestion()
    }
  }, [session])

  async function fetchSuggestion() {
    if (!session) return
    setAiLoading(true)
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'suggest', topic: session.title }),
    })
    const { result } = await res.json()
    setAiSuggestion(result)
    setAiLoading(false)
  }

  async function handleSubmitNote(content: string, color: NoteColor) {
    if (!nickname) return
    await createNote(sessionId as string, content, nickname, color)
  }

  async function handleAIGroup() {
    setAiLoading(true)
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'group', notes: notes.map((n) => n.content) }),
    })
    const { result } = await res.json()
    setAiGroups(result)
    setAiLoading(false)
  }

  async function handleAISummary() {
    if (!session) return
    setAiLoading(true)
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'summarize', topic: session.title, notes: notes.map((n) => n.content) }),
    })
    const { result } = await res.json()
    setAiSummary(result)
    setAiLoading(false)
  }

  const filteredNotes = filterColor === 'all' ? notes : notes.filter((n) => n.color === filterColor)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-bold text-gray-800 text-lg">{session?.title || '読み込み中...'}</h1>
          {session?.share_code && (
            <p className="text-xs text-gray-400">
              招待コード: <span className="font-mono font-bold text-orange-500">{session.share_code}</span>
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${activeTab === 'board' ? 'bg-orange-400 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            ボード
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${activeTab === 'ai' ? 'bg-orange-400 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            AI分析
          </button>
        </div>
      </header>

      {activeTab === 'board' && (
        <div className="p-4 max-w-4xl mx-auto space-y-4">
          {notes.length === 0 && !loading && (
            <AIInitialSuggestion suggestion={aiSuggestion} />
          )}
          <NoteInput onSubmit={handleSubmitNote} />
          <CategoryFilter notes={notes} filter={filterColor} onChange={setFilterColor} />

          {loading ? (
            <p className="text-center text-gray-400 py-8">読み込み中...</p>
          ) : filteredNotes.length === 0 ? (
            <p className="text-center text-gray-400 py-8">まだアイデアがありません。最初の投稿をしてみましょう！</p>
          ) : (
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {filteredNotes.map((note) => (
                <StickyNote key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="p-4 max-w-2xl mx-auto space-y-4">
          <AIGrouping
            groups={aiGroups}
            loading={aiLoading}
            disabled={notes.length === 0}
            onGroup={handleAIGroup}
          />
          <AISummary
            summary={aiSummary}
            loading={aiLoading}
            disabled={notes.length === 0}
            onSummarize={handleAISummary}
          />
        </div>
      )}
    </main>
  )
}
