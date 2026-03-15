'use client'

import { useState } from 'react'
import { NoteColor } from '@/types'
import { Button } from '@/components/ui/Button'

const COLORS: { label: string; value: NoteColor; bg: string }[] = [
  { label: '黄', value: 'yellow', bg: 'bg-yellow-200' },
  { label: 'ピンク', value: 'pink', bg: 'bg-pink-200' },
  { label: '青', value: 'blue', bg: 'bg-blue-200' },
  { label: '緑', value: 'green', bg: 'bg-green-200' },
  { label: '紫', value: 'purple', bg: 'bg-purple-200' },
]

interface NoteInputProps {
  onSubmit: (content: string, color: NoteColor) => Promise<void>
}

export function NoteInput({ onSubmit }: NoteInputProps) {
  const [content, setContent] = useState('')
  const [color, setColor] = useState<NoteColor>('yellow')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!content.trim()) return
    setLoading(true)
    await onSubmit(content.trim(), color)
    setContent('')
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <textarea
        placeholder="アイデアを入力..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && e.metaKey && handleSubmit()}
        rows={3}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-400 resize-none mb-3"
      />
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-7 h-7 rounded-full ${c.bg} ${color === c.value ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
              title={c.label}
            />
          ))}
        </div>
        <Button size="sm" onClick={handleSubmit} disabled={loading || !content.trim()}>
          {loading ? '投稿中...' : '投稿'}
        </Button>
      </div>
    </div>
  )
}
