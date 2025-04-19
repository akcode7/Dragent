'use client';

import { useState } from 'react';
import { ECGUploader } from '@/components/analysis/ecg-uploader';
import ECGResults from '@/components/analysis/ecg-results';

export default function ECGAnalysisPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    analysis: string;
    recommendations?: string;
    confidence?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleECGUpload = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setResult(null);
      setError(null);
      
      // Validate the file type
      if (!file.type.startsWith('image/')) {
        setError("Uploaded file is not an image. Please upload a valid ECG image.");
        setIsAnalyzing(false);
        return;
      }
      
      // Validate the file size (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > MAX_SIZE) {
        setError("File size exceeds 10MB. Please upload a smaller image.");
        setIsAnalyzing(false);
        return;
      }
      
      // Convert the file to base64
      const base64Data = await fileToBase64(file);
      const base64String = base64Data.split(',')[1]; // Remove the data URL prefix
      
      // Use the server-side API route instead of directly calling Groq
      const response = await fetch('/api/analyze-ecg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64: base64String }),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        // Handle specific error messages from the server
        const errorMsg = responseData.error || 'Server responded with an error';
        const details = responseData.details ? `: ${responseData.details}` : '';
        throw new Error(`${errorMsg}${details}`);
      }
      
      // Check if the response has the expected structure
      if (!responseData.heartRate || !responseData.rhythm || !responseData.interpretation) {
        throw new Error('The AI model returned an incomplete analysis. Please try again with a clearer ECG image.');
      }
      
      // Format the result for display
      const formattedResult = {
        analysis: `Heart Rate: ${responseData.heartRate}\n\nRhythm: ${responseData.rhythm}\n\n${
          responseData.abnormalities && responseData.abnormalities.length > 0
            ? `Abnormalities: ${responseData.abnormalities.join(', ')}\n\n`
            : ''
        }Interpretation: ${responseData.interpretation}`,
        recommendations: responseData.recommendations?.join('\n\n'),
        confidence: calculateConfidence(responseData.severityLevel)
      };
      
      setResult(formattedResult);
    } catch (error) {
      console.error('Error analyzing ECG:', error);
      setError(error instanceof Error ? error.message : 'There was an error analyzing your ECG image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Helper function to convert severity level to confidence percentage
  const calculateConfidence = (severityLevel?: string): number => {
    switch (severityLevel) {
      case 'normal':
        return 90;
      case 'mild':
        return 75;
      case 'moderate':
        return 60;
      case 'severe':
        return 85; // High confidence in severe issues detection
      default:
        return 70;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">ECG Analysis</h1>
          <p className="mt-2 text-blue-600">
            Upload an electrocardiogram (ECG) image for AI-powered analysis and interpretation.
          </p>
        </div>

        <hr className="border-t border-gray-200 dark:border-gray-800 my-6" />

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Upload ECG Image</h2>
            <ECGUploader 
              onUpload={(file) => handleECGUpload(file)} 
              isLoading={isAnalyzing}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-4 bg-red-100 hover:bg-red-200 text-red-700 text-sm px-2 py-1 rounded"
              >
                Dismiss
              </button>
            </div>
          )}

          {(isAnalyzing || result) && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <ECGResults 
                result={result}
                isLoading={isAnalyzing}
              />
            </div>
          )}

          <div className="rounded-lg border border-amber-200 bg-amber-100   p-4 mt-6">
            <h3 className="text-lg font-medium text-amber-800 ">Important Notice</h3>
            <p className="mt-2 text-amber-700 ">
              This ECG analysis is provided for informational purposes only and should not replace professional medical evaluation. 
              Always consult with a healthcare provider for proper diagnosis and treatment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}