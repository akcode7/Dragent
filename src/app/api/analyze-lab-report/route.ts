import { NextResponse, NextRequest } from 'next/server';
import { analyzeLabReport } from '@/lib/api/groq';

export const maxDuration = 120; // Set to the maximum allowed duration (in seconds)
export const dynamic = 'force-dynamic'; // Ensures the route is not cached

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Uploaded file is not an image' },
        { status: 400 }
      );
    }

    // Check file size (limit to 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Convert image to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Analyze the lab report
    const result = await analyzeLabReport(base64Image);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error in lab report analysis API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    );
  }
}