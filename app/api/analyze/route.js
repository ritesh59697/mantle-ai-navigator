import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  const { data } = await request.json()
  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "You are a crypto analyst. Analyze Mantle blockchain data and give 2-3 short insights. Be concise and specific." },
      { role: "user", content: `Analyze this Mantle network data: ${JSON.stringify(data)}` }
    ],
    max_tokens: 200
  })
  return Response.json({ analysis: completion.choices[0].message.content })
}