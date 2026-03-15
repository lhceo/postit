import { Note, NoteColor } from '@/types'

const COLORS: { label: string; value: NoteColor }[] = [
  { label: '黄', value: 'yellow' },
  { label: 'ピンク', value: 'pink' },
  { label: '青', value: 'blue' },
  { label: '緑', value: 'green' },
  { label: '紫', value: 'purple' },
]

interface CategoryFilterProps {
  notes: Note[]
  filter: NoteColor | 'all'
  onChange: (filter: NoteColor | 'all') => void
}

export function CategoryFilter({ notes, filter, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onChange('all')}
        className={`px-3 py-1 rounded-lg text-sm transition ${filter === 'all' ? 'bg-gray-700 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
      >
        すべて ({notes.length})
      </button>
      {COLORS.map((c) => {
        const count = notes.filter((n) => n.color === c.value).length
        if (count === 0) return null
        return (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            className={`px-3 py-1 rounded-lg text-sm transition ${filter === c.value ? 'bg-gray-700 text-white' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
          >
            {c.label} ({count})
          </button>
        )
      })}
    </div>
  )
}
