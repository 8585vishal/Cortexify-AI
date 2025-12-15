
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import { ChatSession, Message, ChatSettings } from '../types';
import { useAuth } from '../context/AuthContext';
import ChatSettingsModal from '../components/chat/ChatSettingsModal';
import UserProfileModal from '../components/chat/UserProfileModal';
import AssumptionModeModal from '../components/chat/AssumptionModeModal';
import HelpModal from '../components/chat/HelpModal';
import { MODEL_NAME } from '../services/geminiService';
import Header from '../components/landing/Header';

const DEFAULT_SETTINGS: ChatSettings = {
    temperature: 0.7,
    maxTokens: 2048,
};

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [chatSettings, setChatSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    
    // State to control mobile sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const userSessionsKey = user ? `cortexify-chat-sessions-${user.id}` : null;
    const userSettingsKey = user ? `cortexify-chat-settings-${user.id}` : null;

    // Derived active session to ensure single source of truth
    const activeSession = sessions.find(s => s.id === activeSessionId) || null;

    // Feature Highlight Logic
    useEffect(() => {
        // We show this modal every time the component mounts to highlight the feature strongly as requested.
        setIsFeatureModalOpen(true);
    }, []);

    // Load sessions and settings from localStorage
    useEffect(() => {
        if (userSessionsKey && userSettingsKey) {
            try {
                const localSessions = localStorage.getItem(userSessionsKey);
                const localSettings = localStorage.getItem(userSettingsKey);
                setSessions(localSessions ? JSON.parse(localSessions) : []);
                setChatSettings(localSettings ? JSON.parse(localSettings) : DEFAULT_SETTINGS);
            } catch (error) {
                console.error("Failed to load data from localStorage:", error);
                setSessions([]);
                setChatSettings(DEFAULT_SETTINGS);
            }
        } else {
            setSessions([]);
            setChatSettings(DEFAULT_SETTINGS);
        }
        setActiveSessionId(null);
    }, [userSessionsKey, userSettingsKey]);

    // Save sessions to localStorage
    useEffect(() => {
        if (userSessionsKey) {
            try {
                localStorage.setItem(userSessionsKey, JSON.stringify(sessions));
            } catch (error) {
                console.error("Failed to save sessions to localStorage:", error);
            }
        }
    }, [sessions, userSessionsKey]);
    
    // Save settings to localStorage
    useEffect(() => {
        if (userSettingsKey) {
            try {
                localStorage.setItem(userSettingsKey, JSON.stringify(chatSettings));
            } catch (error) {
                console.error("Failed to save settings to localStorage:", error);
            }
        }
    }, [chatSettings, userSettingsKey]);


    const handleNewChat = () => {
        const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            title: 'New Conversation',
            messages: []
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        // Close sidebar on mobile when creating new chat
        setIsSidebarOpen(false);
    };

    const selectSession = (session: ChatSession) => {
        setActiveSessionId(session.id);
        // Close sidebar on mobile when selecting a session
        setIsSidebarOpen(false);
    };
    
    const handleSaveSettings = (newSettings: ChatSettings) => {
        setChatSettings(newSettings);
        setIsSettingsModalOpen(false);
    };

    const handleMessagesUpdate = useCallback((sessionId: string, newMessages: Message[]) => {
        setSessions(prevSessions => {
            const targetSession = prevSessions.find(s => s.id === sessionId);
            if (targetSession && JSON.stringify(targetSession.messages) === JSON.stringify(newMessages)) {
                return prevSessions;
            }
            return prevSessions.map(session =>
                session.id === sessionId ? { ...session, messages: newMessages } : session
            );
        });
    }, []);

    const handleRenameSession = useCallback((sessionId: string, newTitle: string) => {
        const title = newTitle.trim() || 'New Conversation';
        setSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === sessionId ? { ...session, title } : session
            )
        );
    }, []);

    const handleDeleteSession = (sessionId: string) => {
        if (activeSessionId === sessionId) {
            setActiveSessionId(null);
        }
        setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
    };

    return (
        <div className="flex flex-col h-screen font-sans bg-white dark:bg-gray-900 text-black dark:text-white overflow-hidden">
            {/* Header restored */}
            <Header forceDark={false} onOpenProfile={() => setIsProfileModalOpen(true)} />
            
            <div className="flex flex-1 pt-16 h-full overflow-hidden relative">
                {/* Mobile Backdrop Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="absolute inset-0 z-30 bg-black/50 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <Sidebar 
                    sessions={sessions} 
                    onNewChat={handleNewChat} 
                    onSelectSession={selectSession} 
                    activeSessionId={activeSessionId || undefined}
                    onRenameSession={handleRenameSession}
                    onDeleteSession={handleDeleteSession}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onOpenProfile={() => setIsProfileModalOpen(true)}
                    onOpenSettings={() => setIsSettingsModalOpen(true)}
                    onOpenHelp={() => setIsHelpModalOpen(true)}
                />
                
                <main className="flex-1 flex flex-col h-full overflow-hidden w-full">
                    <ChatArea 
                        key={activeSession ? activeSession.id : 'new'} 
                        session={activeSession}
                        settings={chatSettings}
                        onMessagesUpdate={handleMessagesUpdate}
                        onOpenSettings={() => setIsSettingsModalOpen(true)}
                        modelName={MODEL_NAME}
                        onRenameSession={handleRenameSession}
                        onNewChat={handleNewChat}
                        onShowSidebar={() => setIsSidebarOpen(true)}
                    />
                </main>
            </div>
            
            <ChatSettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
                currentSettings={chatSettings}
                onSave={handleSaveSettings}
            />

            <UserProfileModal 
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />

            <AssumptionModeModal 
                isOpen={isFeatureModalOpen} 
                onClose={() => setIsFeatureModalOpen(false)} 
            />

            <HelpModal
                isOpen={isHelpModalOpen}
                onClose={() => setIsHelpModalOpen(false)}
            />
        </div>
    );
};

export default ChatPage;
    