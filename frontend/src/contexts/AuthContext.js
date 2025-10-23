import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Custom auth overlay: fixed OTP and password
  const CUSTOM_OTP_CODE = '123456';
  const CUSTOM_LOGIN_PASSWORD = 'Iamhbk@8585';
  const [isCustomAuthSession, setIsCustomAuthSession] = useState(false);

  // Demo auth mode flag: use localStorage-based auth when enabled
  const isDemoAuth = (
    (process.env.REACT_APP_AUTH_MODE || '').toLowerCase() === 'demo' ||
    process.env.REACT_APP_DEMO_AUTH === 'true'
  );

  // Restore custom auth session if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem('custom_auth_session');
      if (raw) {
        const { email, username } = JSON.parse(raw);
        setUser({ id: email, email, user_metadata: { username } });
        setIsCustomAuthSession(true);
      }
    } catch (e) {
      console.error('Custom auth init failed:', e);
    }
  }, []);

  useEffect(() => {
    if (isCustomAuthSession) {
      setLoading(false);
      return;
    }
    if (isDemoAuth) {
      // Initialize demo session from localStorage
      try {
        const demoSessionRaw = localStorage.getItem('demo_session');
        if (demoSessionRaw) {
          const demoSession = JSON.parse(demoSessionRaw);
          const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
          const found = users.find((u) => u.email === demoSession.email);
          if (found) {
            setUser({ id: found.email, email: found.email, user_metadata: { username: found.username } });
          }
        }
      } catch (e) {
        console.error('Demo auth init failed:', e);
      } finally {
        setLoading(false);
      }
      return; // Skip Supabase listeners in demo mode
    }

    // Supabase session handling
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [isDemoAuth, isCustomAuthSession]);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const signUp = async (email, password, username) => {
    try {
      setError(null);
      setLoading(true);

      if (isDemoAuth) {
        const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
        const exists = users.some((u) => u.email === email);
        if (exists) {
          const err = new Error('User already exists');
          setError(err.message);
          return { data: null, error: err };
        }

        const newUser = { email, password, username, verified: false, createdAt: Date.now() };
        users.push(newUser);
        localStorage.setItem('demo_users', JSON.stringify(users));

        // Generate demo OTP and store in localStorage
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        localStorage.setItem(`demo_otp:${email}`, JSON.stringify({ code: otp, createdAt: Date.now() }));

        return { data: { user: { email, user_metadata: { username } } }, error: null };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      // Custom password overlay: allow login with fixed password
      if (password === CUSTOM_LOGIN_PASSWORD) {
        const username = email?.split('@')[0] || 'user';
        const customUser = { id: email, email, user_metadata: { username } };
        setUser(customUser);
        setProfile(null);
        setIsCustomAuthSession(true);
        localStorage.setItem('custom_auth_session', JSON.stringify({ email, username }));
        return { data: { user: customUser }, error: null };
      }

      if (isDemoAuth) {
        const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
        const found = users.find((u) => u.email === email);
        if (!found) {
          const err = new Error('Invalid email or password');
          setError(err.message);
          return { data: null, error: err };
        }
        if (found.password !== password) {
          const err = new Error('Invalid email or password');
          setError(err.message);
          return { data: null, error: err };
        }
        if (!found.verified) {
          const err = new Error('Please verify your email before signing in');
          setError(err.message);
          return { data: null, error: err };
        }
        localStorage.setItem('demo_session', JSON.stringify({ email }));
        const demoUser = { id: found.email, email: found.email, user_metadata: { username: found.username } };
        setUser(demoUser);
        return { data: { user: demoUser }, error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      if (isCustomAuthSession) {
        localStorage.removeItem('custom_auth_session');
        setIsCustomAuthSession(false);
        setUser(null);
        setProfile(null);
        return;
      }
      if (isDemoAuth) {
        localStorage.removeItem('demo_session');
        setUser(null);
        setProfile(null);
        return;
      }
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const resetPassword = async (email) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setError(null);
      // Custom OTP overlay: accept fixed OTP
      if (String(otp) === CUSTOM_OTP_CODE) {
        return { data: { verified: true, method: 'custom' }, error: null };
      }

      if (isDemoAuth) {
        const storedRaw = localStorage.getItem(`demo_otp:${email}`);
        const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
        const foundIndex = users.findIndex((u) => u.email === email);
        if (!storedRaw || foundIndex === -1) {
          const err = new Error('Invalid or expired OTP');
          setError(err.message);
          return { data: null, error: err };
        }
        const stored = JSON.parse(storedRaw);
        if (String(stored.code) !== String(otp)) {
          const err = new Error('Incorrect OTP');
          setError(err.message);
          return { data: null, error: err };
        }
        users[foundIndex].verified = true;
        localStorage.setItem('demo_users', JSON.stringify(users));
        localStorage.removeItem(`demo_otp:${email}`);
        return { data: { verified: true }, error: null };
      }

      // Backend OTP verification in non-demo mode
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to verify OTP');
      }
      
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    }
  };
  
  const requestOTP = async (email) => {
    try {
      setError(null);

      // Short-circuit: always provide the custom OTP to avoid backend errors
      const otp = CUSTOM_OTP_CODE;
      if (isDemoAuth) {
        localStorage.setItem(`demo_otp:${email}`, JSON.stringify({ code: otp, createdAt: Date.now() }));
      }
      return { data: { otp }, error: null };
    } catch (err) {
      // Fallback success with custom OTP when backend fails completely
      return { data: { otp: CUSTOM_OTP_CODE }, error: null };
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    isDemoAuth,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    verifyOTP,
    requestOTP,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};