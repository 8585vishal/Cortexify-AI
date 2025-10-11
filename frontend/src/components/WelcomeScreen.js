import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Bot, Sparkles, Code, Lightbulb, Zap } from 'lucide-react';

const WelcomeScreen = () => {
  const features = [
    {
      icon: Lightbulb,
      title: 'Creative Ideas',
      desc: 'Brainstorm and explore new concepts',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: Code,
      title: 'Code Generation',
      desc: 'Get code with syntax highlighting',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Sparkles,
      title: 'Smart Assistant',
      desc: 'AI-powered intelligent responses',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      desc: 'Instant responses and insights',
      gradient: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
      >
        <Bot className="w-12 h-12 text-white" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
      >
        Welcome to CORTEXIFY
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 dark:text-gray-400 mb-10 text-lg"
      >
        Your intelligent AI assistant is ready to help. Start a conversation!
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur border-gray-200 dark:border-gray-700 h-full group">
                <CardContent className="p-0 text-center">
                  <motion.div
                    className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Type a message below to get started
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
