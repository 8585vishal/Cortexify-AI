
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SendIcon, BrainIcon, MicrophoneIcon, PlusIcon, XIcon, CodeBracketIcon } from '../common/Icons';

// Type definitions for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

export interface Attachment {
    name: string;
    mimeType: string;
    data: string; // Base64 string
}

interface ChatInputProps {
  onSendMessage: (text: string, attachment?: Attachment) => void;
  isLoading: boolean;
  isThinkingMode: boolean;
  onToggleThinkingMode: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, isThinkingMode, onToggleThinkingMode }) => {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textBeforeListening = useRef<string>('');
  
  // Use a ref to control whether the message should be sent when recognition ends.
  const shouldSendMessageOnEnd = useRef(false);

  // Use refs for callbacks and state to avoid stale closures in listeners
  const onSendMessageRef = useRef(onSendMessage);
  useEffect(() => { onSendMessageRef.current = onSendMessage; }, [onSendMessage]);
  
  const attachmentRef = useRef(attachment);
  useEffect(() => { attachmentRef.current = attachment; }, [attachment]);

  const textRef = useRef(text);
  useEffect(() => { textRef.current = text; }, [text]);

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);
  
  useEffect(() => {
    if (!isSpeechRecognitionSupported) {
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognitionAPI();
    }
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setText(textBeforeListening.current + finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Suppress logging for common, non-critical errors.
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
      }
      stopListening();
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (shouldSendMessageOnEnd.current) {
        const finalText = textRef.current.trim();
        // Allow sending if there is text OR an attachment
        if (finalText || attachmentRef.current) {
          onSendMessageRef.current(finalText, attachmentRef.current || undefined);
          setText('');
          setAttachment(null);
        }
      }
      shouldSendMessageOnEnd.current = false; // Reset flag
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSpeechRecognitionSupported, stopListening]);

  const handleMicClick = () => {
    if (!isSpeechRecognitionSupported) return;

    if (isListening) {
      shouldSendMessageOnEnd.current = true;
      stopListening();
    } else {
      shouldSendMessageOnEnd.current = false;
      textBeforeListening.current = text.trim() ? text.trim() + ' ' : '';
      setText(textBeforeListening.current);
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          
          // Basic validation
          if (file.size > 20 * 1024 * 1024) { // 20MB limit
              alert("File size exceeds 20MB limit.");
              return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
              const base64String = event.target?.result as string;
              // Extract the base64 data part (remove "data:mime/type;base64,")
              const base64Data = base64String.split(',')[1];
              
              setAttachment({
                  name: file.name,
                  mimeType: file.type,
                  data: base64Data
              });
          };
          reader.readAsDataURL(file);
      }
      // Reset input value to allow selecting the same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearAttachment = () => {
      setAttachment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || attachment) && !isLoading) {
      shouldSendMessageOnEnd.current = false; // Don't send on end if sent manually
      stopListening();
      onSendMessage(text.trim(), attachment || undefined);
      setText('');
      setAttachment(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col gap-2">
        {attachment && (
            <div className="flex items-center self-start bg-purple-100 dark:bg-purple-900/30 backdrop-blur-md border border-purple-200 dark:border-purple-700/50 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-lg text-sm shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <CodeBracketIcon className="w-4 h-4 mr-2 opacity-70" />
                <span className="max-w-xs truncate font-medium">{attachment.name}</span>
                <button 
                    onClick={clearAttachment} 
                    className="ml-2 p-0.5 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full transition-colors"
                    title="Remove attachment"
                >
                    <XIcon className="w-3.5 h-3.5" />
                </button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-end p-2 bg-gray-100 dark:bg-gray-800 rounded-xl space-x-2 border border-transparent focus-within:border-purple-500/30 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all duration-300">
        
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/png,image/jpeg,image/webp,image/heic,image/heif,application/pdf"
        />
        
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            title="Upload file (PDF, Images)"
            aria-label="Upload file"
        >
            <PlusIcon className="w-5 h-5" />
        </button>

        <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening...' : (attachment ? "Ask something about this file..." : "Type your message here...")}
            className="flex-1 px-2 py-2 bg-transparent resize-none focus:outline-none max-h-40 placeholder-gray-500 dark:placeholder-gray-500 text-gray-900 dark:text-white text-base"
            rows={1}
            disabled={isLoading}
        />
        
        {isSpeechRecognitionSupported && (
            <div className="relative">
                <button
                type="button"
                onClick={handleMicClick}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isListening
                    ? 'text-red-500 bg-red-100 dark:bg-red-900/50'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                title={isListening ? 'Stop Listening & Send' : 'Use Microphone'}
                aria-label={isListening ? 'Stop voice input and send message' : 'Start voice input'}
                >
                <MicrophoneIcon className="w-5 h-5" />
                </button>
                {isListening && (
                    <div className="absolute -inset-1 rounded-lg border-2 border-red-500 animate-pulse" aria-hidden="true" />
                )}
            </div>
        )}
        <button
            type="button"
            onClick={onToggleThinkingMode}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isThinkingMode
                ? 'text-purple-500 bg-purple-100 dark:bg-purple-900/50'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title="Toggle Thinking Mode for complex queries (uses Gemini Pro)"
            aria-label="Toggle Thinking Mode"
        >
            <BrainIcon className="w-5 h-5" />
        </button>
        <button
            type="submit"
            disabled={isLoading || (!text.trim() && !attachment)}
            className="p-2 text-white bg-purple-600 rounded-lg disabled:bg-purple-400 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors shadow-md"
            aria-label="Send Message"
        >
            <SendIcon className="w-5 h-5" />
        </button>
        </form>
        <div className="text-center">
            <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                Cortexify can make mistakes. Please double check it.
            </p>
        </div>
    </div>
  );
};

export default ChatInput;
