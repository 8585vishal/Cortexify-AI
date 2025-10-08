import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent } from './components/ui/card';
import { ScrollArea } from './components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Separator } from './components/ui/separator';
import { Badge } from './components/ui/badge';
import { Toaster } from './components/ui/toaster';
import { toast } from './hooks/use-toast';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Bot, 
  User,
  Moon,
  Sun,
  RotateCcw
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [sessions, setSessions] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
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
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
    }
  };

  const deleteChatSession = async (sessionId, event) => {
    event.stopPropagation();
    try {
      await axios.delete(`${API}/chat/session/${sessionId}`);
      setSessions(sessions.filter(s => s.id !== sessionId));
      if (sessionId === currentSessionId) {
        generateNewSession();
      }
      toast({
        title: "Success",
        description: "Chat session deleted",
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error", 
        description: "Failed to delete session",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      message: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Set a longer timeout for the axios request to handle complex queries
      const response = await axios.post(`${API}/chat`, {
        message: inputMessage,
        session_id: currentSessionId
      }, {
        timeout: 60000 // 60 seconds timeout for complex AI responses
      });

      const aiMessage = {
        id: `ai_${Date.now()}`,
        message: response.data.ai_message,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, aiMessage]);
        fetchSessions(); // Refresh sessions list
      }, 1000);

    } catch (error) {
      setIsTyping(false);
      console.error('Error sending message:', error);
      
      // Better error handling for different scenarios
      let errorMessage = "Failed to send message. Please try again.";
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = "Request timed out. The AI might be processing a complex response. Please try again.";
      } else if (error.response?.status === 500) {
        errorMessage = "AI service temporarily unavailable. Please try again in a moment.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
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
    
    const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
    if (!lastUserMessage) return;

    // Remove last AI response
    setMessages(prev => prev.filter(m => !(m.sender === 'ai' && m === prev[prev.length - 1])));
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: lastUserMessage.message,
        session_id: currentSessionId
      });

      const aiMessage = {
        id: `ai_${Date.now()}`,
        message: response.data.ai_message,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);

    } catch (error) {
      setIsTyping(false);
      console.error('Error regenerating response:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (text) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`} data-testid="cortexify-app">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        
        {/* Sidebar Overlay */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`fixed left-0 top-0 h-full w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative lg:w-80`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  CORTEXIFY
                </h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="rounded-xl"
                data-testid="theme-toggle"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
            
            <Button
              onClick={generateNewSession}
              className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl h-11 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              data-testid="new-chat-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4 py-4">
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => loadChatHistory(session.id)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    session.id === currentSessionId ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : ''
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
                    data-testid={`delete-session-${session.id}`}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 lg:ml-80 flex flex-col h-screen">
          
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden rounded-xl"
                  data-testid="sidebar-toggle"
                >
                  <MessageSquare className="w-4 h-4" />
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
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              
              {messages.length === 0 && !isTyping && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to CORTEXIFY
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Your intelligent AI assistant is ready to help. Start a conversation!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {[
                      { icon: "💡", title: "Creative Ideas", desc: "Brainstorm and explore new concepts" },
                      { icon: "📚", title: "Learning", desc: "Get explanations and tutorials" },
                      { icon: "💼", title: "Productivity", desc: "Optimize workflows and tasks" },
                      { icon: "🔍", title: "Research", desc: "Find and analyze information" }
                    ].map((item, index) => (
                      <Card key={index} className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer bg-white/50 dark:bg-gray-800/50 backdrop-blur border-gray-200 dark:border-gray-700">
                        <CardContent className="p-0 text-center">
                          <div className="text-2xl mb-2">{item.icon}</div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message, index) => (
                <div
                  key={message.id || index}
                  className={`flex items-start space-x-4 ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                  data-testid={`message-${message.sender}-${index}`}
                >
                  <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-700 shadow-lg">
                    <AvatarFallback className={`${
                      message.sender === 'user' 
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                    } text-white font-semibold`}>
                      {message.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : ''}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {message.sender === 'user' ? 'You' : 'CORTEXIFY'}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <Card className={`${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    } shadow-lg`}>
                      <CardContent className="p-4">
                        <div 
                          className={`prose prose-sm max-w-none ${
                            message.sender === 'user' 
                              ? 'prose-invert' 
                              : 'prose-gray dark:prose-invert'
                          }`}
                          dangerouslySetInnerHTML={{ 
                            __html: formatMessage(message.message) 
                          }}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start space-x-4" data-testid="typing-indicator">
                  <Avatar className="w-10 h-10 border-2 border-white dark:border-gray-700 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                      <Bot className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">Thinking...</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message CORTEXIFY..."
                  disabled={isLoading}
                  className="pr-16 h-12 bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-600 rounded-2xl text-base shadow-lg focus:shadow-xl transition-all duration-200 backdrop-blur"
                  data-testid="message-input"
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="absolute right-2 top-2 h-8 w-8 p-0 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="send-btn"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                CORTEXIFY can make mistakes. Consider checking important information.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;