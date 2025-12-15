
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ChatSession } from '../../types';
import { 
    PlusIcon, MessageSquareIcon, LogOutIcon, 
    PencilIcon, TrashIcon, SearchIcon, XIcon, UserIcon, 
    SettingsIcon, HelpCircleIcon, PaletteIcon, SunIcon, MoonIcon
} from '../common/Icons';
import Modal from '../common/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../common/Logo';

interface SidebarProps {
  sessions: ChatSession[];
  onNewChat: () => void;
  onSelectSession: (session: ChatSession) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onDeleteSession: (sessionId: string) => void;
  activeSessionId?: string;
  isOpen: boolean; // Controls mobile visibility
  onClose: () => void; // Close sidebar on mobile
  onOpenProfile: () => void; // Callback to open profile modal
  onOpenSettings: () => void; // Callback to open settings modal
  onOpenHelp: () => void; // Callback to open help modal
}

const Sidebar: React.FC<SidebarProps> = ({ 
    sessions, onNewChat, onSelectSession, onRenameSession, onDeleteSession, 
    activeSessionId, isOpen, onClose, onOpenProfile, onOpenSettings, onOpenHelp 
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // User Menu State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editingSessionId && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
    }
  }, [editingSessionId]);

  const handleStartEditing = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setTempTitle(session.title);
  };

  const handleFinishEditing = () => {
    if (editingSessionId && tempTitle.trim()) {
        onRenameSession(editingSessionId, tempTitle);
    }
    setEditingSessionId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleFinishEditing();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        setEditingSessionId(null);
    }
  };

  const openDeleteModal = (session: ChatSession) => {
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const handleHelp = () => {
      onOpenHelp();
      setIsUserMenuOpen(false);
  }
  
  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <aside 
      className={`
        bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        w-64 flex flex-col p-4 z-50
        fixed top-0 bottom-0 left-0 md:static md:h-full md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Brand & Toggle */}
      <div className="flex items-center justify-between mb-6 px-2 pt-1 md:pt-0">
        <Logo className="scale-90 origin-left" textSize="text-xl" />
        <div className="flex items-center space-x-2">
            <button
                onClick={toggleTheme}
                className="p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Toggle Theme"
            >
                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            {/* Close button strictly for Mobile */}
            <button 
                onClick={onClose} 
                className="md:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                title="Close Sidebar"
            >
                <XIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
      
      <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center px-4 py-3 mb-4 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
      >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Chat
      </button>

      <div className="relative mb-4">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </span>
        <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-900 bg-gray-200 border border-transparent rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <h2 className="text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 uppercase mb-2 ml-1">
          Recent
        </h2>
        <nav className="space-y-1">
          {filteredSessions.map((session) => (
            <div key={session.id}>
              {editingSessionId === session.id ? (
                <div className="flex items-center w-full px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 rounded-md">
                    <MessageSquareIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onBlur={handleFinishEditing}
                      onKeyDown={handleKeyDown}
                      className="w-full text-sm bg-transparent border-b border-purple-500 focus:outline-none"
                    />
                </div>
              ) : (
                <button
                  onClick={() => onSelectSession(session)}
                  className={`flex items-center group w-full px-3 py-2 text-sm text-left rounded-md transition-colors ${
                    session.id === activeSessionId
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <MessageSquareIcon className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="truncate flex-1">{session.title}</span>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <PencilIcon 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditing(session);
                        }}
                        className="w-4 h-4 ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white" 
                    />
                     <TrashIcon 
                        onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(session);
                        }}
                        className="w-4 h-4 ml-2 text-gray-500 hover:text-red-500" 
                    />
                  </div>
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 relative" ref={menuRef}>
        <AnimatePresence>
            {isUserMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="absolute bottom-full left-0 w-full mb-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 p-1.5 min-w-[240px]" 
                >
                    <div className="space-y-0.5">
                        <button 
                            onClick={() => { toggleTheme(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                            <PaletteIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                            <div className="flex-1 flex justify-between items-center">
                                <span>Appearance</span>
                                <span className="text-xs text-gray-400 uppercase font-medium tracking-wide">
                                    {theme === 'dark' ? 'Dark' : 'Light'}
                                </span>
                            </div>
                        </button>
                        
                        <button 
                            onClick={() => { onOpenProfile(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                            <UserIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                            <span>Personalization</span>
                        </button>

                        <button 
                            onClick={() => { onOpenSettings(); setIsUserMenuOpen(false); }}
                            className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                            <SettingsIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                            <span>Settings</span>
                        </button>

                        <button 
                            onClick={handleHelp}
                            className="w-full flex items-center px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                        >
                            <HelpCircleIcon className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                            <span>Help</span>
                        </button>

                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-1.5 mx-1"></div>

                        <button 
                            onClick={logout}
                            className="w-full flex items-center px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                        >
                            <LogOutIcon className="w-4 h-4 mr-3" />
                            <span>Log out</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full text-left p-2 rounded-lg transition-colors focus:outline-none group ${isUserMenuOpen ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm mr-3 flex-shrink-0 shadow-sm">
                    {user?.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 truncate">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{user?.username}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
            </div>
        </button>
      </div>
    </aside>
    <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Conversation"
    >
        <p className="text-sm text-gray-600 dark:text-gray-400">
            Are you sure you want to delete the conversation titled "{sessionToDelete?.title}"? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end space-x-3">
            <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                Cancel
            </button>
            <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Delete
            </button>
        </div>
    </Modal>
    </>
  );
};

export default Sidebar;
