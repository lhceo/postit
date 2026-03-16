import { supabase } from './client'
import { Note, NoteColor } from '@/types'

export async function getNotes(sessionId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Note[]
}

// Note: createNote uses the server-side API route to bypass RLS for guest users.
export async function createNote(
  sessionId: string,
  content: string,
  authorName: string,
  color: NoteColor = 'yellow',
  parentId?: string
) {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, content, authorName, color, parentId }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to create note')
  }
  const { note } = await res.json()
  return note as Note
}

export async function likeNote(noteId: string, currentLikes: number) {
  const { error } = await supabase
    .from('notes')
    .update({ likes: currentLikes + 1 })
    .eq('id', noteId)
  if (error) throw error
}

export async function updateNoteCategory(noteId: string, category: string) {
  const { error } = await supabase
    .from('notes')
    .update({ category })
    .eq('id', noteId)
  if (error) throw error
}
