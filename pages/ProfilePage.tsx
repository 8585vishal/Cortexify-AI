
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User } from '../types';
import Logo from '../components/common/Logo';
import { SunIcon, MoonIcon } from '../components/common/Icons';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email });
    } else {
        // Should not happen due to protected route, but as a fallback
        navigate('/auth');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError('');

    if (formData.username.trim().length < 3) {
        setError('Username must be at least 3 characters long.');
        return;
    }

    setIsLoading(true);
    const success = await updateUser({ username: formData.username, email: formData.email });
    setIsLoading(false);

    if (success) {
      setIsEditing(false);
    } else {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    if (user) {
        setFormData({ username: user.username, email: user.email });
    }
    setIsEditing(false);
    setError('');
  };
  
  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 font-sans relative">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors z-10"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>

      <div className="w-full max-w-2xl p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl relative z-0">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h1>
            <Logo />
        </div>
        
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            {!isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Username</label>
                        <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.username}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                        <p className="mt-1 text-lg text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <button onClick={() => setIsEditing(true)} className="w-full py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors">
                            Edit Profile
                        </button>
                        <Link to="/chat" className="w-full text-center py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
                            Back to Chat
                        </Link>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSaveChanges} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                        <input 
                            type="text" 
                            name="username"
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email (cannot be changed)</label>
                        <input 
                            type="email" 
                            name="email"
                            id="email"
                            value={formData.email}
                            disabled
                            className="w-full px-3 py-2 mt-1 text-gray-500 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-500 cursor-not-allowed"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div className="flex space-x-4 pt-2">
                        <button type="submit" disabled={isLoading} className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors">
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={handleCancel} className="w-full py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
