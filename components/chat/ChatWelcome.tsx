
import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../common/Logo';
import { PlusIcon, CodeBracketIcon, BoltIcon, BrainIcon } from '../common/Icons';

interface ChatWelcomeProps {
  onNewChat: () => void;
}

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:border-purple-500/30 transition-colors duration-300 text-left backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl text-purple-600 dark:text-purple-400">
                {icon}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ onNewChat }) => {
  const features = [
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: 'Advanced Intelligence',
      description: 'Powered by Cortex-2.5 for deep reasoning and creative capabilities.'
    },
    {
      icon: <BrainIcon className="w-6 h-6" />,
      title: 'Complex Problem Solving',
      description: 'Switch to Thinking Mode (Cortex Pro) to tackle challenging logic and math problems.'
    },
    {
      icon: <CodeBracketIcon className="w-6 h-6" />,
      title: 'Code Analysis',
      description: 'Generate, debug, and explain code across multiple languages instantly.'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-8 relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 flex flex-col items-center">
          {/* Logo with explicit key to force re-render if needed */}
          <div className="mb-6 scale-110">
             <Logo showText={true} />
          </div>
          
          <div className="relative mb-3 group">
             {/* Main Text Container - Removed 'overflow-hidden' and cover divs to ensure visibility */}
             <div className="relative px-4 py-2">
                 <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl sm:text-5xl font-extrabold tracking-tight"
                 >
                    {/* Blue Gradient Text with Pulse */}
                    <span className="animate-pulse text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 dark:from-blue-400 dark:via-blue-200 dark:to-blue-400">
                        Welcome to CORTEXIFY
                    </span>
                 </motion.h1>

                 {/* Highlight Shimmer Overlay - Now uses absolute positioning without hiding text */}
                 <motion.div
                    className="absolute inset-0 z-20 pointer-events-none"
                    initial={{ backgroundPosition: "200% 0" }}
                    animate={{ backgroundPosition: "-200% 0" }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: 3, 
                        ease: "linear",
                        repeatDelay: 1
                    }}
                    style={{
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.0) 60%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        mixBlendMode: "overlay"
                    }}
                 />
             </div>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed"
          >
            Your intelligent AI assistant. Start a new conversation to explore its capabilities.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            onClick={onNewChat}
            className="mt-8 inline-flex items-center px-8 py-3.5 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Start New Conversation
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 w-full max-w-5xl"
          >
            <div className="grid md:grid-cols-3 gap-5">
                {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                ))}
            </div>
          </motion.div>
      </div>
    </div>
  );
};

export default ChatWelcome;
