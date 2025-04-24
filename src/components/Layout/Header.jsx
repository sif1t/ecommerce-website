import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
    FaShoppingCart,
    FaUser,
    FaSearch,
    FaBars,
    FaTimes,
    FaHeart,
    FaSignOutAlt
} from 'react-icons/fa';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { cartItems, totalItems } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Listen for scroll to apply sticky header effects
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setUserMenuOpen(false);
    }, [location.pathname]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
            setIsSearchOpen(false);
            setSearchTerm('');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Navigation Items
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'Electronics', path: '/shop?category=electronics' },
        { name: 'Clothing', path: '/shop?category=clothing' },
        { name: 'Home & Garden', path: '/shop?category=home' }
    ];

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/80 backdrop-blur-md py-5'}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center">
                        <svg
                            className="w-8 h-8 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                        ShopEx
                    </Link>

                    {/* Desktop Navigation - hidden on small screens */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-sm font-medium transition-colors hover:text-blue-600
                                    ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-700'}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section - Action Buttons */}
                    <div className="flex items-center space-x-4">
                        {/* Search Button & Form */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2 text-gray-700 hover:text-blue-600"
                            aria-label="Search"
                        >
                            <FaSearch />
                        </button>

                        {/* Wishlist - Only shown on large screens */}
                        <Link to="/wishlist" className="hidden md:block p-2 text-gray-700 hover:text-blue-600" aria-label="Wishlist">
                            <FaHeart />
                        </Link>

                        {/* Cart Link with Counter */}
                        <Link to="/cart" className="p-2 text-gray-700 hover:text-blue-600 relative" aria-label="Shopping Cart">
                            <FaShoppingCart />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Account Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="p-2 text-gray-700 hover:text-blue-600 flex items-center"
                                aria-label="User Account"
                            >
                                <FaUser />
                                <span className="hidden md:inline ml-2 text-sm font-medium">
                                    {isAuthenticated ? user.name?.split(' ')[0] || 'Account' : 'Account'}
                                </span>
                            </button>

                            {/* User Dropdown Menu */}
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg border border-gray-100 z-20"
                                    >
                                        {isAuthenticated ? (
                                            <>
                                                <div className="px-4 py-2 border-b border-gray-100">
                                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                                                <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                                                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                                >
                                                    <FaSignOutAlt className="mr-2" /> Sign out
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign in</Link>
                                                <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Create account</Link>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Button - Only visible on small screens */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
                        >
                            {isMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>

                {/* Search Bar - Expandable */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                        >
                            <form onSubmit={handleSearch} className="flex">
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                                >
                                    <FaSearch />
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Menu - Slide-in panel */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden fixed inset-0 bg-black z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="md:hidden fixed right-0 top-0 h-full w-64 bg-white z-50 shadow-xl"
                        >
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="font-semibold text-lg">Menu</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <nav className="p-4">
                                <ul className="space-y-4">
                                    {navItems.map(item => (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className={`block py-2 px-4 rounded-md ${location.pathname === item.path
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 border-t pt-4">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">My Account</h3>
                                    <ul className="space-y-2">
                                        {isAuthenticated ? (
                                            <>
                                                <li>
                                                    <Link to="/account" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/orders" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Orders
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/wishlist" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Wishlist
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left py-2 px-4 text-red-600 hover:bg-gray-50 rounded-md flex items-center"
                                                    >
                                                        <FaSignOutAlt className="mr-2" /> Sign out
                                                    </button>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <li>
                                                    <Link to="/login" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Sign in
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/register" className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Create account
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;