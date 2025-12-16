
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, ChatSession, ChatSettings } from '../../types';
import ChatMessage from './ChatMessage';
import ChatInput, { Attachment } from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { generateResponseStream, editContentStream, generateChatTitle, PRO_MODEL_NAME } from '../../services/geminiService';
import { SettingsIcon, DownloadIcon, MenuIcon } from '../common/Icons';
import ChatWelcome from './ChatWelcome';

type EditAction = 'shorter' | 'longer' | 'explain';

interface ChatAreaProps {
  session: ChatSession | null;
  settings: ChatSettings;
  onMessagesUpdate: (sessionId: string, messages: Message[]) => void;
  onOpenSettings: () => void;
  modelName: string;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onNewChat: () => void;
  onOpenSidebar: () => void; // New prop to open sidebar
}

const ChatArea: React.FC<ChatAreaProps> = ({ session, settings, onMessagesUpdate, onOpenSettings, modelName, onRenameSession, onNewChat, onOpenSidebar }) => {
  const [messages, setMessages] = useState<Message[]>(session?.messages || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkingMode, setIsThinkingMode] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  // Ref to track if user is at the bottom. Default to true to scroll on load.
  const isUserNearBottomRef = useRef(true);

  const titleGeneratedRef = useRef(false);
  
  // Ref to hold the AbortController for cleaning up on unmount or new requests
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (session) {
      setMessages(session.messages);
      if (session.messages.length === 0) {
        titleGeneratedRef.current = false;
      }
      // Reset scroll lock on session change
      isUserNearBottomRef.current = true;
    } else {
      setMessages([]);
      titleGeneratedRef.current = false;
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      onMessagesUpdate(session.id, messages);
    }
  }, [messages, session, onMessagesUpdate]);

  // Smart Auto-Scroll Logic
  const handleScroll = () => {
      if (scrollRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
          const distanceToBottom = scrollHeight - scrollTop - clientHeight;
          // Consider user near bottom if within 100px.
          // This allows for small layout shifts or padding without losing lock.
          isUserNearBottomRef.current = distanceToBottom < 150;
      }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const lastMsg = messages[messages.length - 1];
    const isUserMessage = lastMsg?.sender === 'user';
    
    // Always scroll to bottom for new user messages or if we are editing
    if (isUserMessage || editingMessageId) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        isUserNearBottomRef.current = true; // Re-engage lock
        return;
    }

    // For AI messages (streaming), only scroll if user hasn't manually scrolled up
    if (isUserNearBottomRef.current) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, isLoading, editingMessageId]);

  useEffect(() => {
    const generateTitleIfNeeded = async () => {
        if (
            session &&
            session.title === 'New Conversation' &&
            messages.length >= 1 &&
            messages[0].sender === 'user' &&
            !titleGeneratedRef.current
        ) {
            titleGeneratedRef.current = true;
            const userMessage = messages[0].text;
            const newTitle = await generateChatTitle(userMessage);
            if (newTitle && newTitle !== 'New Conversation') {
                onRenameSession(session.id, newTitle);
            }
        }
    };
    generateTitleIfNeeded();
  }, [messages, session, onRenameSession]);

  const handleSendMessage = async (text: string, attachment?: Attachment) => {
    const historyForApi = [...messages]; 
    
    // If there's an attachment, add visual indication to the message text
    let displayText = text;
    if (attachment) {
        const fileLabel = `\n\n*[Attached File: ${attachment.name}]*`;
        displayText = text ? text + fileLabel : `[Analyzed File: ${attachment.name}]`;
    }

    const userMessage: Message = { id: `user-${Date.now()}`, text: displayText, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    // Ensure we scroll to bottom when starting
    isUserNearBottomRef.current = true;

    const aiMessageId = `ai-${Date.now()}`;
    // Initialize AI message
    setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);
    
    // Variables for the smooth typing effect
    let fullResponseReceived = '';
    let currentlyDisplayed = '';
    let isStreamComplete = false;
    let typeInterval: any = null;

    try {
      // Pass the attachment to the service
      const stream = generateResponseStream(text, historyForApi, settings, isThinkingMode, attachment);
      
      // START TYPEWRITER EFFECT LOOP
      // This loop runs independently of the API stream to ensure smooth animation
      typeInterval = setInterval(() => {
          if (currentlyDisplayed.length < fullResponseReceived.length) {
              // Calculate adaptive speed. 
              // If we have a lot of text buffered, type faster.
              const bufferSize = fullResponseReceived.length - currentlyDisplayed.length;
              let charsToAdd = 1;
              
              if (bufferSize > 50) charsToAdd = 5;
              else if (bufferSize > 20) charsToAdd = 3;
              else if (bufferSize > 10) charsToAdd = 2;

              const nextChunk = fullResponseReceived.slice(currentlyDisplayed.length, currentlyDisplayed.length + charsToAdd);
              currentlyDisplayed += nextChunk;
              
              setMessages(prev => prev.map(msg => 
                  msg.id === aiMessageId ? { ...msg, text: currentlyDisplayed } : msg
              ));
          } else if (isStreamComplete) {
              // Only clear interval if stream is done AND we've displayed everything
              clearInterval(typeInterval);
          }
      }, 10); // Run every 10ms for 100fps smoothness

      for await (const chunk of stream) {
        fullResponseReceived += chunk;
      }
      isStreamComplete = true;

    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      clearInterval(typeInterval);
      setMessages(prev => [...prev, { id: `ai-error-${Date.now()}`, text: "Sorry, I encountered an error. Please try again.", sender: 'ai' }]);
    } finally {
      // We don't set isLoading(false) immediately if there is still text to type
      // Check every 100ms if typing is done
      const finishCheck = setInterval(() => {
          if (currentlyDisplayed.length >= fullResponseReceived.length) {
              clearInterval(finishCheck);
              if (typeInterval) clearInterval(typeInterval);
              setIsLoading(false);
          }
      }, 100);
    }
  };
  
  const handleEditMessage = async (messageId: string, action: EditAction) => {
    const originalMessage = messages.find(m => m.id === messageId);
    if (!originalMessage || editingMessageId) return;

    setEditingMessageId(messageId);
    isUserNearBottomRef.current = true; // Reset scroll lock
    
    try {
        const stream = editContentStream(originalMessage.text, action);
        let fullResponse = '';
        let isFirstChunk = true;

        for await (const chunk of stream) {
            fullResponse += chunk;
            if (isFirstChunk) {
                 setMessages(prev => prev.map(msg =>
                    msg.id === messageId ? { ...msg, text: fullResponse } : msg
                ));
                isFirstChunk = false;
            } else {
                setMessages(prev => prev.map(msg =>
                    msg.id === messageId ? { ...msg, text: fullResponse } : msg
                ));
            }
        }
    } catch (error) {
        console.error('Error editing content:', error);
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, text: originalMessage.text } : msg
        ));
    } finally {
        setEditingMessageId(null);
    }
  };

  const handleExportChat = () => {
    if (!session) return;
    const timestamp = new Date().toLocaleString();
    const title = `# Chat: ${session.title}\n\n**Exported on:** ${timestamp}\n\n---\n\n`;
    const content = messages.map(msg => {
      const prefix = msg.sender === 'user' ? '**User:**' : '**AI:**';
      return `${prefix}\n${msg.text}`;
    }).join('\n\n---\n\n');

    const fullContent = title + content;
    const blob = new Blob([fullContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = session.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `cortexify-chat-${safeTitle || 'export'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  if (!session) {
    return <ChatWelcome onNewChat={onNewChat} />;
  }

  // Helper to format the displayed model name to avoid showing "gemini"
  const getDisplayModelName = (rawName: string) => {
      if (rawName.includes('gemini-3-pro')) return 'Cortex-3 Pro';
      if (rawName.includes('gemini-2.5-flash')) return 'Cortex-2.5 Flash';
      // Fallback for unexpected models, though in this app it's controlled
      return rawName.replace('gemini', 'Cortex'); 
  };

  const displayedModelName = getDisplayModelName(isThinkingMode ? PRO_MODEL_NAME : modelName);

  return (
    <div className="flex flex-col h-full relative">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
             <button
                onClick={onOpenSidebar}
                className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Open sidebar"
             >
                <MenuIcon className="w-6 h-6" />
             </button>
            <h2 className="text-lg font-semibold truncate max-w-[120px] sm:max-w-md">{session.title}</h2>
        </div>
        <div className="flex items-center space-x-2">
            <span className={`text-xs font-mono px-2 py-1 rounded-md transition-colors hidden sm:inline-block ${
                isThinkingMode 
                ? 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50' 
                : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50'
            }`}>
                {displayedModelName}
            </span>
             <button
                onClick={handleExportChat}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Export chat session"
                title="Export chat"
            >
                <DownloadIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button 
                onClick={onOpenSettings}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Open chat settings"
            >
                <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
        </div>
      </header>
      
      <div className="flex-1 relative overflow-hidden">
        {/* Ambient Background for Glassmorphism Context */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-[80px]" style={{ animationDuration: '4s' }}></div>
        </div>

        {/* 
            Scroll Container Improvements for Mobile:
            - removed 'scroll-smooth' to prevent conflict with rapid auto-scroll
            - added 'overscroll-behavior-y: contain' to prevent body scroll
            - added 'touch-action: pan-y' explicitly
            - added 'onScroll' handler for smart auto-scroll
            - added padding-bottom to ensure last message is visible above input
        */}
        <div 
            ref={scrollRef} 
            onScroll={handleScroll}
            className="absolute inset-0 overflow-y-auto p-4 sm:p-6 space-y-6 z-10 overscroll-contain touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
        >
            <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
                <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                >
                <ChatMessage 
                    message={msg}
                    onEdit={handleEditMessage}
                    isEditing={editingMessageId === msg.id}
                    isStreaming={isLoading && index === messages.length - 1 && msg.sender === 'ai'}
                />
                </motion.div>
            ))}
            </AnimatePresence>
            {isLoading && messages[messages.length-1]?.sender === 'user' && <TypingIndicator />}
            {/* Spacer to ensure scrolling to bottom clears the input area visual */}
            <div className="h-4" /> 
        </div>
      </div>
      
      <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 transition-all duration-200 ease-in-out bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-20">
        <ChatInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading || !!editingMessageId}
            isThinkingMode={isThinkingMode}
            onToggleThinkingMode={() => setIsThinkingMode(prev => !prev)}
        />
      </div>
    </div>
  );
};

export default ChatArea;
