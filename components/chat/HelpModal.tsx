
import React from 'react';
import Modal from '../common/Modal';
import { MessageSquareIcon, BrainIcon, SettingsIcon, CodeBracketIcon } from '../common/Icons';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help & Support">
      <div className="space-y-6 text-gray-600 dark:text-gray-300 max-h-[70vh] overflow-y-auto pr-2">
         <p className="text-sm">
            Welcome to CORTEXIFY. Here is a quick guide to getting started with your advanced AI assistant.
         </p>
         
         <div className="space-y-4">
            <div className="flex items-start space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex-shrink-0">
                    <MessageSquareIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Conversations</h3>
                    <p className="text-xs mt-1 leading-relaxed">
                        Start a new chat from the sidebar. Your history is saved locally. You can rename or delete chats at any time.
                    </p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-lg flex-shrink-0">
                    <BrainIcon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Thinking Mode</h3>
                    <p className="text-xs mt-1 leading-relaxed">
                        Toggle the brain icon in the chat input to enable "Thinking Mode". This uses a more advanced model (Gemini Pro) for complex reasoning and explanation tasks.
                    </p>
                </div>
            </div>

            <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex-shrink-0">
                    <CodeBracketIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Code & Files</h3>
                    <p className="text-xs mt-1 leading-relaxed">
                        Upload text files or images for analysis. Code blocks are automatically formatted with syntax highlighting and a copy button.
                    </p>
                </div>
            </div>
             
             <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg flex-shrink-0">
                    <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Settings</h3>
                    <p className="text-xs mt-1 leading-relaxed">
                        Customize your experience by adjusting the "Temperature" (creativity) and "Max Tokens" (response length) in the settings menu.
                    </p>
                </div>
            </div>
         </div>

         <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Need more help?</h4>
            <p className="text-xs">
               For technical support or feedback, please contact us at <a href="mailto:support@cortexify.ai" className="text-purple-600 dark:text-purple-400 hover:underline">support@cortexify.ai</a>.
            </p>
         </div>
      </div>
      
      <div className="mt-6 flex justify-end">
         <button 
            onClick={onClose} 
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors shadow-md"
        >
            Close Guide
         </button>
      </div>
    </Modal>
  );
};

export default HelpModal;
