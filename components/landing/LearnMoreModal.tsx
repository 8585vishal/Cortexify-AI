
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { BoltIcon, GlobeAltIcon, CodeBracketIcon, BrainIcon } from '../common/Icons';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  const [metrics, setMetrics] = useState({
    activeNeurons: 0,
    queriesPerSec: 0,
    learningRate: 0,
    latency: 0
  });

  // Random facts array
  const facts = [
    "Cortexify processes over 1 million context tokens per minute during peak hours.",
    "The Cortex-2.5 architecture uses a novel sparse-activation mechanism to reduce energy consumption by 40%.",
    "Our models are fine-tuned on a curated dataset of scientific papers and creative literature.",
    "Cortexify's edge network spans 150+ cities to ensure <50ms latency globally.",
    "The 'Thinking Mode' simulates human-like chain-of-thought reasoning before outputting a response."
  ];

  const [randomFact, setRandomFact] = useState(facts[0]);

  useEffect(() => {
    if (isOpen) {
        // Randomize metrics on open
        setMetrics({
            activeNeurons: Math.floor(Math.random() * 50000000) + 10000000,
            queriesPerSec: Math.floor(Math.random() * 5000) + 1000,
            learningRate: Number((Math.random() * 0.01).toFixed(5)),
            latency: Math.floor(Math.random() * 30) + 10
        });
        setRandomFact(facts[Math.floor(Math.random() * facts.length)]);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="System Insights & Random Data">
        <div className="space-y-6">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
                Here's a glimpse into the real-time (simulated) performance metrics of the Cortex-2.5 Neural Engine.
            </p>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center space-x-2 mb-2">
                        <BrainIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Active Neurons</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {metrics.activeNeurons.toLocaleString()}
                    </p>
                </div>

                 <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
                    <div className="flex items-center space-x-2 mb-2">
                        <GlobeAltIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Queries / Sec</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {metrics.queriesPerSec.toLocaleString()}
                    </p>
                </div>
                
                 <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center space-x-2 mb-2">
                        <CodeBracketIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Learning Rate</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {metrics.learningRate}
                    </p>
                </div>

                 <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                    <div className="flex items-center space-x-2 mb-2">
                        <BoltIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Avg Latency</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {metrics.latency}ms
                    </p>
                </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Did you know?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "{randomFact}"
                </p>
            </div>
            
            <div className="flex justify-end">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Close
                </button>
            </div>
        </div>
    </Modal>
  );
};

export default LearnMoreModal;
