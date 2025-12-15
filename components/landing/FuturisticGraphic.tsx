
import React from 'react';
import { motion } from 'framer-motion';

const FuturisticGraphic: React.FC = () => {
    return (
        <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[500px] flex items-center justify-center bg-gray-900/40 rounded-2xl overflow-hidden border border-gray-800/50 backdrop-blur-sm group shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/[0.03] bg-[length:30px_30px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
            
            {/* Abstract AI Brain Visualization */}
            <svg className="w-full h-full max-w-[500px] max-h-[500px] z-10" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                    </linearGradient>
                    <radialGradient id="glowRadial" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Background Glow */}
                <motion.circle 
                    cx="200" cy="200" r="120" 
                    fill="url(#glowRadial)" 
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Rotating Rings Outer */}
                <motion.g 
                    style={{ originX: "200px", originY: "200px" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    <circle cx="200" cy="200" r="160" stroke="url(#gradient1)" strokeWidth="1" fill="none" strokeDasharray="2 10" opacity="0.4" />
                </motion.g>

                <motion.g 
                    style={{ originX: "200px", originY: "200px" }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                     <circle cx="200" cy="200" r="140" stroke="#2dd4bf" strokeWidth="1" fill="none" strokeDasharray="10 20" opacity="0.3" />
                     <path d="M200,60 A140,140 0 0,1 200,340" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.4" />
                </motion.g>

                {/* Central AI Node Structure */}
                <g transform="translate(200 200)">
                    {/* Connecting lines */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                        <motion.line
                            key={`line-${i}`}
                            x1="0" y1="0"
                            x2={Math.cos(angle * Math.PI / 180) * 80}
                            y2={Math.sin(angle * Math.PI / 180) * 80}
                            stroke="url(#gradient1)"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.8, 0.8, 0] }}
                            transition={{ duration: 4, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                        />
                    ))}

                    {/* Nodes */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                         <motion.circle
                            key={`node-${i}`}
                            cx={Math.cos(angle * Math.PI / 180) * 80}
                            cy={Math.sin(angle * Math.PI / 180) * 80}
                            r="3"
                            fill="#fff"
                            filter="url(#glow)"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                        />
                    ))}
                    
                    {/* Inner Rotating Core */}
                     <motion.g
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{ rotate: { duration: 15, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
                     >
                        <rect x="-20" y="-20" width="40" height="40" rx="10" stroke="#fff" strokeWidth="2" fill="none" />
                        <rect x="-15" y="-15" width="30" height="30" rx="8" fill="url(#gradient1)" opacity="0.5" />
                     </motion.g>
                </g>

                {/* Floating Data Particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.circle
                        key={`particle-${i}`}
                        r={Math.random() * 1.5 + 1}
                        fill={i % 2 === 0 ? "#2dd4bf" : "#a855f7"}
                        filter="url(#glow)"
                        initial={{ 
                            cx: 200,
                            cy: 200,
                            opacity: 0 
                        }}
                        animate={{ 
                            cx: 200 + (Math.random() - 0.5) * 350,
                            cy: 200 + (Math.random() - 0.5) * 350,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                        }}
                        transition={{ 
                            duration: 3 + Math.random() * 3, 
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeOut" 
                        }}
                    />
                ))}
            </svg>
            
            {/* UI Overlay Elements */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div className="space-y-1">
                    <div className="flex items-center space-x-2 bg-gray-900/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-700/50 w-fit">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <span className="text-[10px] sm:text-xs font-mono text-teal-300 font-bold tracking-wider">CORTEX CORE: ONLINE</span>
                    </div>
                    <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-teal-500 to-purple-500"
                            animate={{ width: ["10%", "90%", "30%", "100%", "60%"] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                </div>
                 <div className="text-right hidden sm:block">
                    <div className="bg-gray-900/60 px-2 py-1 rounded backdrop-blur-sm border border-gray-700/50">
                        <p className="text-[10px] font-mono text-purple-300">DATA STREAM: ENCRYPTED</p>
                        <p className="text-[9px] font-mono text-gray-500">LATENCY: 12ms</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FuturisticGraphic;
