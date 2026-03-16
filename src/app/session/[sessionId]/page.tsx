'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useRealtimeNotes } from '@/hooks/useRealtimeNotes'
import { createNote } from '@/lib/supabase/notes'
import { getSessionById } from '@/lib/supabase/sessions'
import { Session, Note, NoteColor } from '@/types'
import { StickyNote } from '@/components/board/StickyNote'
import { NoteInput } from '@/components/board/NoteInput'
import { CategoryFilter } from '@/components/board/CategoryFilter'
import { AIInitialSuggestion } from '@/components/ai/AIInitialSuggestion'
import { AIGrouping } from '@/components/ai/AIGrouping'
import { AISummary } from '@/components/ai/AISummary'

export default function SessionPage() {
  const { sessionId } = useParams()
  const router = useRouter()
  const { notes, loading } = useRealtimeNotes(sessionId as string)
  const [session, setSession] = useState<Session | null>(null)
  const [nickname, setNickname] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiSummary, setAiSummary] = useState('')
  const [aiGroups, setAiGroups] = useState<Record<string, string[]>>({})
  const [aiLoading, setAiLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'board' | 'ai'>('board')
  const [filterColor, setFilterColor] = useState<NoteColor | 'all'>('all')
  const [copied, setCopied] = useState(false)

  // ブックマーク（localStorage）
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false)

  // DnD 順序（localStorage）
  const [noteOrder, setNoteOrder] = useState<string[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  )

  useEffect(() => {
    const stored = localStorage.getItem('nickname')
    if (stored) setNickname(stored)
    const hostId = localStorage.getItem(`host_${sessionId}`)
    setIsHost(!!hostId)
    getSessionById(sessionId as string).then(setSession)

    // ブックマーク復元
    const bmRaw = localStorage.getItem(`bookmarks_${sessionId}`)
    if (bmRaw) setBookmarkedIds(new Set(JSON.parse(bmRaw)))

    // 並び順復元
    const orderRaw = localStorage.getItem(`noteOrder_${sessionId}`)
    if (orderRaw) setNoteOrder(JSON.parse(orderRaw))
  }, [sessionId])

  useEffect(() => {
    if (session && notes.length === 0 && !aiSuggestion) fetchSuggestion()
  }, [session])

  // notesが更新されたとき、新しいIDをnoteOrderに追記
  useEffect(() => {
    const topLevel = notes.filter((n) => !n.parent_id)
    setNoteOrder((prev) => {
      const existingIds = new Set(prev)
      const newIds = topLevel.map((n) => n.id).filter((id) => !existingIds.has(id))
      if (newIds.length === 0) return prev
      return [...prev, ...newIds]
    })
  }, [notes])

  function saveOrder(order: string[]) {
    setNoteOrder(order)
    localStorage.setItem(`noteOrder_${sessionId}`, JSON.stringify(order))
  }

  function toggleBookmark(noteId: string) {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(noteId)) next.delete(noteId)
      else next.add(noteId)
      localStorage.setItem(`bookmarks_${sessionId}`, JSON.stringify([...next]))
      return next
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIdx = noteOrder.indexOf(active.id as string)
      const newIdx = noteOrder.indexOf(over.id as string)
      saveOrder(arrayMove(noteOrder, oldIdx, newIdx))
    }
  }

  async function handleSubmitNote(content: string, color: NoteColor) {
    if (!nickname) return
    await createNote(sessionId as string, content, nickname, color)
  }

  async function handleReply(parentId: string, content: string, color: NoteColor) {
    if (!nickname) return
    await createNote(sessionId as string, content, nickname, color, parentId)
  }

  function copyInviteUrl() {
    if (!session?.share_code) return
    navigator.clipboard.writeText(`${window.location.origin}/join/${session.share_code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

  // トップレベルノート（parent_id がない）をDnD順に並べる
  const topLevelNotes = (() => {
    const map: Record<string, Note> = {}
    notes.forEach((n) => { map[n.id] = n })
    const ordered = noteOrder
      .map((id) => map[id])
      .filter((n): n is Note => !!n && !n.parent_id)
    const orderedIds = new Set(noteOrder)
    const rest = notes.filter((n) => !n.parent_id && !orderedIds.has(n.id))
    return [...ordered, ...rest]
  })()

  // 返信マップ
  const repliesMap: Record<string, Note[]> = {}
  notes.forEach((n) => {
    if (n.parent_id) {
      if (!repliesMap[n.parent_id]) repliesMap[n.parent_id] = []
      repliesMap[n.parent_id].push(n)
    }
  })

  // フィルター適用
  const visibleTopLevel = topLevelNotes.filter((n) => {
    if (showBookmarksOnly && !bookmarkedIds.has(n.id)) return false
    if (filterColor !== 'all' && n.color !== filterColor) return false
    return true
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {isHost && (
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition"
              title="ダッシュボードへ戻る"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              ホーム
            </button>
          )}
          <div>
            <h1 className="font-bold text-gray-800 text-lg">{session?.title || '読み込み中...'}</h1>
            {session?.share_code && (
              <p className="text-xs text-gray-400">
                招待コード: <span className="font-mono font-bold text-orange-500">{session.share_code}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {session?.share_code && (
            <button
              onClick={copyInviteUrl}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm border border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500 transition"
              title="招待URLをクリップボードにコピー"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 12h6a2 2 0 002-2v-8a2 2 0 00-2-2h-6a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? 'コピーしました！' : '招待'}
            </button>
          )}
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

          {/* フィルターバー */}
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryFilter notes={notes} filter={filterColor} onChange={setFilterColor} />
            <button
              onClick={() => setShowBookmarksOnly((v) => !v)}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full border transition ${
                showBookmarksOnly
                  ? 'bg-orange-400 text-white border-orange-400'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300'
              }`}
            >
              ★ ブックマーク
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-8">読み込み中...</p>
          ) : visibleTopLevel.length === 0 ? (
            <p className="text-center text-gray-400 py-8">
              {showBookmarksOnly ? 'ブックマークしたポストはありません' : 'まだアイデアがありません。最初の投稿をしてみましょう！'}
            </p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={visibleTopLevel.map((n) => n.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-start">
                  {visibleTopLevel.map((note) => (
                    <StickyNote
                      key={note.id}
                      note={note}
                      replies={repliesMap[note.id] ?? []}
                      bookmarked={bookmarkedIds.has(note.id)}
                      onBookmark={() => toggleBookmark(note.id)}
                      onReply={(content, color) => handleReply(note.id, content, color)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
