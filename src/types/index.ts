export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple'

export interface Session {
  id: string
  title: string
  description: string | null
  host_id: string
  share_code: string
  is_active: boolean
  created_at: string
}

export interface Note {
  id: string
  session_id: string
  content: string
  author_name: string
  color: NoteColor
  position_x: number
  position_y: number
  likes: number
  category: string | null
  parent_id: string | null
  created_at: string
}

export interface Participant {
  id: string
  session_id: string
  nickname: string
  joined_at: string
}
