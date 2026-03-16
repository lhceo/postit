'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Note, NoteColor } from '@/types'
import { likeNote } from '@/lib/supabase/notes'

const COLOR_BG: Record<NoteColor, string> = {
  yellow: 'bg-yellow-200',
  pink:   'bg-pink-200',
  blue:   'bg-blue-200',
  green:  'bg-green-200',
  purple: 'bg-purple-200',
}

const REPLY_COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'purple']
const COLOR_DOT: Record<NoteColor, string> = {
  yellow: 'bg-yellow-400',
  pink:   'bg-pink-400',
  blue:   'bg-blue-400',
  green:  'bg-green-400',
  purple: 'bg-purple-400',
}

interface StickyNoteProps {
  note: Note
  replies?: Note[]
  bookmarked: boolean
  onBookmark: () => void
  onReply: (content: string, color: NoteColor) => Promise<void>
  /** trueのとき：返信の子カード（DnD不要・インデント表示） */
  isReply?: boolean
}

export function StickyNote({ note, replies = [], bookmarked, onBookmark, onReply, isReply = false }: StickyNoteProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [replyColor, setReplyColor] = useState<NoteColor>('yellow')
  const [submitting, setSubmitting] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: note.id, disabled: isReply })

  const style = isReply ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  async function submitReply() {
    if (!replyContent.trim()) return
    setSubmitting(true)
    await onReply(replyContent.trim(), replyColor)
    setReplyContent('')
    setShowReplyForm(false)
    setSubmitting(false)
  }

  return (
    <div ref={isReply ? undefined : setNodeRef} style={style} className="break-inside-avoid">
      <div className={`${COLOR_BG[note.color as NoteColor]} rounded-2xl p-4 relative`}>
        {/* ドラッグハンドル（返信カードには非表示） */}
        {!isReply && (
          <div
            {...attributes}
            {...listeners}
            className="absolute top-2 right-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
            title="ドラッグして並べ替え"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        )}

        <p className="text-gray-800 text-sm whitespace-pre-wrap mb-3 pr-5">{note.content}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{note.author_name}</span>
          <div className="flex items-center gap-2">
            {/* ブックマーク（返信カードには非表示） */}
            {!isReply && (
              <button
                onClick={onBookmark}
                className={`text-sm transition ${bookmarked ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400'}`}
                title={bookmarked ? 'ブックマーク解除' : 'ブックマーク'}
              >
                {bookmarked ? '★' : '☆'}
              </button>
            )}
            {/* いいね */}
            <button
              onClick={() => likeNote(note.id, note.likes)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition"
            >
              ♡ {note.likes}
            </button>
            {/* 返信 */}
            <button
              onClick={() => setShowReplyForm((v) => !v)}
              className="text-xs text-gray-400 hover:text-blue-500 transition"
              title="返信する"
            >
              💬{replies.length > 0 && ` ${replies.length}`}
            </button>
          </div>
        </div>

        {note.category && (
          <span className="text-xs bg-white bg-opacity-60 px-2 py-0.5 rounded-full text-gray-600 mt-2 inline-block">
            {note.category}
          </span>
        )}

        {/* 返信フォーム */}
        {showReplyForm && (
          <div className="mt-3 bg-white bg-opacity-60 rounded-xl p-3 space-y-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="返信・補足を入力..."
              rows={2}
              autoFocus
              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {REPLY_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setReplyColor(c)}
                    className={`w-4 h-4 rounded-full ${COLOR_DOT[c]} ${replyColor === c ? 'ring-2 ring-offset-1 ring-gray-500' : ''}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowReplyForm(false)} className="text-xs text-gray-400">キャンセル</button>
                <button
                  onClick={submitReply}
                  disabled={submitting || !replyContent.trim()}
                  className="text-xs bg-gray-700 text-white px-3 py-1 rounded-lg disabled:opacity-40"
                >
                  {submitting ? '送信中...' : '返信'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 返信スレッド */}
      {replies.length > 0 && (
        <div className="ml-4 mt-2 space-y-2">
          {replies.map((reply) => (
            <StickyNote
              key={reply.id}
              note={reply}
              replies={[]}
              bookmarked={false}
              onBookmark={() => {}}
              onReply={async () => {}}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  )
}
