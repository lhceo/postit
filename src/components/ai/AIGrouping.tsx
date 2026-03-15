import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface AIGroupingProps {
  groups: Record<string, string[]>
  loading: boolean
  disabled: boolean
  onGroup: () => void
}

export function AIGrouping({ groups, loading, disabled, onGroup }: AIGroupingProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-bold text-gray-700 mb-3">AIによるグルーピング</h2>
      <Button onClick={onGroup} disabled={loading || disabled} className="w-full">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" /> 分析中...
          </span>
        ) : 'テーマ別に整理する'}
      </Button>
      {Object.keys(groups).length > 0 && (
        <div className="mt-4 space-y-3">
          {Object.entries(groups).map(([theme, ideas]) => (
            <div key={theme} className="bg-orange-50 rounded-xl p-3">
              <p className="font-bold text-orange-600 text-sm mb-1">{theme}</p>
              <ul className="space-y-1">
                {ideas.map((idea, i) => (
                  <li key={i} className="text-sm text-gray-700">• {idea}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
