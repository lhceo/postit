'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('hostSessionIds')
    const ids: string[] = raw ? JSON.parse(raw) : []
    if (ids.length === 0) {
      setLoading(false)
      return
    }
    fetch(`/api/sessions?ids=${ids.join(',')}`)
      .then((r) => r.json())
      .then(({ sessions }) => setSessions(sessions ?? []))
      .finally(() => setLoading(false))
  }, [])

  function copyInviteUrl(shareCode: string) {
    const url = `${window.location.origin}/join/${shareCode}`
    navigator.clipboard.writeText(url)
    setCopied(shareCode)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">マイセッション</h1>
            <p className="text-gray-400 text-sm mt-1">作成したブレストセッションの一覧</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition"
          >
            + 新規作成
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-12">読み込み中...</p>
        ) : sessions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <p className="text-gray-400 mb-4">まだセッションがありません</p>
            <button
              onClick={() => router.push('/')}
              className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-6 py-2 rounded-xl transition"
            >
              最初のセッションを作成する
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-800 truncate">{session.title}</h2>
                    {session.description && (
                      <p className="text-gray-400 text-sm mt-0.5 truncate">{session.description}</p>
                    )}
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(session.created_at).toLocaleDateString('ja-JP', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <button
                      onClick={() => router.push(`/session/${session.id}`)}
                      className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      開く
                    </button>
                    <button
                      onClick={() => copyInviteUrl(session.share_code)}
                      className="text-xs text-gray-500 hover:text-orange-500 border border-gray-200 hover:border-orange-300 px-3 py-1.5 rounded-lg transition"
                    >
                      {copied === session.share_code ? 'コピーしました！' : '招待URLをコピー'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
