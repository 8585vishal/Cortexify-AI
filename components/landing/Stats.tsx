
import React, { useEffect, useState, useRef } from 'react';
import { UserIcon, MessageSquareIcon, BoltIcon, StarIcon } from '../common/Icons';
import { motion, useInView } from 'framer-motion';

const AnimatedCounter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
    const [count, setCount] = useState(0);
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: true, margin: "-50px" });
    
    // Parse the numeric part and the suffix
    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));
    const suffix = value.replace(/[0-9.]/g, '');

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;

        const updateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / (duration * 1000), 1);
            
            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);
            
            setCount(numericPart * ease);

            if (progress < duration * 1000) {
                animationFrame = requestAnimationFrame(updateCount);
            } else {
                setCount(numericPart);
            }
        };

        animationFrame = requestAnimationFrame(updateCount);

        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, numericPart, duration]);

    // Format for display (handling integers vs decimals)
    const displayCount = Number.isInteger(numericPart) 
        ? Math.floor(count) 
        : count.toFixed(1);

    return (
        <span ref={nodeRef} className="tabular-nums">
            {displayCount}{suffix}
        </span>
    );
};

const Stats: React.FC = () => {
    const stats = [
        { name: 'Active Users', value: '10K+', icon: 'user' },
        { name: 'Conversations', value: '1M+', icon: 'chat' },
        { name: 'Uptime', value: '99.9%', icon: 'time' },
        { name: 'User Rating', value: '4.9/5', icon: 'graph' },
    ];
    
    const IconComponent = ({ iconName }: { iconName: string }) => {
        switch(iconName) {
            case 'user': return <UserIcon className="w-8 h-8 text-teal-500 dark:text-teal-400" />;
            case 'chat': return <MessageSquareIcon className="w-8 h-8 text-teal-500 dark:text-teal-400" />;
            case 'time': return <BoltIcon className="w-8 h-8 text-teal-500 dark:text-teal-400" />;
            case 'graph': return <StarIcon className="w-8 h-8 text-teal-500 dark:text-teal-400" />;
            default: return null;
        }
    };

    return (
        <section className="py-20 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 bg-gray-50/50 dark:bg-gray-800/10 pointer-events-none" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={stat.name} 
                            className="text-center group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div className="flex justify-center items-center mb-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-lg group-hover:border-teal-500/50 group-hover:shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                                    <IconComponent iconName={stat.icon} />
                                </div>
                            </div>
                            <p className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">
                                <AnimatedCounter value={stat.value} />
                            </p>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.name}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
