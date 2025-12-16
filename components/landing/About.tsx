
import React from 'react';

const About: React.FC = () => {
  const teamMembers = [
    { name: "Vishal Raj Purohit" },
    { name: "Rajesh Dev" },
    { name: "Thejaswi" },
    { name: "Manasa" }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 relative overflow-hidden transition-colors duration-300">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/50 rounded-full mb-3 border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                The Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">Meet the Minds Behind CORTEXIFY</h2>
        </div>

        <div className="max-w-6xl mx-auto">
            <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700/50 hover:border-teal-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(20,184,166,0.1)] relative overflow-hidden">
                
                {/* Decorative gradient blob inside card */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="text-center mb-10">
                         <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                            A dedicated team of developers and innovators bridging the gap between human potential and artificial intelligence.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="group w-full max-w-xs bg-white/50 dark:bg-gray-900/60 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-teal-500/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-center flex flex-col items-center">
                                <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 border-2 border-gray-300 dark:border-gray-600 group-hover:border-teal-400 flex items-center justify-center shadow-lg transition-colors duration-300">
                                     <span className="text-2xl font-bold text-gray-600 dark:text-gray-300 group-hover:text-teal-600 dark:group-hover:text-white">
                                        {member.name.charAt(0)}
                                     </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-teal-500 dark:group-hover:text-teal-300 transition-colors whitespace-normal break-words">{member.name}</h3>
                                <div className="h-0.5 w-12 bg-teal-500/30 rounded-full group-hover:bg-teal-500 transition-colors duration-300 mt-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;
