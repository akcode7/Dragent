import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkinImage } from '@/lib/api/groq';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { image } = body;

    // Validate request
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Extract base64 data - remove prefix if present
    const base64Data = image.startsWith('data:image')
      ? image.split(',')[1]
      : image;

    // Analyze the skin image with AI
    const result = await analyzeSkinImage(base64Data);

    // Return analysis results
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing skin image:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze skin image' },
      { status: 500 }
    );
  }
}

// Set higher limit for this route to handle larger image files
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
};