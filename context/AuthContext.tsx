
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  // Mock API calls
  const login = async (email: string, pass: string): Promise<boolean> => {
    console.log(`Logging in with ${email}`);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    // Retrieve registered users from local storage to find the username if it exists
    const registeredUsersMap = JSON.parse(localStorage.getItem('cortexify_registered_users') || '{}');
    let username = registeredUsersMap[email] || email.split('@')[0];
    
    // Capitalize first letter of username for better UI
    username = username.charAt(0).toUpperCase() + username.slice(1);

    const loggedInUser: User = { 
        id: `user-${Date.now()}`, 
        username: username, 
        email: email 
    };
    
    const mockToken = `fake-jwt-token-${Date.now()}`;
    
    setUser(loggedInUser);
    setToken(mockToken);
    
    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('authUser', JSON.stringify(loggedInUser));
    
    return true;
  };

  const signup = async (username: string, email: string, pass: string): Promise<boolean> => {
    console.log(`Signing up with ${username}, ${email}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Store user details in a mock "database" in localStorage so we can retrieve the username on login
    const registeredUsersMap = JSON.parse(localStorage.getItem('cortexify_registered_users') || '{}');
    registeredUsersMap[email] = username;
    localStorage.setItem('cortexify_registered_users', JSON.stringify(registeredUsersMap));

    return true; // Assume signup is successful and leads to OTP
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    console.log(`Verifying OTP ${otp}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    // In a real app, this would verify against the backend
    return otp.length === 6; 
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const updateUser = async (newDetails: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const updatedUser = { ...user, ...newDetails };
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
    
    // Also update the mock DB
    if (updatedUser.email) {
        const registeredUsersMap = JSON.parse(localStorage.getItem('cortexify_registered_users') || '{}');
        registeredUsersMap[updatedUser.email] = updatedUser.username;
        localStorage.setItem('cortexify_registered_users', JSON.stringify(registeredUsersMap));
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
