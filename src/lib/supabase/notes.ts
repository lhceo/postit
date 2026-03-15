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

export async function createNote(
  sessionId: string,
  content: string,
  authorName: string,
  color: NoteColor = 'yellow'
) {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      session_id: sessionId,
      content,
      author_name: authorName,
      color,
      position_x: Math.random() * 600,
      position_y: Math.random() * 400,
    })
    .select()
    .single()
  if (error) throw error
  return data as Note
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
