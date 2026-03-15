import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateInitialSuggestion(topic: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `ブレインストーミングのトピック「${topic}」について、参加者が最初のアイデアを出すきっかけになる提案を3つ、簡潔に日本語で出してください。箇条書きで。`,
      },
    ],
  })
  return message.content[0].type === 'text' ? message.content[0].text : ''
}

export async function groupNotesByTheme(notes: string[]): Promise<Record<string, string[]>> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: `以下のアイデアをテーマ別にグループ分けしてください。JSON形式で返してください。{"テーマ名": ["アイデア1", "アイデア2"]}の形式で。\n\nアイデア:\n${notes.join('\n')}`,
      },
    ],
  })
  const text = message.content[0].type === 'text' ? message.content[0].text : '{}'
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
  } catch {
    return {}
  }
}

export async function summarizeNotes(notes: string[], topic: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `トピック「${topic}」に関する以下のブレインストーミング結果を100字程度で要約してください。\n\n${notes.join('\n')}`,
      },
    ],
  })
  return message.content[0].type === 'text' ? message.content[0].text : ''
}
