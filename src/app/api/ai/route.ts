import { NextRequest, NextResponse } from 'next/server'
import { generateInitialSuggestion, groupNotesByTheme, summarizeNotes } from '@/lib/claude/api'

export async function POST(req: NextRequest) {
  const { action, topic, notes } = await req.json()

  try {
    if (action === 'suggest') {
      const suggestion = await generateInitialSuggestion(topic)
      return NextResponse.json({ result: suggestion })
    }
    if (action === 'group') {
      const groups = await groupNotesByTheme(notes)
      return NextResponse.json({ result: groups })
    }
    if (action === 'summarize') {
      const summary = await summarizeNotes(notes, topic)
      return NextResponse.json({ result: summary })
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'AI error' }, { status: 500 })
  }
}
