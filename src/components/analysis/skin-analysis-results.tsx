'use client';

import { useState } from 'react';

interface SkinCondition {
  name: string;
  probability: number;
  description: string;
}

interface SkinAnalysisResultsProps {
  results: {
    summary: string;
    possibleConditions: SkinCondition[];
    recommendations: string[];
    severity: 'low' | 'moderate' | 'high' | 'unknown';
    followUpNeeded: boolean;
    differentialDiagnosis: string;
    skinType?: string;
    additionalObservations?: string;
  } | null;
  isLoading: boolean;
}

export default function SkinAnalysisResults({ 
  results, 
  isLoading 
}: SkinAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'conditions' | 'recommendations'>('summary');

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto mt-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="loader">
              <div className="flex space-x-2">
                <div className="h-3 w-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-3 w-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-3 w-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
            <p className="mt-4 text-gray-600">Analyzing skin image...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-400 to-blue-500 p-4">
          <h2 className="text-lg font-medium text-white">Skin Analysis Results</h2>
          <p className="text-white text-opacity-80 text-sm">
            AI-powered dermatological assessment
          </p>
        </div>
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'summary'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'conditions'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('conditions')}
          >
            Possible Conditions
          </button>
          <button
            className={`flex-1 py-3 px-4 text-sm font-medium ${
              activeTab === 'recommendations'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>
        
        {/* Tab content */}
        <div className="p-6">
          {/* Summary tab */}
          {activeTab === 'summary' && (
            <div>
              <div className="flex items-center mb-4">
                <span 
                  className={`text-xs font-medium py-1 px-2 rounded-full ${getSeverityColor(results.severity)}`}
                >
                  {results.severity.charAt(0).toUpperCase() + results.severity.slice(1)} Concern
                </span>
                {results.followUpNeeded && (
                  <span className="ml-2 text-xs font-medium py-1 px-2 rounded-full bg-blue-100 text-blue-800">
                    Follow-up Recommended
                  </span>
                )}
              </div>
              
              <div className="prose prose-sm max-w-none">
                <h3 className="text-gray-900">Analysis Summary</h3>
                <p className="text-gray-700">{results.summary}</p>
                
                {results.skinType && (
                  <div className="mt-4">
                    <h4 className="text-gray-900 font-medium text-sm">Skin Type</h4>
                    <p className="text-gray-700">{results.skinType}</p>
                  </div>
                )}
                
                {results.additionalObservations && (
                  <div className="mt-4">
                    <h4 className="text-gray-900 font-medium text-sm">Additional Observations</h4>
                    <p className="text-gray-700">{results.additionalObservations}</p>
                  </div>
                )}
                
                <div className="mt-4">
                  <h4 className="text-gray-900 font-medium text-sm">Differential Diagnosis</h4>
                  <p className="text-gray-700">{results.differentialDiagnosis}</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <em>Note: This is an AI-powered assessment and should not replace professional medical advice. 
                Please consult with a dermatologist for definitive diagnosis.</em>
              </div>
            </div>
          )}
          
          {/* Possible Conditions tab */}
          {activeTab === 'conditions' && (
            <div>
              <h3 className="text-gray-900 font-medium mb-4">Possible Conditions</h3>
              
              {results.possibleConditions.length > 0 ? (
                <div className="space-y-4">
                  {results.possibleConditions.map((condition, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{condition.name}</h4>
                        <div className="flex items-center space-x-1">
                          <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-teal-400"
                              style={{ width: `${condition.probability * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round(condition.probability * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{condition.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No specific conditions identified.</p>
              )}
              
              <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
                <em>Note: Probability percentages are estimates based on visual patterns and should be 
                confirmed by a professional dermatologist.</em>
              </div>
            </div>
          )}
          
          {/* Recommendations tab */}
          {activeTab === 'recommendations' && (
            <div>
              <h3 className="text-gray-900 font-medium mb-4">Recommendations</h3>
              
              {results.recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-teal-100 text-teal-500 flex items-center justify-center mr-2">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No specific recommendations available.</p>
              )}
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">When to see a doctor</h4>
                <p className="text-sm text-blue-700">
                  You should consult with a dermatologist if you notice:
                </p>
                <ul className="mt-2 text-sm text-blue-700 list-disc pl-5 space-y-1">
                  <li>Skin changes that don't heal within 2-3 weeks</li>
                  <li>Skin growths or moles that change in size, shape, or color</li>
                  <li>Spreading of the condition to other areas</li>
                  <li>Severe discomfort, pain or itching</li>
                  <li>Any symptoms that concern you</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}