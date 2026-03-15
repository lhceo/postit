import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface AISummaryProps {
  summary: string
  loading: boolean
  disabled: boolean
  onSummarize: () => void
}

export function AISummary({ summary, loading, disabled, onSummarize }: AISummaryProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h2 className="font-bold text-gray-700 mb-3">AIサマリー</h2>
      <Button onClick={onSummarize} disabled={loading || disabled} className="w-full">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" /> 生成中...
          </span>
        ) : 'サマリーを生成する'}
      </Button>
      {summary && (
        <div className="mt-4 bg-gray-50 rounded-xl p-3">
          <p className="text-sm text-gray-700">{summary}</p>
        </div>
      )}
    </div>
  )
}
