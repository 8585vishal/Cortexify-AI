
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CTA: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden">
       {/* Background gradient */}
       <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 pointer-events-none" />
       
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-10 md:p-16 text-center border border-gray-700 shadow-2xl relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white relative z-10">
            Ready to Experience the Future?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 relative z-10 leading-relaxed">
            Join thousands of developers, creators, and professionals who are already enhancing their workflow with CORTEXIFY.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-5 relative z-10">
            <Link
              to="/chat"
              className="px-8 py-4 font-bold text-white bg-teal-500 rounded-xl hover:bg-teal-400 transition-all transform hover:scale-105 shadow-lg shadow-teal-500/30"
            >
              Start Free Trial
            </Link>
            <Link
              to="/auth"
              className="px-8 py-4 font-bold text-white bg-gray-700 rounded-xl hover:bg-gray-600 transition-colors border border-gray-600"
            >
              View Pricing
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
