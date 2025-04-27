'use client';

import { useState } from 'react';
import Image from 'next/image';
import SkinPhotoUploader from '@/components/analysis/skin-photo-uploader';
import SkinAnalysisResults from '@/components/analysis/skin-analysis-results';

export default function DermatologyAIPage() {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleImageUpload = (base64Image: string) => {
    setImageBase64(base64Image);
    setAnalysisResults(null);
    setError('');
  };

  const handleReset = () => {
    setImageBase64('');
    setAnalysisResults(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setError('Please upload an image to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-skin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResults(data);
    } catch (err) {
      console.error('Error analyzing skin image:', err);
      setError('Failed to analyze the image. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Dermatology Assistant</h1>
          <p className="mt-2 text-gray-600">
            Upload a photo of your skin concern for AI-powered analysis
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className=" rounded-full p-3 w-24 h-24 flex items-center justify-center">
                  <Image 
                    src="/assets/icons/skin.png" 
                    alt="Dermatology" 
                    width={150} 
                    height={150}
                    className="text-white"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">How It Works</h2>
                <p className="text-gray-600">
                  Our AI analyzes your skin image to identify potential conditions and provide recommendations.
                  Simply upload a clear photo of the affected area.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-blue-500 font-bold text-lg mb-1">1</div>
                <h3 className="font-medium text-gray-900">Upload</h3>
                <p className="text-sm text-gray-600">Upload a clear, well-lit image of your skin concern</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-blue-500 font-bold text-lg mb-1">2</div>
                <h3 className="font-medium text-gray-900">Analyze</h3>
                <p className="text-sm text-gray-600">Our AI analyzes the image and identifies potential conditions</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-blue-500 font-bold text-lg mb-1">3</div>
                <h3 className="font-medium text-gray-900">Review</h3>
                <p className="text-sm text-gray-600">Get insights and recommendations for your skin concern</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
              <strong>Important:</strong> This tool is for informational purposes only and does not replace professional medical advice.
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-4">
              <h2 className="text-lg font-medium text-white">Skin Condition Analysis</h2>
            </div>
            <div className="p-6">
              <SkinPhotoUploader
                onUploadComplete={handleImageUpload}
                onReset={handleReset}
                isLoading={isAnalyzing}
              />

              {imageBase64 && !isAnalyzing && !analysisResults && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleAnalyze}
                    className="bg-gradient-to-r from-teal-400 to-blue-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-teal-300"
                    disabled={isAnalyzing}
                  >
                    Analyze Image
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          <SkinAnalysisResults
            results={analysisResults}
            isLoading={isAnalyzing}
          />

          {/* Tips Section */}
          {!imageBase64 && (
            <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tips for Better Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Do:</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Take photos in good, natural lighting</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Focus clearly on the affected area</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Include a reference for size if relevant (e.g., coin)</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Take multiple angles if possible</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Don't:</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Use flash photography (causes glare)</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Take blurry or out-of-focus photos</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Apply creams or makeup before taking the photo</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Take photos in poorly lit conditions</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 text-xs text-gray-500">
                  Remember: Always follow up with a dermatologist for proper diagnosis and treatment. 
                  This AI tool is meant to provide information only and is not a substitute for professional medical care.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}