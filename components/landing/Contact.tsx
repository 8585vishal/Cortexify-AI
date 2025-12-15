
import React from 'react';
import { motion } from 'framer-motion';
import { SendIcon } from '../common/Icons';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-gray-900 border-t border-gray-800 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                 <span className="inline-block px-3 py-1 text-xs font-bold text-teal-300 bg-teal-900/30 rounded-full mb-6 border border-teal-500/20 tracking-wider uppercase">
                        Contact Us
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Get in touch</h2>
                <p className="text-gray-400 text-lg">Have questions about Enterprise plans or custom integrations? We'd love to hear from you.</p>
            </motion.div>
            
            <motion.form 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6 bg-gray-800/40 p-8 md:p-12 rounded-3xl border border-gray-700/50 shadow-2xl backdrop-blur-sm" 
                onSubmit={(e) => e.preventDefault()}
            >
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">First Name</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white outline-none transition-all placeholder-gray-600" placeholder="John" />
                    </div>
                     <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Last Name</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white outline-none transition-all placeholder-gray-600" placeholder="Doe" />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                     <input type="email" className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white outline-none transition-all placeholder-gray-600" placeholder="john@company.com" />
                </div>
                 <div>
                     <label className="block text-sm font-semibold text-gray-300 mb-2">Message</label>
                     <textarea rows={4} className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white outline-none transition-all resize-none placeholder-gray-600" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-teal-500/30 flex items-center justify-center space-x-2 transform hover:scale-[1.01] active:scale-[0.99]">
                    <span>Send Message</span>
                    <SendIcon className="w-5 h-5 ml-2" />
                </button>
            </motion.form>
        </div>
    </section>
  );
};

export default Contact;
