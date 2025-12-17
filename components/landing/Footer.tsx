
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';
import { GithubIcon, LinkedinIcon, GlobeAltIcon, CheckIcon, ShieldCheckIcon, CodeBracketIcon, BoltIcon, PaletteIcon, BrainIcon } from '../common/Icons';
import Modal from '../common/Modal';

type ModalType = 'api' | 'docs' | 'status' | 'privacy' | 'terms' | 'help' | null;

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleScrollTo = (id: string) => {
    if (window.location.pathname !== '/') {
        navigate('/', { state: { scrollTo: id } });
    } else {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
  };

  const openModal = (type: ModalType) => {
      setActiveModal(type);
  };

  const closeModal = () => {
      setActiveModal(null);
  };

  const renderModalContent = () => {
      switch(activeModal) {
          case 'api':
              return (
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Integrate CORTEXIFY's intelligence directly into your applications.</p>
                    <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg font-mono text-xs overflow-x-auto border border-gray-200 dark:border-gray-700">
                        <div className="text-purple-500 mb-2">// Sample Request</div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="text-blue-600 font-bold">POST</span> 
                             <span className="text-gray-600 dark:text-gray-400">https://api.cortexify.ai/v1/generate</span>
                        </div>
                        <pre className="text-gray-800 dark:text-gray-300">
{`{
  "model": "cortex-2.5-flash",
  "messages": [
    { "role": "user", "content": "Hello, Cortexify!" }
  ]
}`}
                        </pre>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm rounded-md border border-yellow-200 dark:border-yellow-800">
                        <strong>Note:</strong> This is a demo environment. API keys are currently waitlisted.
                    </div>
                </div>
              );
          case 'docs':
               return (
                <div className="space-y-6 text-gray-600 dark:text-gray-300 max-h-[60vh] overflow-y-auto pr-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">CORTEXIFY Technical Documentation</h3>
                        <p className="text-sm">
                            A comprehensive overview of the technology stack and architecture powering this application.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            <CodeBracketIcon className="w-4 h-4 mr-2 text-teal-500" /> Core Frameworks
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>React 19:</strong> UI Library for building component-based interfaces with the latest hooks.</li>
                            <li><strong>TypeScript:</strong> Strongly typed programming language for robustness.</li>
                            <li><strong>Vite:</strong> High-performance build tool and development server.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            <PaletteIcon className="w-4 h-4 mr-2 text-purple-500" /> Styling & UI
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>Tailwind CSS:</strong> Utility-first CSS framework for rapid styling and dark mode.</li>
                            <li><strong>Framer Motion:</strong> Production-ready animation library for smooth transitions.</li>
                            <li><strong>Glassmorphism:</strong> Custom UI design language using backdrop blurs and gradients.</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            <BrainIcon className="w-4 h-4 mr-2 text-blue-500" /> AI & Services
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>Google GenAI SDK:</strong> Direct integration with Gemini 2.5 Flash & 3 Pro models.</li>
                            <li><strong>Web Speech API:</strong> Native browser API for Speech-to-Text functionality.</li>
                            <li><strong>Local Storage:</strong> Mock backend for persistence of chats and auth state.</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                            <ShieldCheckIcon className="w-4 h-4 mr-2 text-green-500" /> Features
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Auth Simulation (Login/Signup/OTP)</li>
                            <li>Streaming Chat Responses</li>
                            <li>Markdown & Code Highlighting</li>
                            <li>File Analysis & Vision Capabilities</li>
                        </ul>
                    </div>
                </div>
            );
          case 'status':
              return (
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-900/50">
                        <span className="font-bold text-green-700 dark:text-green-400">All Systems Operational</span>
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                    <div className="space-y-3">
                        {['API Gateway', 'Cortex-2.5 Inference Engine', 'Database Clusters', 'Web Interface'].map(service => (
                            <div key={service} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2">
                                <span className="text-gray-700 dark:text-gray-300">{service}</span>
                                <span className="text-green-500 font-medium flex items-center">
                                    <CheckIcon className="w-4 h-4 mr-1" /> Operational
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 text-right">Last updated: Just now</p>
                </div>
            );
          case 'privacy':
              return (
                <div className="space-y-4 text-sm h-64 overflow-y-auto pr-2 text-gray-600 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                    <p><strong>Last Updated: October 2025</strong></p>
                    <p>At CORTEXIFY, we take your privacy seriously. This policy outlines our data protection practices.</p>
                    
                    <h4 className="font-bold text-gray-900 dark:text-white mt-4">1. Data Collection</h4>
                    <p>We collect only the data necessary to provide our services, including chat logs (stored locally by default) and account information.</p>
                    
                    <h4 className="font-bold text-gray-900 dark:text-white mt-4">2. Data Usage</h4>
                    <p>Your data is used solely to improve the AI response quality during the session. We do not sell your data to third parties.</p>
                    
                    <h4 className="font-bold text-gray-900 dark:text-white mt-4">3. Security</h4>
                    <p>We use industry-standard encryption (AES-256) to protect your information in transit and at rest.</p>

                    <h4 className="font-bold text-gray-900 dark:text-white mt-4">4. Cookie Policy</h4>
                    <p>We use essential cookies to maintain your session. You can manage these settings in your browser.</p>
                </div>
              );
          case 'terms':
              return (
                <div className="space-y-4 text-sm h-64 overflow-y-auto pr-2 text-gray-600 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                     <p><strong>Effective Date: October 2025</strong></p>
                     <p>By using CORTEXIFY, you agree to these terms.</p>
                     
                     <h4 className="font-bold text-gray-900 dark:text-white mt-4">1. Usage License</h4>
                     <p>CORTEXIFY grants you a personal, non-exclusive license to use our AI assistant for personal and commercial purposes subject to fair usage limits.</p>
                     
                     <h4 className="font-bold text-gray-900 dark:text-white mt-4">2. Restrictions</h4>
                     <p>You may not reverse engineer, misuse, or attempt to disrupt the service infrastructure. Automated scraping is prohibited.</p>
                     
                     <h4 className="font-bold text-gray-900 dark:text-white mt-4">3. Disclaimer</h4>
                     <p>AI responses may occasionally be inaccurate. Always verify critical information. CORTEXIFY is not liable for actions taken based on AI advice.</p>
                     
                     <h4 className="font-bold text-gray-900 dark:text-white mt-4">4. Termination</h4>
                     <p>We reserve the right to terminate accounts that violate these terms without prior notice.</p>
                </div>
              );
          case 'help':
              return (
                  <div className="space-y-4 text-gray-600 dark:text-gray-300">
                      <p>Need assistance? Our support team is here to help.</p>
                      <div className="grid grid-cols-1 gap-3">
                          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
                              <h5 className="font-semibold text-gray-900 dark:text-white flex items-center"><BoltIcon className="w-4 h-4 mr-2 text-yellow-500"/> Getting Started</h5>
                              <p className="text-xs mt-1">Guide to your first conversation.</p>
                          </div>
                          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
                              <h5 className="font-semibold text-gray-900 dark:text-white flex items-center"><ShieldCheckIcon className="w-4 h-4 mr-2 text-green-500"/> Account & Security</h5>
                              <p className="text-xs mt-1">Manage passwords and 2FA.</p>
                          </div>
                          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
                              <h5 className="font-semibold text-gray-900 dark:text-white flex items-center"><CodeBracketIcon className="w-4 h-4 mr-2 text-blue-500"/> API Integration</h5>
                              <p className="text-xs mt-1">Troubleshooting API keys.</p>
                          </div>
                      </div>
                      <div className="text-center pt-2">
                          <p className="text-sm">Still stuck? <a href="mailto:support@cortexify.ai" className="text-purple-600 hover:underline">Email Support</a></p>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  const getModalTitle = () => {
      switch(activeModal) {
          case 'api': return "API Access";
          case 'docs': return "Documentation";
          case 'status': return "System Status";
          case 'privacy': return "Privacy Policy";
          case 'terms': return "Terms of Service";
          case 'help': return "Help Center";
          default: return "";
      }
  };

  return (
    <>
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 relative z-10 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="md:col-span-1 lg:col-span-2 space-y-6">
            <Logo />
            <p className="text-sm leading-relaxed max-w-sm text-gray-600 dark:text-gray-500">
              The future of AI conversation. Experience intelligent, contextual, and engaging conversations powered by advanced Cortex-2.5 technology.
            </p>
            <div className="flex space-x-5">
              <a href="https://github.com/8585vishal" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 transform hover:scale-110"><GithubIcon className="w-5 h-5" /></a>
              <a href="https://www.linkedin.com/in/vishal-raj-purohit-b3a0492a4" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 transform hover:scale-110"><LinkedinIcon className="w-5 h-5" /></a>
              <a href="https://vishalrajpurohit.vercel.app/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-teal-500 dark:hover:text-teal-400 transition-colors duration-300 transform hover:scale-110"><GlobeAltIcon className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-sm mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => handleScrollTo('home')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Home</button></li>
              <li><button onClick={() => handleScrollTo('features')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Features</button></li>
              <li><button onClick={() => handleScrollTo('testimonials')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Testimonials</button></li>
              <li><button onClick={() => handleScrollTo('pricing')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Pricing</button></li>
            </ul>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-sm mb-6">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/chat" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">AI Chat</Link></li>
              <li><button onClick={() => openModal('api')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">API Access</button></li>
              <li><button onClick={() => openModal('docs')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Documentation</button></li>
              <li><button onClick={() => openModal('status')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left flex items-center">
                  System Status 
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              </button></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-sm mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => handleScrollTo('contact')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Contact Us</button></li>
              <li><button onClick={() => openModal('help')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Help Center</button></li>
              <li><button onClick={() => openModal('privacy')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Privacy Policy</button></li>
              <li><button onClick={() => openModal('terms')} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors text-left">Terms of Service</button></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500 dark:text-gray-500">&copy; 2025 CORTEXIFY. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => openModal('privacy')} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</button>
            <button onClick={() => openModal('terms')} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">Terms</button>
            <button className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-default">Cookies</button>
          </div>
        </div>
      </div>
    </footer>

    {/* Reusing the Modal Component for Footer Links */}
    <Modal 
        isOpen={!!activeModal} 
        onClose={closeModal} 
        title={getModalTitle()}
    >
        {renderModalContent()}
        <div className="mt-6 flex justify-end">
            <button 
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors shadow-md"
            >
                Close
            </button>
        </div>
    </Modal>
    </>
  );
};

export default Footer;
