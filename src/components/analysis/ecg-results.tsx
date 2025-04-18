'use client';

import { useState } from 'react';

interface ECGResult {
  analysis: string;
  recommendations?: string;
  confidence?: number;
}

interface ECGResultsProps {
  result: ECGResult | null;
  isLoading: boolean;
}

export default function ECGResults({ result, isLoading }: ECGResultsProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'recommendations'>('analysis');

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 mt-6">
        <div className="flex items-center justify-center py-10">
          <div className="animate-pulse flex flex-col items-center gap-4 w-full">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden mt-6">
      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeTab === 'analysis' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'
            }`}
          >
            ECG Analysis
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeTab === 'recommendations' 
                ? 'bg-white dark:bg-gray-700 shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750'
            }`}
          >
            Recommendations
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'analysis' && (
          <div>
            <h3 className="text-lg font-medium mb-2">ECG Analysis</h3>
            <div className="prose dark:prose-invert">
              {result.confidence && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Confidence: {result.confidence}%
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className="bg-teal-500 h-2.5 rounded-full" 
                      style={{ width: `${result.confidence}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="whitespace-pre-wrap">
                {result.analysis}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'recommendations' && (
          <div>
            <h3 className="text-lg font-medium mb-2">Recommendations</h3>
            <div className="prose dark:prose-invert">
              <div className="whitespace-pre-wrap">
                {result.recommendations || 'No specific recommendations provided.'}
              </div>
              <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg">
                <p className="text-amber-800 dark:text-amber-400 text-sm">
                  <strong>Important:</strong> This analysis is provided for informational purposes only and should not replace professional medical advice. Please consult with a healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}