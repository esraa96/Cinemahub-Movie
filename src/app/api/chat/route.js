import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if API key exists
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
    console.log('API Key exists:', !!apiKey)
    const apiUrl = process.env.DEEPSEEK_API_KEY 
      ? 'https://api.deepseek.com/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    const model = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-3.5-turbo'

    if (!apiKey) {
      return NextResponse.json({ 
        response: 'Hi! I\'m a movie AI assistant, but I need an API key to work properly. Please add DEEPSEEK_API_KEY or OPENAI_API_KEY to your environment variables.' 
      })
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
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
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', response.status, errorText)
      
      if (response.status === 401) {
        return NextResponse.json({ 
          response: 'Invalid API key. Please check your API key configuration.' 
        })
      }
      
      return NextResponse.json({ 
        response: 'Sorry, I\'m having trouble connecting to the AI service right now. Please try again later.' 
      })
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json({ 
      response: 'Sorry, I encountered an error. Please try again later.' 
    })
  }
}