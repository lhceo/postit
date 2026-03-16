import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { NoteColor } from '@/types'

export async function POST(req: NextRequest) {
  const { sessionId, content, authorName, color, parentId } = await req.json()

  if (!sessionId || !content || !authorName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('notes')
      .insert({
        session_id: sessionId,
        content,
        author_name: authorName,
        color: (color as NoteColor) || 'yellow',
        position_x: Math.random() * 600,
        position_y: Math.random() * 400,
        ...(parentId ? { parent_id: parentId } : {}),
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ note: data })
  } catch (error) {
    console.error('Failed to create note:', error)
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
