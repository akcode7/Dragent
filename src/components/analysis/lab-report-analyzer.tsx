'use client';

import { useState } from 'react';

interface LabReportResult {
  analysis: string;
  recommendations?: string;
  abnormalValues?: { [key: string]: string };
  normalRanges?: { [key: string]: string };
  summary?: string;
  urgencyLevel?: 'normal' | 'attention' | 'urgent' | 'critical';
}

interface LabReportAnalyzerProps {
  result: LabReportResult | null;
  isLoading: boolean;
}

export default function LabReportAnalyzer({ result, isLoading }: LabReportAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'recommendations' | 'values'>('analysis');

  if (isLoading) {
    return (
      <div className="border rounded-lg p-6 mt-6">
        <div className="flex items-center justify-center py-10">
          <div className="animate-pulse flex flex-col items-center gap-4 w-full">
            <div className="h-4 bg-gray-200  rounded w-3/4"></div>
            <div className="h-4 bg-gray-200  rounded w-full"></div>
            <div className="h-4 bg-gray-200  rounded w-5/6"></div>
            <div className="h-4 bg-gray-200  rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  // Get urgency color based on level
  const getUrgencyColor = () => {
    switch (result.urgencyLevel) {
      case 'critical': return 'bg-red-500';
      case 'urgent': return 'bg-orange-500';
      case 'attention': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden mt-6">
      <div className="bg-teal-400  px-4 py-3 border-b">
        <div className="flex flex-wrap space-x-2">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeTab === 'analysis' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-black hover:bg-gray-100 '
            }`}
          >
            Lab Analysis
          </button>
          {result.abnormalValues && Object.keys(result.abnormalValues).length > 0 && (
            <button
              onClick={() => setActiveTab('values')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeTab === 'values' 
                  ? 'bg-white text-black shadow-sm' 
                  : 'text-black  hover:bg-gray-100 '
              }`}
            >
              Abnormal Values
            </button>
          )}
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeTab === 'recommendations' 
                ? 'bg-white text-black shadow-sm' 
                : 'text-black  hover:bg-gray-100 '
            }`}
          >
            Recommendations
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'analysis' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-black">Lab Report Analysis</h3>
              {result.urgencyLevel && (
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${getUrgencyColor()} mr-2`}></div>
                  <span className="text-sm capitalize">{result.urgencyLevel}</span>
                </div>
              )}
            </div>
            
            {result.summary && (
              <div className="mb-4 p-3 bg-gray-50  rounded-md">
                <p className="font-bold mb-1 text-black ">Summary</p>
                <p className="text-black font-medium">{result.summary}</p>
              </div>
            )}
            
            <div className="prose dark:prose-invert">
              <div className="whitespace-pre-wrap">
                <p  className="text-black font-medium">{result.analysis}</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'values' && result.abnormalValues && (
          <div>
            <h3 className="text-lg font-medium mb-4 text-black">Abnormal Values</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 ">
                <thead className="bg-gray-50 ">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Test</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Value</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Normal Range</th>
                  </tr>
                </thead>
                <tbody className="bg-white  divide-y divide-gray-200 ">
                  {Object.entries(result.abnormalValues).map(([test, value]) => (
                    <tr key={test}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 ">{test}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 ">{value}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                        {result.normalRanges?.[test] || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'recommendations' && (
          <div>
            <h3 className="text-lg font-medium mb-2 text-black">Recommendations</h3>
            <div className="prose bg-white p-5 rounded-md">
              <div className="whitespace-pre-wrap text-black">
                {result.recommendations || 'No specific recommendations provided.'}
              </div>
              <div className="mt-4 p-4 bg-amber-50  border border-amber-100  rounded-lg">
                <p className="text-amber-800  text-sm">
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