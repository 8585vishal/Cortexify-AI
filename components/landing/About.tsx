
import React from 'react';
import { GithubIcon, LinkedinIcon, GlobeAltIcon } from '../common/Icons';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-900 border-t border-gray-800 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-300 bg-teal-900/50 rounded-full mb-3 border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                The Visionary
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white tracking-tight">Meet the Mind Behind CORTEXIFY</h2>
        </div>

        <div className="max-w-3xl mx-auto">
            <div className="group bg-gray-800/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-gray-700/50 hover:border-teal-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(20,184,166,0.1)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                
                {/* Decorative gradient blob inside card */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors duration-500"></div>

                {/* Image Section */}
                <div className="relative flex-shrink-0">
                    <div className="absolute -inset-2 bg-gradient-to-br from-teal-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-spin-slow" style={{ animationDuration: '10s' }}></div>
                    <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-900 shadow-2xl z-10 bg-gray-800 flex items-center justify-center">
                        <img 
                            src="https://drive.google.com/file/d/1xX_sP-5XQthPlA22fOB7BmDTiNmWRss5/view?usp=sharing" 
                            alt="Vishal Raj Purohit" 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                    {/* Floating Status Badge */}
                    <div className="absolute bottom-2 right-2 bg-gray-900/90 backdrop-blur-md border border-gray-700 py-1.5 px-2.5 rounded-lg shadow-xl z-20 transform group-hover:translate-y-[-3px] transition-transform duration-300">
                        <div className="flex items-center space-x-2">
                             <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                             </span>
                             <span className="text-[10px] font-mono font-bold text-teal-300 tracking-wide">CEO</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="text-center md:text-left relative z-10 flex-1">
                    <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-1">
                        Vishal Raj Purohit
                    </h3>
                    <p className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400 font-bold text-base mb-4 tracking-wide uppercase">
                        CEO & Founder
                    </p>
                    
                    <div className="space-y-3 mb-6">
                        <p className="text-gray-300 text-base leading-relaxed">
                            A visionary Full Stack Developer and AI Researcher bridging the gap between human potential and artificial intelligence.
                        </p>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Creator of <span className="text-teal-300 font-semibold">CORTEXIFY</span>, redefining interaction through generative models.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                        <div className="flex space-x-3">
                            <a href="https://github.com/8585vishal" target="_blank" rel="noreferrer" className="p-2.5 bg-gray-800 border border-gray-700 rounded-full hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-all duration-300 group/icon">
                                <GithubIcon className="w-4 h-4 text-gray-400 group-hover/icon:text-white" />
                            </a>
                            <a href="https://www.linkedin.com/in/vishal-raj-purohit-b3a0492a4" target="_blank" rel="noreferrer" className="p-2.5 bg-gray-800 border border-gray-700 rounded-full hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 group/icon">
                                <LinkedinIcon className="w-4 h-4 text-gray-400 group-hover/icon:text-white" />
                            </a>
                            <a href="https://vishalrajpurohit.vercel.app/" target="_blank" rel="noreferrer" className="p-2.5 bg-gray-800 border border-gray-700 rounded-full hover:bg-teal-600 hover:text-white hover:border-teal-500 transition-all duration-300 group/icon">
                                <GlobeAltIcon className="w-4 h-4 text-gray-400 group-hover/icon:text-white" />
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
