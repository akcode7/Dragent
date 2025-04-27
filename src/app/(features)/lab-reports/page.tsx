'use client';

import { useState } from 'react';
import { LabReportUploader } from '@/components/analysis/lab-report-upload';
import LabReportAnalyzer from '@/components/analysis/lab-report-analyzer';

export default function LabReportsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleLabReportUpload = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/analyze-lab-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze lab report');
      }

      const data = await response.json();
      setAnalysisResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error analyzing lab report:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-black">Lab Report Analysis</h1>
        <p className="text-gray-600">
          Upload your lab report image for AI-powered analysis and interpretation.
          Our system can detect abnormal values and provide clinical context.
        </p>
      </div>

      <div className="bg-white  rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Your Lab Report</h2>
        <LabReportUploader 
          onUpload={(file) => handleLabReportUpload(file)} 
          isLoading={isAnalyzing} 
        />
        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md">
            <p>{error}</p>
          </div>
        )}
      </div>

      <LabReportAnalyzer result={analysisResult} isLoading={isAnalyzing} />

      <div className="mt-8 bg-blue-50  border border-blue-100  rounded-lg p-4">
        <h3 className="font-semibold text-blue-600  mb-2">About Lab Report Analysis</h3>
        <p className="text-sm text-blue-600 ">
          Our AI system uses advanced computer vision and medical knowledge to interpret your lab results.
          The system identifies abnormal values, explains their significance, and provides recommendations.
          However, always consult with a healthcare professional for proper medical advice.
        </p>
      </div>
    </div>
  );
}