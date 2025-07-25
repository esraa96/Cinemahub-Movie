import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      return NextResponse.json({ 
        response: 'عذراً، المساعد الذكي غير متاح حالياً. يرجى المحاولة لاحقاً.' 
      })
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'CinemaHub Movie Assistant'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful movie assistant. You can recommend movies, provide information about actors, directors, genres, and answer any movie-related questions. Keep your responses concise and engaging. Answer in Arabic if the user asks in Arabic.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API Error:', response.status, errorText)
      
      return NextResponse.json({ 
        response: 'عذراً، المساعد الذكي مشغول حالياً. يرجى المحاولة مرة أخرى خلال دقائق قليلة.' 
      })
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من إنشاء رد. يرجى المحاولة مرة أخرى.'

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ 
        response: 'عذراً، استغرق الرد وقتاً أطول من المتوقع. يرجى المحاولة مرة أخرى.' 
      })
    }
    
    console.error('API Error:', error)
    return NextResponse.json({ 
      response: 'عذراً، حدث خطأ مؤقت. يرجى المحاولة مرة أخرى.' 
    })
  }
}