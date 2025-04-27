'use client';

import { useState, useRef, useEffect } from 'react';


interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
}

interface VoiceChatProps {
  initialMessage?: string;
  onSendMessage: (message: string) => Promise<string>;
  selectedVoice?: string;
}

export default function VoiceChat({ 
  initialMessage = "Hello! I'm your AI assistant. How can I help you today?", 
  onSendMessage, 
  selectedVoice = 'Fritz-PlayAI' 
}: VoiceChatProps) {
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [availableVoices, setAvailableVoices] = useState<string[]>([
    'Arista-PlayAI', 'Atlas-PlayAI', 'Basil-PlayAI', 'Briggs-PlayAI', 
    'Calum-PlayAI', 'Celeste-PlayAI', 'Cheyenne-PlayAI', 'Chip-PlayAI',
    'Cillian-PlayAI', 'Deedee-PlayAI', 'Fritz-PlayAI', 'Gail-PlayAI',
    'Indigo-PlayAI', 'Mamaw-PlayAI', 'Mason-PlayAI', 'Mikail-PlayAI',
    'Mitch-PlayAI', 'Quinn-PlayAI', 'Thunder-PlayAI'
  ]);
  const [voice, setVoice] = useState<string>(selectedVoice);
  const [audioPlaying, setAudioPlaying] = useState<string | null>(null);
  const [autoRecordMode, setAutoRecordMode] = useState<boolean>(false);
  
  const audioRefs = useRef<{[key: string]: HTMLAudioElement}>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // SpeechRecognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
            
          setTranscript(transcript);
          
          // Reset silence timer when speech is detected
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              if (recording) {
                stopRecording();
              }
            }, 1500); // Stop after 1.5s of silence
          }
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          if (recording) {
            stopRecording();
          }
        };
        
        recognitionRef.current.onend = () => {
          // Recognition service has disconnected
          if (recording) {
            recognitionRef.current?.start();
          }
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, []);

  // Add the initial message from the AI assistant when component mounts
  useEffect(() => {
    if (initialMessage) {
      const initialMsg = {
        id: 'initial',
        content: initialMessage,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages([initialMsg]);
      generateSpeech(initialMessage, initialMsg.id);
    }
  }, [initialMessage]);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up auto-recording after AI finishes speaking
  useEffect(() => {
    if (!audioPlaying && autoRecordMode && !recording && messages.length > 0) {
      // Add a small delay before activating the mic to feel more natural
      const timer = setTimeout(() => {
        startRecording();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [audioPlaying, autoRecordMode, recording, messages]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          // Ignore errors when stopping
        }
      }
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
      }
      
      // Clean up audio object URLs
      Object.values(audioRefs.current).forEach(audio => {
        if (audio.src) {
          URL.revokeObjectURL(audio.src);
        }
      });
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up data handling
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // When recording stops
      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Process recording if we have chunks
        if (audioChunksRef.current.length > 0 && transcript.trim()) {
          await processVoiceInput(transcript.trim());
        }
        
        setRecording(false);
      };
      
      // Start recording
      mediaRecorder.start();
      setRecording(true);
      setTranscript('');
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
      
      // Set timeout to automatically stop recording after 15 seconds
      recordingTimerRef.current = setTimeout(() => {
        stopRecording();
      }, 15000);
      
      // Set timeout to detect silence
      silenceTimerRef.current = setTimeout(() => {
        stopRecording();
      }, 3000); // Stop after 3s of initial silence
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors when stopping recognition
      }
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    if (recordingTimerRef.current) {
      clearTimeout(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const processVoiceInput = async (voiceText: string) => {
    // Add user message to chat
    const userMessageObj: Message = {
      id: `user-${Date.now()}`,
      content: voiceText,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    setLoading(true);
    
    try {
      // Send message to backend and get response
      const response = await onSendMessage(voiceText);
      
      // Add assistant response to chat
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessageObj: Message = {
        id: assistantMessageId,
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessageObj]);
      
      // Generate speech for the assistant's response
      await generateSpeech(response, assistantMessageId);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessageId = `error-${Date.now()}`;
      const errorMessageObj: Message = {
        id: errorMessageId,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setLoading(false);
    }
  };

  const generateSpeech = async (text: string, messageId: string) => {
    try {
      setSpeaking(true);
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, audioUrl } : msg
        )
      );

      // Create and play audio element
      const audio = new Audio(audioUrl);
      audioRefs.current[messageId] = audio;
      
      audio.onended = () => {
        setAudioPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      setAudioPlaying(messageId);
      audio.play();
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setSpeaking(false);
    }
  };

  const handlePlayPause = (messageId: string, audioUrl?: string) => {
    if (!audioUrl) return;
    
    // If this message is already playing, pause it
    if (audioPlaying === messageId) {
      audioRefs.current[messageId].pause();
      setAudioPlaying(null);
      return;
    }
    
    // If another message is playing, pause it
    if (audioPlaying && audioRefs.current[audioPlaying]) {
      audioRefs.current[audioPlaying].pause();
    }
    
    // Play the selected message
    if (audioRefs.current[messageId]) {
      setAudioPlaying(messageId);
      audioRefs.current[messageId].play();
    } else {
      // If audio ref doesn't exist, create a new one
      const audio = new Audio(audioUrl);
      audioRefs.current[messageId] = audio;
      
      audio.onended = () => {
        setAudioPlaying(null);
      };
      
      setAudioPlaying(messageId);
      audio.play();
    }
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
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessageObj: Message = {
        id: assistantMessageId,
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessageObj]);
      
      // Generate speech for the assistant's response
      await generateSpeech(response, assistantMessageId);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessageId = `error-${Date.now()}`;
      const errorMessageObj: Message = {
        id: errorMessageId,
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
    <div className="flex flex-col h-[700px] bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl shadow-lg">
      {/* Header with voice selector */}
      <div className="p-4 bg-white bg-opacity-70 backdrop-blur-sm rounded-t-xl border-b border-indigo-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-indigo-900">Voice Chat Assistant</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="voice" className="text-sm text-indigo-800">Voice:</label>
          <select 
            id="voice"
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="bg-white text-indigo-900 border border-indigo-200 rounded-md px-2 py-1 text-sm"
            disabled={speaking || loading}
          >
            {availableVoices.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          
          {/* Auto-record toggle switch */}
          <div className="flex items-center ml-3">
            <span className="text-sm text-indigo-800 mr-2">Auto:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={autoRecordMode}
                onChange={() => setAutoRecordMode(!autoRecordMode)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-indigo-400 peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: 'url(/assets/images/subtle-pattern.png)', backgroundSize: 'cover' }}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                  : 'bg-white text-slate-800'
              }`}
            >
              <div className="mb-2">{formatMessageContent(message.content)}</div>
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-xs ${
                    message.role === 'user'
                      ? 'text-indigo-200'
                      : 'text-slate-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                
                {message.role === 'assistant' && (
                  <button
                    onClick={() => handlePlayPause(message.id, message.audioUrl)}
                    disabled={!message.audioUrl}
                    className={`p-1.5 rounded-full ${
                      audioPlaying === message.id
                        ? 'bg-red-100 text-red-600'
                        : 'bg-indigo-100 text-indigo-600'
                    } hover:opacity-80 transition-opacity disabled:opacity-50`}
                  >
                    {audioPlaying === message.id ? (
                      <PauseIcon className="h-4 w-4" />
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {recording && (
          <div className="flex justify-start">
            <div className="bg-white rounded-xl px-5 py-3 shadow-sm text-slate-700">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">
                  {transcript ? transcript : "Listening..."}
                </span>
              </div>
            </div>
          </div>
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-xl px-4 py-3 shadow-sm">
              <div className="flex space-x-1.5">
                <div className="h-2.5 w-2.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="h-2.5 w-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="h-2.5 w-2.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form with voice button */}
      <form onSubmit={handleSubmit} className="p-4 bg-white bg-opacity-70 backdrop-blur-sm border-t border-indigo-100 rounded-b-xl">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={loading || speaking}
            className={`px-3 rounded-xl flex items-center justify-center transition-all ${
              recording 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
            }`}
          >
            {recording ? <MicOffIcon className="h-6 w-6" /> : <MicIcon className="h-6 w-6" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading || recording}
            className="flex-1 px-4 py-3 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm text-slate-800 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || recording}
            className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 shadow-sm flex items-center gap-2 transition-all"
          >
            <span>Send</span>
            <SendIcon className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

// SVG Icons
function PlayIcon({ className = "h-6 w-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PauseIcon({ className = "h-6 w-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SendIcon({ className = "h-6 w-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function MicIcon({ className = "h-6 w-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
}

function MicOffIcon({ className = "h-6 w-6" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" strokeDasharray="2 2" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
    </svg>
  );
}