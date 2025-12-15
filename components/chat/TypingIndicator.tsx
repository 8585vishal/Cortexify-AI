
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { LogoIcon } from '../common/Logo';

const TypingIndicator: React.FC = () => {
    // Fix: Explicitly type `dotVariants` with `Variants` from framer-motion
    // to fix type inference issues with string literals like 'reverse' and 'easeInOut'.
    const dotVariants: Variants = {
        initial: { y: 0 },
        animate: { 
            y: -5,
            transition: {
                duration: 0.4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: "easeInOut",
            }
        },
    };

    return (
        <div className="flex items-start gap-4">
             <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center flex-shrink-0 shadow-lg border border-purple-500/20">
                <LogoIcon className="w-6 h-6" />
            </div>
            <div className="px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-bl-none flex items-center space-x-1.5">
                <motion.div variants={dotVariants} initial="initial" animate="animate" className="w-2 h-2 bg-gray-500 rounded-full" />
                <motion.div variants={dotVariants} initial="initial" animate="animate" style={{animationDelay: '0.2s'}} className="w-2 h-2 bg-gray-500 rounded-full" />
                <motion.div variants={dotVariants} initial="initial" animate="animate" style={{animationDelay: '0.4s'}} className="w-2 h-2 bg-gray-500 rounded-full" />
            </div>
        </div>
    );
};

export default TypingIndicator;
