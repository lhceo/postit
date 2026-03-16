'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [shareCode, setShareCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'top' | 'create' | 'join'>('top')

  async function handleCreate() {
    if (!title.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })
      const { session, hostId } = await res.json()
      localStorage.setItem(`host_${session.id}`, hostId)
      localStorage.setItem('nickname', 'ホスト')
      const prev: string[] = JSON.parse(localStorage.getItem('hostSessionIds') ?? '[]')
      localStorage.setItem('hostSessionIds', JSON.stringify([session.id, ...prev]))
      router.push(`/session/${session.id}`)
    } catch {
      setLoading(false)
    }
  }

  async function handleJoin() {
    if (!shareCode.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions?code=${shareCode.trim().toUpperCase()}`)
      const { session } = await res.json()
      router.push(`/session/${session.id}/join`)
    } catch {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">BrainstormAI</h1>
          <p className="text-gray-500">AIがアイデアを整理するブレスト空間</p>
        </div>

        {mode === 'top' && (
          <div className="space-y-3">
            <button
              onClick={() => setMode('create')}
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl text-lg transition"
            >
              セッションを作成する
            </button>
            <button
              onClick={() => setMode('join')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-2xl text-lg border-2 border-gray-200 transition"
            >
              セッションに参加する
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition"
            >
              マイセッション一覧を見る →
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-700">新しいセッション</h2>
            <input
              type="text"
              placeholder="テーマ（例：新サービスのアイデア）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
            />
            <textarea
              placeholder="説明（任意）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 resize-none"
            />
            <button
              onClick={handleCreate}
              disabled={loading || !title.trim()}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-gray-200 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? '作成中...' : '作成する'}
            </button>
            <button onClick={() => setMode('top')} className="w-full text-gray-400 text-sm">
              戻る
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-700">セッションに参加</h2>
            <input
              type="text"
              placeholder="招待コード（例：ABC123）"
              value={shareCode}
              onChange={(e) => setShareCode(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 uppercase"
            />
            <button
              onClick={handleJoin}
              disabled={loading || !shareCode.trim()}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-gray-200 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? '検索中...' : '参加する'}
            </button>
            <button onClick={() => setMode('top')} className="w-full text-gray-400 text-sm">
              戻る
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
