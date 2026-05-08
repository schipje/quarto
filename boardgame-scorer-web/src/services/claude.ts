import { ScoreResult } from '../types'

interface ImageBlock {
  type: 'image'
  source: {
    type: 'base64'
    media_type: 'image/jpeg'
    data: string
  }
}

interface TextBlock {
  type: 'text'
  text: string
}

type ContentBlock = ImageBlock | TextBlock

export async function scoreWithClaude(
  apiKey: string,
  prompt: string,
  photos: Array<{ label: string; dataUrl: string }>,
): Promise<ScoreResult> {
  if (!apiKey) {
    throw new Error('No API key set. Go to Settings and enter your Claude API key.')
  }

  const content: ContentBlock[] = []

  for (const photo of photos) {
    content.push({ type: 'text', text: `Photo: ${photo.label}` })
    const base64 = photo.dataUrl.replace(/^data:image\/[a-z]+;base64,/, '')
    content.push({
      type: 'image',
      source: { type: 'base64', media_type: 'image/jpeg', data: base64 },
    })
  }

  content.push({ type: 'text', text: prompt })

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } }).error?.message ?? `API error ${response.status}`
    throw new Error(msg)
  }

  const data = await response.json() as { content: Array<{ type: string; text?: string }> }
  const rawText = data.content.find(b => b.type === 'text')?.text ?? ''

  return parseScoreResult(rawText)
}

function parseScoreResult(raw: string): ScoreResult {
  // Strip markdown code fences
  let cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()

  // Extract first JSON object
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) {
    throw new Error('Claude did not return valid JSON. Response: ' + raw.slice(0, 200))
  }
  cleaned = cleaned.slice(start, end + 1)

  const parsed = JSON.parse(cleaned) as ScoreResult
  return parsed
}

export async function testConnection(apiKey: string): Promise<void> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const msg = (err as { error?: { message?: string } }).error?.message ?? `API error ${response.status}`
    throw new Error(msg)
  }
}
