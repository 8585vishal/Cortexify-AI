
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

type AuthState = 'login' | 'signup' | 'otp';

const AuthPage: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    otp: ''
  });
  
  const { login, signup, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null); // Clear error when user types
  };

  const switchState = (newState: AuthState) => {
      setAuthState(newState);
      setError(null);
      setFormData(prev => ({ ...prev, otp: '' })); // Keep email/pass mostly, clear OTP
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.email || !formData.password) return;
    
    setIsLoading(true);
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/chat');
    } else {
        setError("Invalid email or password. Please try again.");
    }
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.username || !formData.email || !formData.password) return;

    if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }

    setIsLoading(true);
    const success = await signup(formData.username, formData.email, formData.password);
    if (success) {
      setAuthState('otp');
    } else {
        setError("Account already exists with this email.");
    }
    setIsLoading(false);
  };

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.otp) return;

    setIsLoading(true);
    const success = await verifyOtp(formData.otp);
    if (success) {
      setAuthState('login');
      // Clear password for security, keep email for convenience
      setFormData(prev => ({ ...prev, password: '', otp: '' }));
      alert("Verification successful! Please login.");
    } else {
        setError("Invalid OTP. Please try again.");
    }
    setIsLoading(false);
  };

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <div className="text-center">
          <Logo className="justify-center" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to the future of conversation</p>
        </div>
        
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-center text-red-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
            >
                {error}
            </motion.div>
        )}

        <AnimatePresence mode="wait">
          {authState === 'login' && (
            <motion.form key="login" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleLogin} className="space-y-6">
              <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">Login to your account</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="you@example.com" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="********" 
                />
              </div>
              <button disabled={isLoading} type="submit" className="w-full py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-all duration-300">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Don't have an account? <button type="button" onClick={() => switchState('signup')} className="font-medium text-purple-500 hover:underline">Sign Up</button>
              </p>
            </motion.form>
          )}
          {authState === 'signup' && (
             <motion.form key="signup" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleSignup} className="space-y-6">
               <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">Create an account</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <input 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="your_username" 
                />
              </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                 <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="you@example.com" 
                />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                 <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="********" 
                />
               </div>
               <button disabled={isLoading} type="submit" className="w-full py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-all duration-300">
                 {isLoading ? 'Creating account...' : 'Create Account'}
               </button>
               <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                 Already have an account? <button type="button" onClick={() => switchState('login')} className="font-medium text-purple-500 hover:underline">Sign In</button>
               </p>
             </motion.form>
           )}
           {authState === 'otp' && (
            <motion.form key="otp" variants={formVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleOtp} className="space-y-6">
                <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white">Verify your email</h2>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    We've sent a 6-digit code to your email.
                </p>
                <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Code</label>
                <input 
                    type="text" 
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    maxLength={6} 
                    required 
                    className="w-full px-3 py-2 mt-1 text-center tracking-[1em] text-gray-900 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                    placeholder="123456" 
                />
                </div>
                <button disabled={isLoading} type="submit" className="w-full py-2 font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400 transition-all duration-300">
                {isLoading ? 'Verifying...' : 'Verify'}
                </button>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    <button type="button" onClick={() => switchState('signup')} className="font-medium text-purple-500 hover:underline">Back to Signup</button>
                </p>
            </motion.form>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthPage;
