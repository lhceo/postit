import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getNotes } from '@/lib/supabase/notes'
import { Note } from '@/types'

export function useRealtimeNotes(sessionId: string) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!sessionId) return

    getNotes(sessionId).then((data) => {
      setNotes(data)
      setLoading(false)
    })

    const channel = supabase
      .channel(`notes:${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotes((prev) => [...prev, payload.new as Note])
          } else if (payload.eventType === 'UPDATE') {
            setNotes((prev) =>
              prev.map((n) => (n.id === payload.new.id ? (payload.new as Note) : n))
            )
          } else if (payload.eventType === 'DELETE') {
            setNotes((prev) => prev.filter((n) => n.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [sessionId])

  return { notes, loading }
}
