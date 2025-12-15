
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FuturisticGraphic from './FuturisticGraphic';
import LearnMoreModal from './LearnMoreModal';

const Hero: React.FC = () => {
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-grid-gray-700/20 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-900/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                <div className="text-center lg:text-left order-2 lg:order-1">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-300 bg-teal-900/50 rounded-full mb-6 border border-teal-500/20 backdrop-blur-sm">
                        Powered by Cortex-2.5 Neural Engine
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        The Future of
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-purple-400 to-pink-500 animate-gradient-x">AI Conversation</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                        Experience intelligent, contextual, and engaging conversations with CORTEXIFY. Our advanced AI assistant understands you, learns with you, and helps you achieve more.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link 
                            to="/chat"
                            className="px-8 py-4 font-bold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg hover:from-teal-400 hover:to-teal-500 transition-all transform hover:scale-[1.02] shadow-lg shadow-teal-500/25 ring-1 ring-white/10"
                        >
                            Start Chatting Now
                        </Link>
                        <button 
                            onClick={() => setIsLearnMoreOpen(true)}
                            className="px-8 py-4 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600"
                        >
                            Learn More &rarr;
                        </button>
                    </div>
                </div>
                
                <div className="order-1 lg:order-2 w-full max-w-lg mx-auto lg:max-w-none">
                   <FuturisticGraphic />
                </div>
            </div>
        </div>

        <LearnMoreModal isOpen={isLearnMoreOpen} onClose={() => setIsLearnMoreOpen(false)} />
    </section>
  );
};

export default Hero;
