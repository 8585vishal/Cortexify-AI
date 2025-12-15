
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (username: string, email: string, pass: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (newDetails: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Keys for localStorage
const USERS_DB_KEY = 'cortexify_users_db_v1';
const TEMP_SIGNUP_KEY = 'cortexify_temp_signup_data';
const AUTH_TOKEN_KEY = 'authToken';
const AUTH_USER_KEY = 'authUser';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  const login = async (email: string, pass: string): Promise<boolean> => {
    console.log(`Attempting login for ${email}`);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    try {
        const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
        const storedUser = usersDb[email];

        // Check if user exists and password matches
        if (storedUser && storedUser.password === pass) {
            const loggedInUser: User = { 
                id: storedUser.id, 
                username: storedUser.username, 
                email: storedUser.email 
            };
            
            const mockToken = `jwt-token-${Date.now()}-${Math.random().toString(36).substr(2)}`;
            
            setUser(loggedInUser);
            setToken(mockToken);
            
            localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedInUser));
            
            return true;
        }
    } catch (e) {
        console.error("Login error:", e);
    }
    
    return false;
  };

  const signup = async (username: string, email: string, pass: string): Promise<boolean> => {
    console.log(`Signing up ${email}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
    
    // Check if user already exists
    if (usersDb[email]) {
        console.warn("User already exists");
        return false;
    }

    // Store registration data temporarily until OTP verification
    const tempData = {
        username,
        email,
        password: pass, // Note: In a real production app, passwords must be hashed!
        timestamp: Date.now()
    };
    
    localStorage.setItem(TEMP_SIGNUP_KEY, JSON.stringify(tempData));

    return true;
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    console.log(`Verifying OTP`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple OTP check for demo purposes
    if (otp.length === 6) {
        const tempDataString = localStorage.getItem(TEMP_SIGNUP_KEY);
        if (tempDataString) {
            const tempData = JSON.parse(tempDataString);
            
            const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
            
            // Create new user record
            const newUser = {
                id: `user-${Date.now()}`,
                username: tempData.username,
                email: tempData.email,
                password: tempData.password
            };

            // Save to "DB"
            usersDb[tempData.email] = newUser;
            localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
            
            // Clear temp data
            localStorage.removeItem(TEMP_SIGNUP_KEY);
            
            return true;
        }
    }
    return false; 
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const updateUser = async (newDetails: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...newDetails };
    
    // Update state
    setUser(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
    
    // Update "DB"
    if (user.email) {
        const usersDb = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '{}');
        if (usersDb[user.email]) {
            usersDb[user.email] = { ...usersDb[user.email], ...newDetails };
            localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
        }
    }
    
    return true;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, user, token, login, signup, verifyOtp, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
