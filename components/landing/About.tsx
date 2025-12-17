
import React from 'react';
import { GithubIcon, LinkedinIcon, GlobeAltIcon } from '../common/Icons';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden transition-colors duration-300">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-3 border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                The Creator
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">Meet the Mind Behind CORTEXIFY</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                Bridging the gap between human potential and artificial intelligence through innovative design and engineering.
            </p>
        </div>

        <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-200 dark:border-gray-700/50 hover:border-teal-500/30 transition-all duration-500 shadow-xl hover:shadow-2xl relative overflow-hidden group">
                
                {/* Decorative gradient blob inside card */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                    
                    {/* Avatar / Profile Image Placeholder */}
                    <div className="flex-shrink-0">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-4 border-white dark:border-gray-600 shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                             <span className="text-5xl font-bold text-gray-400 dark:text-gray-500 select-none">V</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="text-center md:text-left flex-1">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vishal Raj Purohit</h3>
                        <p className="text-teal-600 dark:text-teal-400 font-medium mb-4 text-lg">Lead Architect & Full-Stack Engineer</p>
                        
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                            Vishal is a visionary developer passionate about building next-generation AI interfaces. With deep expertise in React, TypeScript, and Generative AI, he created CORTEXIFY to demonstrate the future of intelligent, contextual, and seamless human-computer interaction.
                        </p>

                        <div className="flex items-center justify-center md:justify-start space-x-4">
                            <a href="https://github.com/8585vishal" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-black dark:hover:text-white transition-all">
                                <GithubIcon className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/vishal-raj-purohit-b3a0492a4" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all">
                                <LinkedinIcon className="w-5 h-5" />
                            </a>
                            <a href="https://vishalrajpurohit.vercel.app/" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-all">
                                <GlobeAltIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;
