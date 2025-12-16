
import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '../common/Icons';

const PricingCard = ({ title, price, features, recommended, delay }: { title: string, price: string, features: string[], recommended?: boolean, delay: number }) => (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay }}
        className={`p-8 rounded-3xl border flex flex-col h-full transition-all duration-300 hover:shadow-2xl relative
            ${recommended 
                ? 'border-teal-500 bg-gray-800 text-white shadow-teal-500/10 scale-105 z-10' 
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
    >
        {recommended && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-500 to-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
                Most Popular
            </div>
        )}
        
        <div className="mb-8">
            <h3 className={`text-lg font-semibold mb-2 ${recommended ? 'text-teal-400' : 'text-gray-900 dark:text-gray-300'}`}>{title}</h3>
            <div className="flex items-baseline">
                <span className={`text-4xl font-extrabold tracking-tight ${recommended ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{price}</span>
                {price !== 'Free' && <span className={`ml-2 font-medium ${recommended ? 'text-gray-400' : 'text-gray-500'}`}>/month</span>}
            </div>
        </div>

        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature, i) => (
                <li key={i} className="flex items-start">
                    <CheckIcon className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${recommended ? 'text-teal-400' : 'text-gray-500 dark:text-gray-500'}`} />
                    <span className={`text-sm font-medium ${recommended ? 'text-gray-300' : 'text-gray-600 dark:text-gray-300'}`}>{feature}</span>
                </li>
            ))}
        </ul>

        <button className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
            ${recommended 
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-lg shadow-teal-500/25' 
                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
            }`}>
            Choose {title}
        </button>
    </motion.div>
);

const Pricing: React.FC = () => {
    return (
        <section id="pricing" className="py-24 md:py-32 bg-white dark:bg-gray-900 relative transition-colors duration-300">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                     <span className="inline-block px-3 py-1 text-xs font-bold text-teal-600 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-6 border border-teal-500/20 tracking-wider uppercase">
                        Pricing Plans
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">Simple, transparent pricing</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">Unlock the full potential of AI with a plan that fits your needs.</p>
                </motion.div>
                
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    <PricingCard 
                        title="Starter" 
                        price="Free" 
                        delay={0}
                        features={['Access to Cortex Flash', 'Standard response speed', '10 conversations/day', 'Basic Support']} 
                    />
                    <PricingCard 
                        title="Pro" 
                        price="$19" 
                        recommended
                        delay={0.1}
                        features={['Access to Cortex Pro 2.5', 'Thinking Mode included', 'Unlimited conversations', 'Priority support', 'Early access to new features', 'No rate limits']} 
                    />
                     <PricingCard 
                        title="Enterprise" 
                        price="$49" 
                        delay={0.2}
                        features={['Custom Model Fine-tuning', 'Dedicated API Access', 'Dedicated account manager', 'SSO & Advanced Security', '99.99% SLA Guarantee', 'Custom contracts']} 
                    />
                </div>
             </div>
        </section>
    );
};

export default Pricing;
