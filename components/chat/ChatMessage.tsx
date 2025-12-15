
import React from 'react';
import { motion } from 'framer-motion';
import { Message } from '../../types';
import MarkdownRenderer from '../common/MarkdownRenderer';
import { UserIcon, ShrinkIcon, ExpandIcon, SparklesIcon } from '../common/Icons';
import { LogoIcon } from '../common/Logo';

type EditAction = 'shorter' | 'longer' | 'explain';
interface ChatMessageProps {
  message: Message;
  onEdit: (messageId: string, action: EditAction) => void;
  isEditing: boolean;
  isStreaming?: boolean;
}

const CortexifyAvatar = () => (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center flex-shrink-0 shadow-lg border border-purple-500/20">
      <LogoIcon className="w-6 h-6" />
    </div>
);

const EditActionButtons: React.FC<{ onAction: (action: EditAction) => void }> = ({ onAction }) => {
    const buttonStyle = "flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 shadow-lg backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 transform hover:-translate-y-0.5";
    const iconStyle = "w-3.5 h-3.5 text-purple-500 dark:text-purple-400";
    const textStyle = "text-xs font-medium text-gray-700 dark:text-gray-200";

    return (
        <div className="absolute -bottom-10 right-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pt-2">
            <button onClick={() => onAction('shorter')} className={buttonStyle} title="Make shorter">
                <ShrinkIcon className={iconStyle} />
                <span className={textStyle}>Shorter</span>
            </button>
            <button onClick={() => onAction('longer')} className={buttonStyle} title="Make longer">
                <ExpandIcon className={iconStyle} />
                <span className={textStyle}>Longer</span>
            </button>
             <button onClick={() => onAction('explain')} className={buttonStyle} title="Explain this">
                <SparklesIcon className={iconStyle} />
                <span className={textStyle}>Explain</span>
            </button>
        </div>
    );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onEdit, isEditing, isStreaming }) => {
  const isUser = message.sender === 'user';

  // Premium Glassmorphism Theme for AI Response
  const aiBubbleStyle = `
    backdrop-blur-xl
    bg-white/60 dark:bg-gray-800/40
    border border-white/40 dark:border-white/10
    shadow-[0_8px_32px_0_rgba(31,38,135,0.05)]
    dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
    text-gray-800 dark:text-gray-100
    rounded-bl-none
    bg-gradient-to-br from-white/80 via-white/50 to-white/30
    dark:from-gray-800/60 dark:via-gray-900/40 dark:to-gray-950/30
  `;

  // Standard clean style for User
  const userBubbleStyle = `
    bg-gradient-to-r from-purple-600 to-indigo-600 
    text-white 
    rounded-br-none
    shadow-lg
  `;

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''} mb-6 relative`}>
      {!isUser && <CortexifyAvatar />}
      <div className="relative group max-w-3xl w-full">
        <div
          className={`px-6 py-5 rounded-2xl ${isUser ? userBubbleStyle : aiBubbleStyle}`}
        >
          {/* Subtle reflection highlight for glass effect */}
          {!isUser && (
              <div className="absolute inset-0 rounded-2xl rounded-bl-none border border-white/20 pointer-events-none bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
          )}

          <div className="text-base leading-7 relative z-10 font-sans tracking-wide">
              {isEditing ? (
                 <div className="flex items-center justify-center space-x-2 py-1">
                    <motion.div
                        className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                    />
                    <motion.div
                        className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    />
                    <motion.div
                        className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />
                </div>
              ) : (
                 <>
                   <MarkdownRenderer content={message.text} />
                   {isStreaming && (
                      <span className="inline-block w-2 h-5 ml-1 align-middle bg-purple-500 animate-pulse rounded-sm"></span>
                   )}
                 </>
              )}
          </div>
        </div>
         {!isUser && !isEditing && !isStreaming && <EditActionButtons onAction={(action) => onEdit(message.id, action)} />}
      </div>
      {isUser && 
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
        </div>
      }
    </div>
  );
};

export default ChatMessage;
