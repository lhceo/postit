import { Note, NoteColor } from '@/types'
import { likeNote } from '@/lib/supabase/notes'

const COLOR_BG: Record<NoteColor, string> = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  blue: 'bg-blue-200',
  green: 'bg-green-200',
  purple: 'bg-purple-200',
}

interface StickyNoteProps {
  note: Note
}

export function StickyNote({ note }: StickyNoteProps) {
  return (
    <div className={`${COLOR_BG[note.color as NoteColor]} rounded-2xl p-4 break-inside-avoid`}>
      <p className="text-gray-800 text-sm whitespace-pre-wrap mb-3">{note.content}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{note.author_name}</span>
        <button
          onClick={() => likeNote(note.id, note.likes)}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition"
        >
          ♡ {note.likes}
        </button>
      </div>
      {note.category && (
        <span className="text-xs bg-white bg-opacity-60 px-2 py-0.5 rounded-full text-gray-600 mt-2 inline-block">
          {note.category}
        </span>
      )}
    </div>
  )
}
