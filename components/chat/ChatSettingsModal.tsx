import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { ChatSettings } from '../../types';

interface ChatSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: ChatSettings;
  onSave: (newSettings: ChatSettings) => void;
}

const ChatSettingsModal: React.FC<ChatSettingsModalProps> = ({ isOpen, onClose, currentSettings, onSave }) => {
    const [settings, setSettings] = useState(currentSettings);

    useEffect(() => {
        setSettings(currentSettings);
    }, [currentSettings, isOpen]);

    const handleSave = () => {
        onSave(settings);
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value, 10) || 0 }));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chat Settings">
            <div className="space-y-6 text-sm text-gray-600 dark:text-gray-400">
                {/* Temperature Setting */}
                <div>
                    <label htmlFor="temperature" className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                        Temperature: <span className="font-bold text-purple-500">{settings.temperature.toFixed(1)}</span>
                    </label>
                    <p className="mb-2">Controls randomness. Lower values are more deterministic, higher values are more creative.</p>
                    <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.temperature}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                </div>
                {/* Max Tokens Setting */}
                <div>
                    <label htmlFor="maxTokens" className="block font-medium mb-1 text-gray-800 dark:text-gray-200">
                        Max Tokens
                    </label>
                    <p className="mb-2">The maximum number of tokens to generate in the response. (e.g., 2048)</p>
                    <input
                        id="maxTokens"
                        type="number"
                        value={settings.maxTokens}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>
            <div className="mt-8 flex justify-end space-x-3">
                <button onClick={onClose} className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    Cancel
                </button>
                <button onClick={handleSave} className="px-4 py-2 font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
                    Save Changes
                </button>
            </div>
        </Modal>
    );
};

export default ChatSettingsModal;
