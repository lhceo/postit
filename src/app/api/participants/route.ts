import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { sessionId, nickname } = await req.json()

  if (!sessionId || !nickname) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { error } = await supabaseAdmin
      .from('participants')
      .insert({ session_id: sessionId, nickname })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Failed to add participant:', error)
    return NextResponse.json({ error: 'Failed to add participant' }, { status: 500 })
  }
}
