import { supabase } from './client'
import { Session } from '@/types'

export async function createSession(title: string, description: string, hostId: string) {
  const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase()
  const { data, error } = await supabase
    .from('sessions')
    .insert({ title, description, host_id: hostId, share_code: shareCode })
    .select()
    .single()
  if (error) throw error
  return data as Session
}

export async function getSessionByShareCode(shareCode: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('share_code', shareCode)
    .single()
  if (error) throw error
  return data as Session
}

export async function getSessionById(id: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Session
}
