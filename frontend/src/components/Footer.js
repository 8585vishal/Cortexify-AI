import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Mail, MessageSquare, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700" data-testid="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                CORTEXIFY
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              The future of AI conversation. Experience intelligent, contextual, and engaging conversations powered by advanced AI technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors" data-testid="social-github">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors" data-testid="social-twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors" data-testid="social-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">About</Link></li>
              <li><Link to="/features" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/chat" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">AI Chat</Link></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">API</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Status</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Contact Us</Link></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 CORTEXIFY. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Privacy</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Terms</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors text-sm">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;