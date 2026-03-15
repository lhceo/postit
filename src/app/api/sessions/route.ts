import { NextRequest, NextResponse } from 'next/server'
import { createSession, getSessionByShareCode } from '@/lib/supabase/sessions'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  const { title, description } = await req.json()
  try {
    const hostId = uuidv4()
    const session = await createSession(title, description, hostId)
    return NextResponse.json({ session, hostId })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const shareCode = req.nextUrl.searchParams.get('code')
  if (!shareCode) return NextResponse.json({ error: 'No code' }, { status: 400 })
  try {
    const session = await getSessionByShareCode(shareCode)
    return NextResponse.json({ session })
  } catch (error) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }
}
