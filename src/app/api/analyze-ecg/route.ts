import { NextResponse } from 'next/server';
import { analyzeECGImage } from '@/lib/api/groq';

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();
    
    if (!imageBase64) {
      return NextResponse.json(
        { error: 'No image data provided' },
        { status: 400 }
      );
    }

    // Check if the image data is valid base64
    if (!isValidBase64(imageBase64)) {
      return NextResponse.json(
        { error: 'Invalid image data format' },
        { status: 400 }
      );
    }

    // Call the Groq API to analyze the image (server-side)
    const analysisResult = await analyzeECGImage(imageBase64);
    
    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error in ECG analysis API route:', error);
    
    // Return the specific error message for better client-side debugging
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to analyze ECG image';
      
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' 
          ? String(error) 
          : undefined 
      },
      { status: 500 }
    );
  }
}

// Helper function to validate base64 data
function isValidBase64(str: string) {
  try {
    // Check if string contains only valid base64 characters
    if (!/^[A-Za-z0-9+/=]+$/.test(str)) {
      return false;
    }
    
    // Try to decode it
    const decoded = Buffer.from(str, 'base64').toString('base64');
    return decoded === str;
  } catch {
    return false;
  }
}