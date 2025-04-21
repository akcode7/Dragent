'use client';

import { useState, useEffect } from 'react';
import VoiceChat from '@/components/chat/voice-chat';
import Image from 'next/image';

export default function TalkHealPage() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      // Here you'd normally call your AI API for chat responses
      // For now we'll use a simple echo response for demonstration
      const response = await fetch('/api/personal-ai-doc/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          currentState: { step: 5 } // Skip the initial questions flow
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      return data.response;
    } catch (error: any) {
      console.error('Error in chat:', error);
      return `I'm sorry, I encountered an error processing your request. ${error.message}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">TalkHeal - Voice Assisted Health Chat</h1>
            <p className="text-lg text-indigo-700">Get health guidance with a natural voice experience</p>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left side info */}
            <div className="col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 h-full">
                <h2 className="text-xl font-semibold text-indigo-900 mb-4">Voice Features</h2>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                      <span className="text-indigo-700 text-sm">✓</span>
                    </div>
                    <span className="text-slate-700">Lifelike text-to-speech responses</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                      <span className="text-indigo-700 text-sm">✓</span>
                    </div>
                    <span className="text-slate-700">Choose from 19 different English voices</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                      <span className="text-indigo-700 text-sm">✓</span>
                    </div>
                    <span className="text-slate-700">Instant health information and guidance</span>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                      <span className="text-indigo-700 text-sm">✓</span>
                    </div>
                    <span className="text-slate-700">Soothing voice interaction experience</span>
                  </li>
                </ul>
                
                {/* Decorative image */}
                <div className="mt-8 flex justify-center">
                  {isClient && (
                    <div className="relative h-40 w-40">
                      <Image 
                        src="/assets/images/voice-wave.svg"
                        alt="Voice wave visualization"
                        fill
                        className="object-contain"
                        style={{ opacity: 0.7 }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-6 text-sm text-gray-500 text-center">
                  Powered by Groq&apos;s PlayAI TTS technology
                </div>
              </div>
            </div>
            
            {/* Voice chat component */}
            <div className="col-span-2">
              {isClient && (
                <VoiceChat 
                  initialMessage="Hello! I'm your health assistant with voice capabilities. How can I help you today?"
                  onSendMessage={handleSendMessage}
                  selectedVoice="Celeste-PlayAI"
                />
              )}
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-white bg-opacity-70 rounded-lg text-sm text-center text-slate-600">
            This is for informational purposes only and not a substitute for professional medical advice. 
            Always consult qualified healthcare providers for medical concerns.
          </div>
        </div>
      </div>
    </div>
  );
}