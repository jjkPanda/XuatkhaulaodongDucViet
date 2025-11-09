import { convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const systemPrompt = `You are a helpful AI assistant for "Chương trình Xuất khẩu Lao động Đức" (German Labor Export Program). 
You provide information about working opportunities in Germany, visa processes, salary ranges, benefits, and job categories.
Always respond in Vietnamese (Tiếng Việt). Be professional, friendly, and helpful.
If asked about topics outside the program scope, politely redirect to the program's offerings.

Key information to share when relevant:
- Salary: 25-40 million VND/month (3-5x higher than Vietnam)
- Job categories: Nursing, Mechanics, Construction, Hospitality, and others
- Benefits: Full social insurance, healthcare, pension, paid vacation
- Timeline: Usually 2-3 months from registration to departure
- Visa: EU Blue Card with path to permanent residency
- Family reunion: Possible after 6 months of employment`

  const modelMessages = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    messages: modelMessages,
    maxOutputTokens: 512,
    temperature: 0.7,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
