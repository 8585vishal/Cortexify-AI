
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { UserIcon } from '../common/Icons';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ username: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username });
    }
  }, [user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (formData.username.trim().length < 2) {
        setMessage({ text: 'Username must be at least 2 characters.', type: 'error' });
        return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
        const success = await updateUser({ username: formData.username.trim() });
        if (success) {
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setTimeout(() => {
                onClose();
                setMessage(null);
            }, 1000);
        } else {
            setMessage({ text: 'Failed to update profile.', type: 'error' });
        }
    } catch (error) {
        setMessage({ text: 'An error occurred.', type: 'error' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
       <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-3xl mb-2 shadow-lg">
                {formData.username.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
       </div>

       <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <div className="relative">
                     <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                     </span>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full py-2 pl-10 pr-3 text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter your username"
                    />
                </div>
            </div>
            
            {message && (
                <div className={`p-2 rounded text-sm text-center ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    Cancel
                </button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400 flex items-center">
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
       </form>
    </Modal>
  );
};

export default UserProfileModal;
