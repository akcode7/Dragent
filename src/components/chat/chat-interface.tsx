'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialMessage?: string;
  onSendMessage: (message: string) => Promise<string>;
}

export default function ChatInterface({ initialMessage, onSendMessage }: ChatInterfaceProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add the initial message from the AI assistant when component mounts
  useEffect(() => {
    if (initialMessage) {
      setMessages([
        {
          id: 'initial',
          content: initialMessage,
          role: 'assistant',
          timestamp: new Date()
        }
      ]);
    }
  }, [initialMessage]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const userMessageObj: Message = {
      id: `user-${Date.now()}`,
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    setLoading(true);
    
    try {
      // Send message to backend and get response
      const response = await onSendMessage(userMessage);
      
      // Add assistant response to chat
      const assistantMessageObj: Message = {
        id: `assistant-${Date.now()}`,
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessageObj]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessageObj: Message = {
        id: `error-${Date.now()}`,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setLoading(false);
    }
  };

  // Format message content with line breaks
  const formatMessageContent = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              {formatMessageContent(message.content)}
              <div
                className={`text-xs mt-1 ${
                  message.role === 'user'
                    ? 'text-blue-200'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-800 dark:text-gray-200">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2 w-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          Not a replacement for professional medical advice. Consult a healthcare provider for medical concerns.
        </div>
      </form>
    </div>
  );
}