
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
  // LAZY INITIALIZATION: Check localStorage BEFORE initial render.
  // This prevents the "flash of login page" when refreshing /chat.
  const [token, setToken] = useState<string | null>(() => {
      try {
          return localStorage.getItem(AUTH_TOKEN_KEY);
      } catch (e) {
          return null;
      }
  });

  const [user, setUser] = useState<User | null>(() => {
      try {
          const storedUser = localStorage.getItem(AUTH_USER_KEY);
          return storedUser ? JSON.parse(storedUser) : null;
      } catch (e) {
          return null;
      }
  });

  // Sync token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  // Sync user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);
  
  const login = async (email: string, pass: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Attempting login for ${normalizedEmail}`);
    
    // Simulate network delay for realism
    await new Promise(resolve => setTimeout(resolve, 800)); 

    try {
        const dbString = localStorage.getItem(USERS_DB_KEY);
        const usersDb = dbString ? JSON.parse(dbString) : {};
        const storedUser = usersDb[normalizedEmail];

        // Strict check: User must exist AND password must match exactly
        if (storedUser && storedUser.password === pass) {
            const loggedInUser: User = { 
                id: storedUser.id, 
                username: storedUser.username, 
                email: storedUser.email 
            };
            
            // Generate a fake session token
            const mockToken = `jwt-token-${Date.now()}-${Math.random().toString(36).substr(2)}`;
            
            // State updates trigger the useEffects above to save to localStorage
            setUser(loggedInUser);
            setToken(mockToken);
            
            return true;
        } else {
             console.warn("Login failed: Invalid credentials or user not found.");
        }
    } catch (e) {
        console.error("Login critical error:", e);
    }
    
    return false;
  };

  const signup = async (username: string, email: string, pass: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();
    
    console.log(`Signing up ${normalizedEmail}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!normalizedEmail || !pass || !cleanUsername) return false;

    try {
        const dbString = localStorage.getItem(USERS_DB_KEY);
        const usersDb = dbString ? JSON.parse(dbString) : {};
        
        // Check if user already exists
        if (usersDb[normalizedEmail]) {
            console.warn("User already exists");
            return false;
        }

        // Store registration data temporarily until OTP verification
        const tempData = {
            username: cleanUsername,
            email: normalizedEmail,
            password: pass, // In a real app, hash this!
            timestamp: Date.now()
        };
        
        localStorage.setItem(TEMP_SIGNUP_KEY, JSON.stringify(tempData));
        return true;
    } catch (e) {
        console.error("Signup error:", e);
        return false;
    }
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    console.log(`Verifying OTP`);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if it's a 6 digit code (Demo mode: accepts any 6 digits to prevent blocking users)
    if (otp.length === 6 && /^\d+$/.test(otp)) {
        try {
            const tempDataString = localStorage.getItem(TEMP_SIGNUP_KEY);
            if (tempDataString) {
                const tempData = JSON.parse(tempDataString);
                
                const dbString = localStorage.getItem(USERS_DB_KEY);
                const usersDb = dbString ? JSON.parse(dbString) : {};
                
                // Create new user record in "DB"
                const newUser = {
                    id: `user-${Date.now()}`,
                    username: tempData.username,
                    email: tempData.email,
                    password: tempData.password
                };

                usersDb[tempData.email] = newUser;
                localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
                
                // Clear temp data
                localStorage.removeItem(TEMP_SIGNUP_KEY);
                
                return true;
            }
        } catch (e) {
            console.error("OTP Verification error:", e);
        }
    }
    return false; 
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // localStorage clearing is handled by the useEffects
    localStorage.removeItem(TEMP_SIGNUP_KEY);
  };

  const updateUser = async (newDetails: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        const updatedUser = { ...user, ...newDetails };
        
        // Update state
        setUser(updatedUser);
        
        // Update "DB"
        if (user.email) {
            const normalizedEmail = user.email.trim().toLowerCase();
            const dbString = localStorage.getItem(USERS_DB_KEY);
            if (dbString) {
                const usersDb = JSON.parse(dbString);
                if (usersDb[normalizedEmail]) {
                    // Preserve password, update other fields
                    usersDb[normalizedEmail] = { 
                        ...usersDb[normalizedEmail], 
                        username: newDetails.username || usersDb[normalizedEmail].username 
                    };
                    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
                }
            }
        }
        return true;
    } catch (e) {
        console.error("Update user error:", e);
        return false;
    }
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
