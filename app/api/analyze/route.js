import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  const { data } = await request.json()

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a crypto alpha analyst for Mantle blockchain. 
        Return a JSON object with two fields:
        1. "summary": 2-3 sentence market analysis
        2. "signals": array of 3 signal objects, each with "type", "message", and "severity" (high/medium/low)
        Return ONLY valid JSON, no markdown.`
      },
      {
        role: 'user',
        content: `Analyze this Mantle data and generate alpha signals: ${JSON.stringify(data)}`
      }
    ],
    max_tokens: 400
  })

  try {
    const parsed = JSON.parse(completion.choices[0].message.content || '{}')
    return Response.json(parsed)
  } catch {
    return Response.json({
      summary: completion.choices[0].message.content,
      signals: [
        { type: 'Volume', message: 'Rising wallet activity detected', severity: 'medium' },
        { type: 'DeFi', message: 'Liquidity increasing in major pools', severity: 'high' },
        { type: 'Network', message: 'Transaction count trending up', severity: 'low' }
      ]
    })
  }
}