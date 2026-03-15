interface AIInitialSuggestionProps {
  suggestion: string
}

export function AIInitialSuggestion({ suggestion }: AIInitialSuggestionProps) {
  if (!suggestion) return null
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
      <p className="text-xs text-orange-500 font-bold mb-1">✨ AIからの提案</p>
      <p className="text-sm text-gray-700 whitespace-pre-line">{suggestion}</p>
    </div>
  )
}
