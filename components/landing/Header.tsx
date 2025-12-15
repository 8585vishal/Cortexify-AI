
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import { useTheme } from '../../context/ThemeContext';
import { SunIcon, MoonIcon, MenuIcon, XIcon } from '../common/Icons';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
    forceDark?: boolean;
    onOpenProfile?: () => void;
}

const Header: React.FC<HeaderProps> = ({ forceDark = false, onOpenProfile }) => {
    const { theme, toggleTheme } = useTheme();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isChatPage = location.pathname.startsWith('/chat');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', targetId: 'home', type: 'anchor' },
        { name: 'Chat', path: '/chat', type: 'route' },
        { name: 'About', targetId: 'about', type: 'anchor' },
        { name: 'Features', targetId: 'features', type: 'anchor' },
        { name: 'Pricing', targetId: 'pricing', type: 'anchor' },
        { name: 'Contact', targetId: 'contact', type: 'anchor' }
    ];

    const handleNavClick = (e: React.MouseEvent, link: any) => {
        if (link.type === 'route') {
            navigate(link.path);
        } else {
            e.preventDefault();
            if (location.pathname === '/') {
                const element = document.getElementById(link.targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                navigate('/', { state: { scrollTo: link.targetId } });
            }
        }
        setIsMobileMenuOpen(false);
    };

    const bgClass = forceDark 
        ? 'bg-gray-900/90 border-gray-700/50' 
        : 'bg-white/90 dark:bg-gray-900/90 border-gray-200 dark:border-gray-700/50';
        
    const textClass = forceDark
        ? 'text-gray-300 hover:text-white'
        : 'text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-white';

    const mobileMenuBg = forceDark ? 'bg-gray-900' : 'bg-white dark:bg-gray-900';

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${bgClass}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                         <Logo />
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex md:items-center md:space-x-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={(e) => handleNavClick(e, link)}
                                className={`text-sm font-medium transition-colors focus:outline-none ${textClass} ${location.pathname === link.path ? 'text-purple-500 font-bold' : ''}`}
                            >
                               {link.name}
                            </button>
                        ))}
                    </nav>

                    {/* Right Side Icons & Buttons */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-full transition-colors ${forceDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'}`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' || forceDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>
                        
                         {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`p-2 rounded-md ${textClass} hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none`}
                            >
                                {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                            </button>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            {!isChatPage && (
                                <Link 
                                    to={isAuthenticated ? "/chat" : "/auth"}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors"
                                >
                                    Start Chatting
                                </Link>
                            )}
                            {isAuthenticated && isChatPage && (
                                <button
                                    onClick={onOpenProfile}
                                    className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs select-none shadow-md hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    title="User Profile"
                                >
                                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className={`md:hidden absolute top-16 left-0 w-full border-b border-gray-200 dark:border-gray-700 shadow-xl ${mobileMenuBg} transition-all duration-300 ease-in-out`}>
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={(e) => handleNavClick(e, link)}
                                className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium ${textClass} hover:bg-gray-50 dark:hover:bg-gray-800`}
                            >
                                {link.name}
                            </button>
                        ))}
                         <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                             {!isChatPage && (
                                <Link 
                                    to={isAuthenticated ? "/chat" : "/auth"}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-teal-500 rounded-md hover:bg-teal-600 transition-colors shadow-md"
                                >
                                    Start Chatting
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
