'use client';

import { useState } from 'react';
import ChatInterface from '@/components/chat/chat-interface';

export default function PersonalAIDoc() {
  const [conversationState, setConversationState] = useState({
    step: 0,
    patient: {
      name: '',
      age: '',
      sex: '',
      symptoms: [],
      country: '',
      state: '',
      isConstant: false,
      severity: 0,
      duration: '',
      previousConditions: [],
      medications: []
    },
    category: ''
  });

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      let updatedState = { ...conversationState };
      
      // Initial greeting - get name if not already set
      if (updatedState.step === 0 && !updatedState.patient.name) {
        updatedState.patient.name = message;
        updatedState.step = 1;
        setConversationState(updatedState);
        return `Hi ${message}, please describe what medical concerns you'd like to discuss today? I can help with a wide range of symptoms and health concerns.`;
      }

      // Send to API for processing
      const response = await fetch('/api/personal-ai-doc/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          currentState: updatedState
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      const data = await response.json();
      setConversationState(data.newState);
      return data.response;
    } catch (error: any) {
      console.error('Chat error:', error);
      return `Sorry, I encountered an error: ${error.message}. Please try again.`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Personal AI Doctor</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Consult with our AI doctor about any health symptoms or concerns. Not a replacement for professional medical advice.
          </p>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-600 dark:text-blue-300">
              <strong>Note:</strong> This is an AI assistant and not a substitute for professional medical advice. 
              Always consult with a healthcare provider for medical concerns.
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <ChatInterface 
            onSendMessage={handleSendMessage}
            initialMessage="Welcome to your Personal AI Doctor. I'm here to help assess your symptoms for a wide range of medical concerns. Please start by telling me your name."
          />
        </div>
      </div>
    </div>
  );
}