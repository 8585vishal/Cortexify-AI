import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Use Node backend for all AI calls; single server-side API key
const STREAM_API_URL = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000') + '/api';

const generateId = () => `${Math.random().toString(36).slice(2)}_${Date.now()}`;
const systemPrompt = 'You are CORTEXIFY, a helpful, concise assistant.';

// Local sessions, backend-only inference

const ChatContext = createContext({});

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [folders, setFolders] = useState([]);

  // Local storage helpers (scoped per user)
  const storageScope = user?.id || user?.email || 'guest';
  const sessionsKey = `chat_sessions_${storageScope}`;
  const messagesKey = (sid) => `chat_messages_${storageScope}_${sid}`;
  const foldersKey = `chat_folders_${storageScope}`;

  const readLS = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };
  const writeLS = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  };

// Removed direct frontend LLM calls; backend handles all inference securely.

  // Fetch sessions/folders initially and when user scope changes
  useEffect(() => {
    fetchSessions();
    fetchFolders();
  }, [user]);

  // Fetch messages when current session changes
  useEffect(() => {
    if (currentSession) {
      fetchMessages(currentSession.id);
    } else {
      setMessages([]);
    }
  }, [currentSession]);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const localSessions = readLS(sessionsKey, []);
      setSessions(localSessions);
      if (!currentSession && localSessions.length > 0) {
        setCurrentSession(localSessions[0]);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load chat sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (sessionId) => {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const localMessages = readLS(messagesKey(sessionId), []);
      setMessages(localMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load chat messages');
    } finally {
      setIsLoading(false);
    }
  };

  const createSession = async (title = 'New Chat', folderId = null) => {
    try {
      setIsLoading(true);
      const newSession = {
        id: generateId(),
        title,
        message_count: 0,
        is_pinned: false,
        is_archived: false,
        folder_id: folderId,
        model: 'server',
        created_at: new Date().toISOString(),
      };
      const updated = [newSession, ...readLS(sessionsKey, [])];
      writeLS(sessionsKey, updated);
      setSessions(updated);
      setCurrentSession(newSession);
      writeLS(messagesKey(newSession.id), []);
      return newSession;
    } catch (err) {
      console.error('Error creating session:', err);
      setError('Failed to create new chat session');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message, sessionId = null) => {
    try {
      setIsLoading(true);
      const targetSessionId = sessionId || currentSession?.id;
      {
        // Local session with backend streaming inference
        const sid = targetSessionId || generateId();
        if (!targetSessionId) {
          const newSession = {
            id: sid,
            title: 'New Chat',
            message_count: 0,
            is_pinned: false,
            is_archived: false,
            folder_id: null,
            model: 'server',
            created_at: new Date().toISOString(),
          };
          const updatedSessions = [newSession, ...readLS(sessionsKey, [])];
          writeLS(sessionsKey, updatedSessions);
          setSessions(updatedSessions);
          setCurrentSession(newSession);
          writeLS(messagesKey(sid), []);
        }

        const conversation = readLS(messagesKey(sid), []);
        const userMsg = { id: generateId(), role: 'user', content: message, created_at: new Date().toISOString() };
        const startingConvo = [...conversation, userMsg];
        writeLS(messagesKey(sid), startingConvo);
        setMessages(startingConvo);

        // Start streaming from Node backend
        const res = await fetch(`${STREAM_API_URL}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history: startingConvo.map((m) => ({ role: m.role, content: m.content })) }),
        });

        if (!res.ok || !res.body) {
          // If streaming fails, surface a helpful error
          const aiMsg = { id: generateId(), role: 'assistant', content: 'Server unavailable. Check backend and server API key.', created_at: new Date().toISOString() };
          const finalFallback = [...startingConvo, aiMsg];
          writeLS(messagesKey(sid), finalFallback);
          setMessages(finalFallback);
          const sessListFB = readLS(sessionsKey, []);
          const idxFB = sessListFB.findIndex((s) => s.id === sid);
          if (idxFB >= 0) {
            const title = sessListFB[idxFB].title && sessListFB[idxFB].title !== 'New Chat' ? sessListFB[idxFB].title : message.slice(0, 60);
            sessListFB[idxFB] = { ...sessListFB[idxFB], title, message_count: finalFallback.length };
            writeLS(sessionsKey, sessListFB);
            setSessions(sessListFB);
          }
          return { session_id: sid, messages: finalFallback };
        }

        // Stream tokens via ReadableStream
        const aiMsgId = generateId();
        const aiPlaceholder = { id: aiMsgId, role: 'assistant', content: '', created_at: new Date().toISOString() };
        setMessages((prev) => [...prev, aiPlaceholder]);

        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let readerDone = false;
        while (!readerDone) {
          const { value, done } = await reader.read();
          readerDone = done;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data:')) {
                const dataStr = line.slice(5).trim();
                if (dataStr === '[DONE]') {
                  readerDone = true;
                  break;
                }
                try {
                  const json = JSON.parse(dataStr);
                  const token = json?.token;
                  if (token) {
                    setMessages((prev) => {
                      const updated = [...prev];
                      const lastIndex = updated.length - 1;
                      updated[lastIndex] = { ...updated[lastIndex], content: (updated[lastIndex].content || '') + token };
                      writeLS(messagesKey(sid), updated);
                      return updated;
                    });
                  }
                } catch {}
              }
            }
          }
        }

        // Update session meta
        const sessList = readLS(sessionsKey, []);
        const idx = sessList.findIndex((s) => s.id === sid);
        if (idx >= 0) {
          const finalConvo = readLS(messagesKey(sid), []);
          const title = sessList[idx].title && sessList[idx].title !== 'New Chat'
            ? sessList[idx].title
            : message.slice(0, 60);
          sessList[idx] = { ...sessList[idx], title, message_count: finalConvo.length };
          writeLS(sessionsKey, sessList);
          setSessions(sessList);
        }

        return { session_id: sid, messages: readLS(messagesKey(sid), []) };
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!sessionId) return;
    
    try {
      setIsLoading(true);
      const remaining = readLS(sessionsKey, []).filter((s) => s.id !== sessionId);
      writeLS(sessionsKey, remaining);
      localStorage.removeItem(messagesKey(sessionId));
      setSessions(remaining);
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }
      return true;
    } catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete chat session');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    if (!sessionId) return;
    const target = (sessions || []).find((s) => s.id === sessionId);
    setCurrentSession(target || null);
    await fetchMessages(sessionId);
  };

  const fetchFolders = async () => {
    try {
      setFolders(readLS(foldersKey, []));
    } catch (err) {
      console.error('Error fetching folders:', err);
    }
  };

  const createFolder = async (name) => {
    if (!name) return null;
    const folder = { id: generateId(), name, created_at: new Date().toISOString() };
    const updated = [folder, ...readLS(foldersKey, [])];
    writeLS(foldersKey, updated);
    setFolders(updated);
    return folder;
  };

  const deleteFolder = async (folderId) => {
    if (!folderId) return false;
    const remaining = readLS(foldersKey, []).filter((f) => f.id !== folderId);
    writeLS(foldersKey, remaining);
    setFolders(remaining);
    // Unassign folder from sessions
    const sessList = readLS(sessionsKey, []).map((s) => (s.folder_id === folderId ? { ...s, folder_id: null } : s));
    writeLS(sessionsKey, sessList);
    setSessions(sessList);
    return true;
  };

  const updateSession = async (sessionId, updates = {}) => {
    if (!sessionId) return false;
    try {
      const sessList = readLS(sessionsKey, []);
      const idx = sessList.findIndex((s) => s.id === sessionId);
      if (idx >= 0) {
        sessList[idx] = { ...sessList[idx], ...updates };
        writeLS(sessionsKey, sessList);
        setSessions(sessList);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating session:', err);
      return false;
    }
  };

  const value = {
    sessions,
    currentSession,
    setCurrentSession,
    messages,
    isLoading,
    error,
    fetchSessions,
    fetchMessages,
    createSession,
    sendMessage,
    deleteSession,
    loadSession,
    folders,
    fetchFolders,
    createFolder,
    deleteFolder,
    updateSession,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;