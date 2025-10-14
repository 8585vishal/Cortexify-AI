import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
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
  X,
  Trash,
  Folder,
  FolderPlus,
  Pin,
  Archive,
  Search,
  Settings,
  Download,
  Star,
  TrendingUp,
  BookOpen,
  Sparkles,
  Bot,
  User as UserIcon,
  ChevronDown,
  MoreVertical,
} from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import { AuthModal } from '../components/AuthModal';

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
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [folders, setFolders] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadUserData();
      subscribeToRealtime();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUserData = async () => {
    await Promise.all([fetchSessions(), fetchFolders()]);
  };

  const subscribeToRealtime = () => {
    const channel = supabase
      .channel('chat_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat sessions',
        variant: 'destructive',
      });
    }
  };

  const fetchFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const createNewSession = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Chat',
          folder_id: selectedFolder,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      setMessages([]);
      await fetchSessions();

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

  const loadSession = async (sessionId) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      setCurrentSession(sessionData);

      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);
      setShowSidebar(false);
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat session',
        variant: 'destructive',
      });
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;

      setSessions(sessions.filter((s) => s.id !== sessionId));

      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }

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

  const pinSession = async (sessionId, isPinned) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ is_pinned: !isPinned })
        .eq('id', sessionId);

      if (error) throw error;
      await fetchSessions();
    } catch (error) {
      console.error('Error pinning session:', error);
    }
  };

  const archiveSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ is_archived: true })
        .eq('id', sessionId);

      if (error) throw error;
      await fetchSessions();

      toast({
        title: 'Success',
        description: 'Chat session archived',
      });
    } catch (error) {
      console.error('Error archiving session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!currentSession) {
      await createNewSession();
      return;
    }

    const userMessageText = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const { data: userMessage, error: userError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          user_id: user.id,
          role: 'user',
          content: userMessageText,
        })
        .select()
        .single();

      if (userError) throw userError;

      setMessages((prev) => [...prev, userMessage]);

      if (currentSession.message_count === 0) {
        const title = userMessageText.substring(0, 50) + (userMessageText.length > 50 ? '...' : '');
        await supabase
          .from('chat_sessions')
          .update({ title })
          .eq('id', currentSession.id);
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const aiResponse = `This is a simulated AI response to: "${userMessageText}".

In a production environment, this would integrate with a real AI service like OpenAI, Anthropic Claude, or other LLM providers. The response would be generated based on the conversation context and the AI model's capabilities.

For now, this demonstrates the chat interface, message flow, and database persistence.`;

      const { data: aiMessage, error: aiError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          user_id: user.id,
          role: 'assistant',
          content: aiResponse,
          tokens_used: 150,
          model: currentSession.model || 'gpt-4',
        })
        .select()
        .single();

      if (aiError) throw aiError;

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);

      await supabase
        .from('usage_analytics')
        .insert({
          user_id: user.id,
          session_id: currentSession.id,
          event_type: 'message_sent',
          tokens_used: 150,
          model: currentSession.model || 'gpt-4',
        });

      await fetchSessions();
    } catch (error) {
      setIsTyping(false);
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const exportChat = async () => {
    if (!currentSession || messages.length === 0) return;

    const chatExport = {
      session: currentSession,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.created_at,
      })),
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(chatExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${currentSession.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'Chat exported successfully',
    });
  };

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedSessions = filteredSessions.filter((s) => s.is_pinned);
  const regularSessions = filteredSessions.filter((s) => !s.is_pinned);

  if (!user) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Welcome to CORTEXIFY
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
            Sign in to unlock enterprise-grade AI chat capabilities with advanced features like folders, analytics, and real-time collaboration.
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started
          </Button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signin"
        />
      </div>
    );
  }

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
                      onDelete={deleteSession}
                      onPin={pinSession}
                      onArchive={archiveSession}
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
                      onDelete={deleteSession}
                      onPin={pinSession}
                      onArchive={archiveSession}
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
                <Button
                  onClick={exportChat}
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
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
                onClick={sendMessage}
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
            <AlertDialogTitle>Delete Chat Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat session and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (sessionToDelete) {
                  deleteSession(sessionToDelete);
                  setSessionToDelete(null);
                }
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
            onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
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
