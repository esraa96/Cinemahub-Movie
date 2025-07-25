import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key not found')
      return NextResponse.json({ 
        response: 'Hi! I\'m a movie AI assistant, but I need an OpenAI API key to work properly. Please add your OPENAI_API_KEY to the environment variables.' 
      })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful movie assistant. You can recommend movies, provide information about actors, directors, genres, and answer any movie-related questions. Keep your responses concise and engaging.'
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
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API Error:', response.status, errorData)
      
      if (response.status === 401) {
        return NextResponse.json({ 
          response: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.' 
        })
      }
      
      throw new Error(`OpenAI API request failed: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json({ 
      response: 'Sorry, I\'m having trouble connecting right now. Please make sure the OpenAI API key is properly configured.' 
    })
  }
}