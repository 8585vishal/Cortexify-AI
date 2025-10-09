import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Bot, User } from 'lucide-react';
import CodeBlock from './CodeBlock';

const MessageBubble = ({ message, index }) => {
  const isUser = message.sender === 'user';

  const parseMessageContent = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }

      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const formatTextContent = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  const messageParts = parseMessageContent(message.message);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      className={`flex items-start space-x-4 ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}
      data-testid={`message-${message.sender}-${index}`}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
      >
        <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-700 shadow-lg">
          <AvatarFallback
            className={`${
              isUser
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : 'bg-gradient-to-br from-emerald-500 to-teal-600'
            } text-white font-semibold`}
          >
            {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
          </AvatarFallback>
        </Avatar>
      </motion.div>

      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <motion.div
          initial={{ opacity: 0, x: isUser ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.15 }}
          className="flex items-center space-x-2 mb-2"
        >
          <Badge variant="secondary" className="text-xs">
            {isUser ? 'You' : 'CORTEXIFY'}
          </Badge>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </motion.div>

        <Card
          className={`${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          } shadow-lg hover:shadow-xl transition-shadow duration-300`}
        >
          <CardContent className="p-4">
            {messageParts.map((part, idx) => {
              if (part.type === 'code') {
                return (
                  <CodeBlock
                    key={idx}
                    code={part.content}
                    language={part.language}
                    isDark={!isUser}
                  />
                );
              }

              return (
                <div
                  key={idx}
                  className={`prose prose-sm max-w-none ${
                    isUser ? 'prose-invert' : 'prose-gray dark:prose-invert'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: formatTextContent(part.content),
                  }}
                />
              );
            })}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
