import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import {
  Send,
  Plus,
  MessageSquare,
  Trash2,
  RotateCcw,
  Menu,
  Pin,
  Archive,
  Search,
  Star,
  TrendingUp,
  BookOpen,
  Sparkles,
  Bot,
  User as UserIcon,
  MoreVertical,
} from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
// Auth modal and API key dialog removed to allow guest usage and backend-managed keys

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const AdvancedChatPage = () => {
  const { user, profile } = useAuth();
  const { 
    messages, 
    setCurrentSession, 
    currentSession, 
    sessions, 
    folders,
    isLoading,
    createSession,
    loadSession,
    deleteSession,
    sendMessage,
    fetchSessions,
    fetchFolders,
    createFolder,
    deleteFolder,
    updateSession
  } = useChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  // Guest usage enabled; no auth modal gating
  const [selectedFolder, setSelectedFolder] = useState(null);
  // Removed API key storage. Keys are configured once on backend.

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Initial data loading is handled by ChatContext
      // No need to call loadUserData() or subscribeToRealtime() here
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Removed local API key preload. Backend handles all API authentication.

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleCreateFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;
    
    try {
      await createFolder(folderName);
      toast({
        title: 'Success',
        description: 'Folder created successfully',
      });
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create folder',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('Are you sure you want to delete this folder and all its chats?')) return;
    
    try {
      await deleteFolder(folderId);
      setSelectedFolder(null);
      toast({
        title: 'Success',
        description: 'Folder deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete folder',
        variant: 'destructive',
      });
    }
  };

  const createNewSession = async () => {
    try {
      const newSession = await createSession('New Chat', selectedFolder);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      
      toast({
        title: 'Success',
        description: 'New chat session created',
      });
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new session',
        variant: 'destructive',
      });
    }
  };

  const handleLoadSession = async (sessionId) => {
    try {
      await loadSession(sessionId);
      setShowSidebar(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat session',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const targetId = sessionId ?? sessionToDelete;
      if (!targetId) return;
      await deleteSession(targetId);
      setShowDeleteDialog(false);
      setSessionToDelete(null);
      
      toast({
        title: 'Success',
        description: 'Chat session deleted',
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete session',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (id) => {
    setSessionToDelete(id);
    setShowDeleteDialog(true);
  };

  const handlePinSession = async (sessionId, isPinned) => {
    try {
      await updateSession(sessionId, { is_pinned: !isPinned });
      toast({
        title: 'Success',
        description: isPinned ? 'Chat unpinned successfully' : 'Chat pinned successfully',
      });
    } catch (error) {
      console.error('Error pinning session:', error);
      toast({
        title: 'Error',
        description: 'Failed to update chat',
        variant: 'destructive',
      });
    }
  };

  const handleArchiveSession = async (sessionId) => {
    try {
      await updateSession(sessionId, { is_archived: true });
      
      toast({
        title: 'Success',
        description: 'Chat archived successfully',
      });
    } catch (error) {
      console.error('Error archiving session:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive chat',
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!currentSession) {
      await createNewSession();
      return;
    }

    const userMessageText = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      await sendMessage(userMessageText);
      setIsTyping(false);
    } catch (error) {
      setIsTyping(false);
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Removed Export functionality per requirements.

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter((s) => s.is_pinned);
  const regularSessions = filteredSessions.filter((s) => !s.is_pinned);

  // Always render chat UI; guests can use chat with backend-managed API key

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 flex">
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setShowSidebar(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          x: showSidebar ? 0 : -320,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-50 lg:translate-x-0 lg:relative lg:w-80 flex flex-col shadow-2xl"
      >
        <div className="p-4 space-y-3 border-b border-gray-200/50 dark:border-gray-700/50">
          <Button
            onClick={createNewSession}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Chat
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-4">
            {pinnedSessions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-3 mb-2">
                  <Pin className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Pinned
                  </span>
                </div>
                <div className="space-y-1">
                  {pinnedSessions.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={currentSession?.id === session.id}
                      onSelect={loadSession}
                      onDelete={openDeleteDialog}
                      onPin={handlePinSession}
                      onArchive={handleArchiveSession}
                    />
                  ))}
                </div>
              </div>
            )}

            {regularSessions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 px-3 mb-2">
                  <MessageSquare className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Recent
                  </span>
                </div>
                <div className="space-y-1">
                  {regularSessions.map((session) => (
                    <SessionItem
                      key={session.id}
                      session={session}
                      isActive={currentSession?.id === session.id}
                      onSelect={loadSession}
                      onDelete={openDeleteDialog}
                      onPin={handlePinSession}
                      onArchive={handleArchiveSession}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
              {profile?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {profile?.plan || 'Free'} Plan
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-4 shadow-sm"
        >
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                  {currentSession?.title || 'New Chat'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {currentSession?.model || 'GPT-4'}
                  </Badge>
                  {currentSession && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {currentSession.message_count} messages
                    </span>
                  )}
                </div>
              </div>
            </div>

            {currentSession && (
          <div className="flex items-center gap-2">
            {/* API Key and Export removed. Backend-managed API key is used globally. */}
          </div>
        )}
          </div>
        </motion.div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && !isTyping && (
              <WelcomeMessage userName={profile?.full_name} />
            )}

            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id || index}
                  message={{
                    ...message,
                    message: message.content,
                    sender: message.role === 'user' ? 'user' : 'ai',
                    timestamp: message.created_at,
                  }}
                  index={index}
                />
              ))}

              {isTyping && <TypingIndicator key="typing" />}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask CORTEXIFY anything..."
                disabled={isLoading}
                className="pr-16 h-14 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-2xl text-base shadow-xl focus:shadow-2xl transition-all duration-200"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-2 h-10 w-10 p-0 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Powered by enterprise-grade AI. Your conversations are secure and private.
            </p>
          </div>
        </motion.div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat
              and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* API Key dialog removed. All requests use backend credentials. */}
    </div>
  );
};

const SessionItem = ({ session, isActive, onSelect, onDelete, onPin, onArchive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`group flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
        isActive
          ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border border-blue-200 dark:border-blue-800 shadow-sm'
          : 'hover:shadow-sm'
      }`}
      onClick={() => onSelect(session.id)}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {session.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {session.message_count} messages
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPin(session.id, session.is_pinned); }}>
            <Pin className="w-4 h-4 mr-2" />
            {session.is_pinned ? 'Unpin' : 'Pin'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(session.id); }}>
            <Archive className="w-4 h-4 mr-2" />
            Archive
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => { 
              e.stopPropagation(); 
              onDelete(session.id);
            }}
            className="text-red-600 dark:text-red-400"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};

const WelcomeMessage = ({ userName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8 py-12"
    >
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 mb-6 shadow-2xl">
        <Sparkles className="w-12 h-12 text-white" />
      </div>

      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          Welcome back{userName ? `, ${userName}` : ''}!
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          What would you like to explore today?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12">
        <FeatureCard
          icon={<TrendingUp className="w-6 h-6" />}
          title="Analyze Data"
          description="Get insights from complex datasets"
        />
        <FeatureCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Learn Something New"
          description="Deep dive into any topic"
        />
        <FeatureCard
          icon={<Sparkles className="w-6 h-6" />}
          title="Creative Ideas"
          description="Brainstorm and innovate"
        />
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

export default AdvancedChatPage;
