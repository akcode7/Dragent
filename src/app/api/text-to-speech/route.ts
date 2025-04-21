import { NextResponse } from 'next/server';
import { groqClient } from '@/lib/api/groq';

export async function POST(request: Request) {
  try {
    const { text, voice = 'Fritz-PlayAI' } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate that we have the Groq API key
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    // Make request to Groq's TTS API
    const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'playai-tts', // Using the English TTS model
        input: text,
        voice: voice,
        response_format: 'wav',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error from Groq TTS API:', errorData);
      
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to generate speech' },
        { status: response.status }
      );
    }

    // Get the audio data as a buffer
    const audioBuffer = await response.arrayBuffer();

    // Return the audio data
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}