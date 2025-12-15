
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, XIcon, BoltIcon } from '../common/Icons';

interface AssumptionModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssumptionModeModal: React.FC<AssumptionModeModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-gray-900/30 shadow-[0_0_50px_rgba(168,85,247,0.15)] backdrop-blur-2xl"
          >
            {/* Ambient Background Elements */}
            <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-purple-600/20 blur-[80px]"></div>
            <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-teal-500/20 blur-[80px]"></div>
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none"></div>

            <div className="relative z-10 p-8 text-center">
              <button 
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <XIcon className="h-5 w-5" />
              </button>

              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-purple-500/50 blur-xl"></div>
                  <div className="relative rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-4 shadow-lg ring-1 ring-white/20">
                     <SparklesIcon className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>

              <h2 className="mb-3 text-3xl font-extrabold text-white tracking-tight">
                Assumption Extractor Mode
              </h2>

              <p className="mb-6 text-gray-300 text-base leading-relaxed">
                Unlock a new dimension of clarity. CORTEXIFY now automatically identifies and lists the underlying assumptions in every response, providing unparalleled transparency and logical depth.
              </p>

              <div className="mb-8 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 shadow-inner">
                <div className="flex items-start space-x-3">
                   <div className="mt-1 flex-shrink-0">
                      <BoltIcon className="h-5 w-5 text-yellow-400 animate-pulse" />
                   </div>
                   <p className="text-left text-sm font-medium text-yellow-100/90 leading-snug">
                     <span className="font-bold text-yellow-400">Industry First:</span> This is the most advanced feature that ChatGPT, Generative AI, or other AI tools have not provided yet.
                   </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3.5 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-purple-500/25 active:scale-[0.98]"
              >
                <span className="relative z-10">Experience It Now</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssumptionModeModal;
