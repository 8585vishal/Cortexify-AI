
import React, { useId } from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  iconSize?: string;
  textSize?: string;
}

// A high-tech, geometric brain/core logo representing Cortex V5
export const LogoIcon: React.FC<{className?: string}> = ({ className = "w-8 h-8" }) => {
  // Generate unique IDs to prevent collisions when multiple logos are rendered
  const id = useId().replace(/:/g, "");
  const gradId = `logo_grad_${id}`;
  const glowId = `glow_${id}`;

  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="1" stopColor="#ec4899" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
           <feGaussianBlur stdDeviation="3" result="coloredBlur" />
           <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
           </feMerge>
        </filter>
      </defs>
      
      <g filter={`url(#${glowId})`}>
         {/* Hexagon Outline */}
         <path d="M50 5 L93.3 25 V75 L50 95 L6.7 75 V25 Z" stroke={`url(#${gradId})`} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
         
         {/* Internal Nodes / Circuitry */}
         <circle cx="50" cy="50" r="12" fill={`url(#${gradId})`} />
         <path d="M50 20 L50 38" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
         <path d="M50 80 L50 62" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
         
         <path d="M24 35 L39.6 44" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
         <path d="M76 35 L60.4 44" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
         
         <path d="M24 65 L39.6 56" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
         <path d="M76 65 L60.4 56" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
         
         {/* Inner Light */}
         <circle cx="50" cy="50" r="6" fill="#fff" fillOpacity="0.4" />
      </g>
    </svg>
  );
};

const Logo: React.FC<LogoProps> = ({ className = "", showText = true, iconSize = "w-9 h-9", textSize = "text-2xl" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoIcon className={`${iconSize} drop-shadow-md`} />
      {showText && (
        <div className="flex flex-col leading-none">
             <h1 className={`${textSize} font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600`}>
            CORTEXIFY
            </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
