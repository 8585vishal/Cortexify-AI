import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { toast } from '../hooks/use-toast';
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
import {
  Send,
  Plus,
  MessageSquare,
  Trash2,
  RotateCcw,
  Menu,
  X,
  Trash,
} from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import WelcomeScreen from '../components/WelcomeScreen';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchSessions();
    generateNewSession();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateNewSession = () => {
    const newSessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setCurrentSessionId(newSessionId);
    setMessages([]);
    setShowSidebar(false);
  };

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${API}/chat/sessions`);
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const loadChatHistory = async (sessionId) => {
    try {
      const response = await axios.get(`${API}/chat/session/${sessionId}`);
      setMessages(response.data);
      setCurrentSessionId(sessionId);
      setShowSidebar(false);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat history',
        variant: 'destructive',
      });
    }
  };

  const deleteChatSession = async (sessionId, event) => {
    event.stopPropagation();

    try {
      await axios.delete(`${API}/chat/session/${sessionId}`);
      setSessions(sessions.filter((s) => s.id !== sessionId));
      if (sessionId === currentSessionId) {
        generateNewSession();
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

  const deleteAllSessions = async () => {
    try {
      await Promise.all(
        sessions.map((session) =>
          axios.delete(`${API}/chat/session/${session.id}`)
        )
      );
      setSessions([]);
      generateNewSession();
      setShowDeleteAllDialog(false);
      toast({
        title: 'Success',
        description: 'All chat sessions deleted',
      });
    } catch (error) {
      console.error('Error deleting all sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete all sessions',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${API}/chat`,
        {
          message: inputMessage,
          session_id: currentSessionId,
        },
        {
          timeout: 60000,
        }
      );

      const aiMessage = {
        id: `ai_${Date.now()}`,
        message: response.data.ai_message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMessage]);
        fetchSessions();
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      console.error('Error sending message:', error);

      let errorMessage = 'Failed to send message. Please try again.';
      if (
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout')
      ) {
        errorMessage =
          'Request timed out. The AI might be processing a complex response. Please try again.';
      } else if (error.response?.status === 500) {
        errorMessage =
          'AI service temporarily unavailable. Please try again in a moment.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
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

  const regenerateResponse = async () => {
    if (messages.length < 2) return;

    const lastUserMessage = messages.filter((m) => m.sender === 'user').pop();
    if (!lastUserMessage) return;

    setMessages((prev) =>
      prev.filter((m) => !(m.sender === 'ai' && m === prev[prev.length - 1]))
    );
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post(
        `${API}/chat`,
        {
          message: lastUserMessage.message,
          session_id: currentSessionId,
        },
        {
          timeout: 60000,
        }
      );

      const aiMessage = {
        id: `ai_${Date.now()}`,
        message: response.data.ai_message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMessage]);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      console.error('Error regenerating response:', error);

      let errorMessage = 'Failed to regenerate response';
      if (
        error.code === 'ECONNABORTED' ||
        error.message.includes('timeout')
      ) {
        errorMessage =
          'Request timed out while regenerating. Please try again.';
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex"
      data-testid="chat-page"
    >
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 z-50 lg:translate-x-0 lg:relative lg:w-80 flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <Button
            onClick={generateNewSession}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            data-testid="new-chat-btn"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4 py-4">
          <AnimatePresence>
            <div className="space-y-2">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => loadChatHistory(session.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    session.id === currentSessionId
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
                      : ''
                  }`}
                  data-testid={`session-${session.id}`}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      {session.title}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => deleteChatSession(session.id, e)}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/20 transition-opacity"
                    data-testid={`delete-session-${session.id}`}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </ScrollArea>

        {sessions.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => setShowDeleteAllDialog(true)}
              variant="outline"
              className="w-full rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
            >
              <Trash className="w-4 h-4 mr-2" />
              Clear All Chats
            </Button>
          </div>
        )}
      </motion.div>

      <div className="flex-1 lg:ml-0 flex flex-col h-[calc(100vh-4rem)]">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="lg:hidden rounded-xl"
                data-testid="sidebar-toggle"
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {messages.length > 0 ? 'Chat Session' : 'New Chat'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  AI-powered conversations
                </p>
              </div>
            </div>

            {messages.length > 0 && (
              <Button
                onClick={regenerateResponse}
                variant="outline"
                size="sm"
                disabled={isLoading}
                className="rounded-xl"
                data-testid="regenerate-btn"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            )}
          </div>
        </motion.div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && !isTyping && <WelcomeScreen />}

            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id || index}
                  message={message}
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
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message CORTEXIFY..."
                disabled={isLoading}
                className="pr-16 h-14 bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-600 rounded-2xl text-base shadow-lg focus:shadow-xl transition-all duration-200 backdrop-blur"
                data-testid="message-input"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-2 h-10 w-10 p-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="send-btn"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              CORTEXIFY can make mistakes. Consider checking important
              information.
            </p>
          </div>
        </motion.div>
      </div>

      <AlertDialog
        open={showDeleteAllDialog}
        onOpenChange={setShowDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              your chat sessions and remove all conversation history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteAllSessions}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatPage;
