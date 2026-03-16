'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function JoinPage() {
  const router = useRouter()
  const { sessionId } = useParams()
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleJoin() {
    if (!nickname.trim()) return
    setLoading(true)
    setError(null)
    try {
      await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, nickname: nickname.trim() }),
      })
      localStorage.setItem('nickname', nickname.trim())
      router.push(`/session/${sessionId}`)
    } catch {
      setError('参加に失敗しました。もう一度お試しください。')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-gray-700">ニックネームを入力</h2>
          <p className="text-gray-400 text-sm">アカウント登録不要。ニックネームだけで参加できます。</p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="ニックネーム"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            autoFocus
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400"
          />
          <button
            onClick={handleJoin}
            disabled={loading || !nickname.trim()}
            className="w-full bg-orange-400 hover:bg-orange-500 disabled:bg-gray-200 text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? '参加中...' : 'ブレストに参加する'}
          </button>
        </div>
      </div>
    </main>
  )
}
