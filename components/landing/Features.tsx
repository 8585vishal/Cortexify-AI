
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CodeBracketIcon, BoltIcon, ShieldCheckIcon, GlobeAltIcon } from '../common/Icons';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay }}
        className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/40 hover:bg-gray-800/80 transition-all duration-300 group hover:shadow-xl hover:-translate-y-1"
    >
        <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-teal-900/30 text-teal-400 mb-6 group-hover:bg-teal-500/20 group-hover:scale-110 transition-all duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-300 transition-colors">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);


const Features: React.FC = () => {
  const featuresData = [
    {
      icon: <CodeBracketIcon className="w-7 h-7" />,
      title: 'Advanced AI Intelligence',
      description: 'Powered by the latest Cortex-2.5 models. Capable of reasoning, coding, and creative writing with unprecedented accuracy.'
    },
    {
      icon: <BoltIcon className="w-7 h-7" />,
      title: 'Lightning Fast Latency',
      description: 'Experience near-instantaneous responses with our optimized edge network and real-time typing indicators.'
    },
    {
      icon: <ShieldCheckIcon className="w-7 h-7" />,
      title: 'Enterprise-Grade Security',
      description: 'Your data is protected with end-to-end encryption. We prioritize privacy with strict data retention policies.'
    },
    {
      icon: <GlobeAltIcon className="w-7 h-7" />,
      title: 'Multilingual Mastery',
      description: 'Break language barriers. Communicate fluently in over 50 languages with cultural nuance understanding.'
    }
  ];

  return (
    <section id="features" className="py-24 md:py-32 bg-gray-900 relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
        >
            <span className="inline-block px-3 py-1 text-xs font-bold text-teal-300 bg-teal-900/30 rounded-full mb-6 border border-teal-500/20 tracking-wider uppercase">
                Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white">
                Powerful AI Features
            </h2>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                Discover what makes CORTEXIFY the most advanced and user-friendly AI conversation platform available today.
            </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard key={index} {...feature} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
