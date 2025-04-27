import React, { useState, useEffect, useRef } from 'react';
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
    FaSignOutAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaTruck,
    FaTags,
    FaHeadset,
    FaChevronDown,
    FaBox
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
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);

    const userMenuRef = useRef(null);
    const megaMenuTimeoutRef = useRef(null);

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

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setUserMenuOpen(false);
        setActiveMegaMenu(null);
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

    const handleMegaMenuEnter = (menuName) => {
        clearTimeout(megaMenuTimeoutRef.current);
        setActiveMegaMenu(menuName);
    };

    const handleMegaMenuLeave = () => {
        megaMenuTimeoutRef.current = setTimeout(() => {
            setActiveMegaMenu(null);
        }, 300);
    };

    const toggleMobileSubmenu = (menuName) => {
        setMobileSubmenuOpen(mobileSubmenuOpen === menuName ? null : menuName);
    };

    // Navigation Items with mega menu support
    const navItems = [
        {
            name: 'Home',
            path: '/'
        },
        {
            name: 'Shop',
            path: '/shop',
            hasMegaMenu: true,
            megaMenuContent: {
                featured: [
                    { name: 'New Arrivals', path: '/shop?sort=newest' },
                    { name: 'Best Sellers', path: '/shop?sort=popular' },
                    { name: 'Top Rated', path: '/shop?sort=rating' },
                    { name: 'Sale Items', path: '/shop?sale=true' }
                ],
                categories: [
                    { name: 'Electronics', path: '/shop?category=electronics', icon: 'FaLaptop' },
                    { name: 'Clothing', path: '/shop?category=clothing', icon: 'FaTshirt' },
                    { name: 'Home & Garden', path: '/shop?category=home', icon: 'FaHome' },
                    { name: 'Sports', path: '/shop?category=sports', icon: 'FaRunning' },
                    { name: 'Beauty', path: '/shop?category=beauty', icon: 'FaSprayCan' },
                    { name: 'Books', path: '/shop?category=books', icon: 'FaBook' },
                    { name: 'Toys', path: '/shop?category=toys', icon: 'FaGamepad' },
                    { name: 'Jewelry', path: '/shop?category=jewelry', icon: 'FaGem' }
                ]
            }
        },
        {
            name: 'Electronics',
            path: '/shop?category=electronics',
            hasMegaMenu: true,
            megaMenuContent: {
                featured: [
                    { name: 'Latest Tech', path: '/shop?category=electronics&sort=newest' },
                    { name: 'Gaming Gear', path: '/shop?category=electronics&subcategory=gaming' },
                    { name: 'Smart Home', path: '/shop?category=electronics&subcategory=smarthome' },
                    { name: 'Deals', path: '/shop?category=electronics&sale=true' }
                ],
                categories: [
                    { name: 'Phones & Tablets', path: '/shop?category=electronics&subcategory=phones' },
                    { name: 'Laptops', path: '/shop?category=electronics&subcategory=laptops' },
                    { name: 'TVs & Home Theater', path: '/shop?category=electronics&subcategory=tv' },
                    { name: 'Audio', path: '/shop?category=electronics&subcategory=audio' },
                    { name: 'Cameras', path: '/shop?category=electronics&subcategory=cameras' },
                    { name: 'Wearables', path: '/shop?category=electronics&subcategory=wearables' }
                ]
            }
        },
        {
            name: 'Clothing',
            path: '/shop?category=clothing',
            hasMegaMenu: true,
            megaMenuContent: {
                featured: [
                    { name: 'Summer Collection', path: '/shop?category=clothing&collection=summer' },
                    { name: 'Winter Essentials', path: '/shop?category=clothing&collection=winter' },
                    { name: 'Workwear', path: '/shop?category=clothing&type=work' },
                    { name: 'Sale', path: '/shop?category=clothing&sale=true' }
                ],
                categories: [
                    { name: 'Men', path: '/shop?category=clothing&gender=men' },
                    { name: 'Women', path: '/shop?category=clothing&gender=women' },
                    { name: 'Kids', path: '/shop?category=clothing&gender=kids' },
                    { name: 'Accessories', path: '/shop?category=clothing&type=accessories' }
                ]
            }
        },
        {
            name: 'Sale',
            path: '/shop?sale=true',
        }
    ];

    return (
        <>
            {/* Top bar - Only visible on desktop */}
            <div className={`hidden md:block bg-gray-900 text-white py-2 ${isScrolled ? 'h-0 overflow-hidden opacity-0' : ''} transition-all duration-300`}>
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-xs">
                            <FaPhoneAlt className="mr-2 text-blue-400" size={12} />
                            <span>Customer Support: +1 234 5678</span>
                        </div>
                        <div className="flex items-center text-xs">
                            <FaEnvelope className="mr-2 text-blue-400" size={12} />
                            <span>Email: support@shopex.com</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                        <Link to="/shipping" className="hover:text-blue-400 flex items-center">
                            <FaTruck className="mr-1" size={12} /> Shipping
                        </Link>
                        <Link to="/returns" className="hover:text-blue-400 flex items-center">
                            <FaBox className="mr-1" size={12} /> Returns
                        </Link>
                        <Link to="/help" className="hover:text-blue-400 flex items-center">
                            <FaHeadset className="mr-1" size={12} /> Help Center
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white shadow-sm py-5'
                    }`}
                style={{ marginTop: isScrolled ? '0' : '0' }}
            >
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

                        {/* Search Bar - Always visible on desktop */}
                        <div className="hidden md:flex flex-1 max-w-lg mx-6">
                            <form onSubmit={handleSearch} className="flex w-full">
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                                >
                                    <FaSearch />
                                </button>
                            </form>
                        </div>

                        {/* Right Section - Action Buttons */}
                        <div className="flex items-center space-x-1 md:space-x-4">
                            {/* Search Button - Only visible on mobile */}
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="md:hidden p-2 text-gray-700 hover:text-blue-600"
                                aria-label="Search"
                            >
                                <FaSearch />
                            </button>

                            {/* Sale Button - Only shown on desktop */}
                            <Link
                                to="/shop?sale=true"
                                className="hidden md:flex items-center px-3 py-1.5 rounded-full bg-red-600 text-white text-sm"
                            >
                                <FaTags className="mr-1" size={12} />
                                <span>Sale</span>
                            </Link>

                            {/* Wishlist - Only shown on large screens */}
                            <Link to="/wishlist" className="hidden md:flex items-center p-2 text-gray-700 hover:text-blue-600" aria-label="Wishlist">
                                <FaHeart />
                                <span className="ml-1 text-sm font-medium">Wishlist</span>
                            </Link>

                            {/* Cart Link with Counter */}
                            <Link to="/cart" className="flex items-center p-2 text-gray-700 hover:text-blue-600 relative" aria-label="Shopping Cart">
                                <FaShoppingCart />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                        {totalItems > 9 ? '9+' : totalItems}
                                    </span>
                                )}
                                <span className="ml-1 hidden md:inline text-sm font-medium">Cart</span>
                            </Link>

                            {/* User Account Menu */}
                            <div className="relative" ref={userMenuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="p-2 text-gray-700 hover:text-blue-600 flex items-center"
                                    aria-label="User Account"
                                >
                                    <FaUser />
                                    <span className="hidden md:inline ml-1 text-sm font-medium">
                                        {isAuthenticated ? user?.name?.split(' ')[0] || 'Account' : 'Account'}
                                    </span>
                                    <FaChevronDown className="ml-1" size={12} />
                                </button>

                                {/* User Dropdown Menu */}
                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-64 py-2 bg-white rounded-md shadow-lg border border-gray-100 z-20"
                                        >
                                            {isAuthenticated ? (
                                                <>
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm font-medium text-gray-900">Welcome back,</p>
                                                        <p className="text-sm font-bold text-blue-600">{user.name}</p>
                                                        <p className="text-xs text-gray-500 truncate mt-1">{user.email}</p>
                                                    </div>
                                                    <div className="py-1">
                                                        <Link to="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Account</Link>
                                                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                                                        <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Wishlist</Link>
                                                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                                                    </div>
                                                    <div className="py-1 border-t border-gray-100">
                                                        <button
                                                            onClick={handleLogout}
                                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                        >
                                                            <FaSignOutAlt className="mr-2" /> Sign out
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="px-4 py-3 border-b border-gray-100">
                                                        <p className="text-sm text-gray-500">Welcome to ShopEx</p>
                                                    </div>
                                                    <div className="py-1">
                                                        <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign in</Link>
                                                        <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Create account</Link>
                                                    </div>
                                                    <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
                                                        <p>Sign in to track orders, save products, and get personalized recommendations.</p>
                                                    </div>
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

                    {/* Desktop Navigation - Below search bar */}
                    <div className="hidden md:block border-t border-gray-100 mt-4 pt-2">
                        <nav className="flex items-center justify-center space-x-8">
                            {navItems.map(item => (
                                <div
                                    key={item.path}
                                    className="relative group"
                                    onMouseEnter={() => item.hasMegaMenu ? handleMegaMenuEnter(item.name) : null}
                                    onMouseLeave={handleMegaMenuLeave}
                                >
                                    <Link
                                        to={item.path}
                                        className={`text-sm font-medium py-2 transition-colors hover:text-blue-600 flex items-center
                                            ${location.pathname === item.path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
                                    >
                                        {item.name}
                                        {item.hasMegaMenu && <FaChevronDown className="ml-1" size={12} />}
                                    </Link>

                                    {/* Mega Menu */}
                                    {item.hasMegaMenu && activeMegaMenu === item.name && (
                                        <div
                                            className="absolute top-full left-0 mt-2 w-screen max-w-7xl bg-white shadow-lg border border-gray-200 rounded-lg z-30"
                                            style={{ left: '50%', transform: 'translateX(-50%)' }}
                                            onMouseEnter={() => handleMegaMenuEnter(item.name)}
                                            onMouseLeave={handleMegaMenuLeave}
                                        >
                                            <div className="grid grid-cols-5 gap-6 p-6">
                                                {/* Featured Section */}
                                                <div className="col-span-1 border-r border-gray-200">
                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Featured</h3>
                                                    <ul className="space-y-2">
                                                        {item.megaMenuContent?.featured.map((subItem, index) => (
                                                            <li key={index}>
                                                                <Link
                                                                    to={subItem.path}
                                                                    className="text-gray-600 hover:text-blue-600 text-sm block py-1 transition-colors"
                                                                >
                                                                    {subItem.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Categories Section */}
                                                <div className="col-span-3">
                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">Browse Categories</h3>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        {item.megaMenuContent?.categories.map((category, index) => (
                                                            <Link
                                                                key={index}
                                                                to={category.path}
                                                                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-3 rounded transition-colors flex items-center"
                                                            >
                                                                {category.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Promotion */}
                                                <div className="col-span-1 bg-gray-50 rounded-lg p-4 flex flex-col justify-center">
                                                    <h3 className="font-bold text-lg mb-2">Special Offers</h3>
                                                    <p className="text-sm text-gray-600 mb-3">Get up to 50% off on selected items.</p>
                                                    <Link
                                                        to="/shop?sale=true"
                                                        className="bg-blue-600 text-white text-center text-sm py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-auto"
                                                    >
                                                        Shop Now
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Search Bar - Mobile Only */}
                    <AnimatePresence>
                        {isSearchOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="md:hidden mt-4"
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
            </header>

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
                            className="md:hidden fixed right-0 top-0 h-full w-72 bg-white z-50 shadow-xl overflow-y-auto"
                        >
                            <div className="flex justify-between items-center p-4 border-b">
                                <Link to="/" className="text-lg font-bold text-blue-600 flex items-center">
                                    ShopEx
                                </Link>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <nav className="p-4">
                                <ul className="space-y-2">
                                    {navItems.map(item => (
                                        <li key={item.path}>
                                            {item.hasMegaMenu ? (
                                                <div>
                                                    <button
                                                        onClick={() => toggleMobileSubmenu(item.name)}
                                                        className={`flex justify-between items-center w-full py-2 px-3 rounded-md ${location.pathname === item.path
                                                                ? 'bg-blue-50 text-blue-600'
                                                                : 'text-gray-700'
                                                            }`}
                                                    >
                                                        <span>{item.name}</span>
                                                        <FaChevronDown
                                                            className={`transform transition-transform ${mobileSubmenuOpen === item.name ? 'rotate-180' : ''
                                                                }`}
                                                            size={12}
                                                        />
                                                    </button>

                                                    <AnimatePresence>
                                                        {mobileSubmenuOpen === item.name && (
                                                            <motion.div
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                                className="ml-4 mt-2 border-l-2 border-gray-100 pl-4"
                                                            >
                                                                <div className="mb-3">
                                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Featured</h3>
                                                                    <ul className="space-y-1">
                                                                        {item.megaMenuContent?.featured.map((subItem, index) => (
                                                                            <li key={index}>
                                                                                <Link
                                                                                    to={subItem.path}
                                                                                    className="text-gray-600 text-sm block py-1"
                                                                                >
                                                                                    {subItem.name}
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                <div>
                                                                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">Categories</h3>
                                                                    <ul className="space-y-1">
                                                                        {item.megaMenuContent?.categories.slice(0, 6).map((category, index) => (
                                                                            <li key={index}>
                                                                                <Link
                                                                                    to={category.path}
                                                                                    className="text-gray-600 text-sm block py-1"
                                                                                >
                                                                                    {category.name}
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={item.path}
                                                    className={`block py-2 px-3 rounded-md ${location.pathname === item.path
                                                            ? 'bg-blue-50 text-blue-600'
                                                            : 'text-gray-700'
                                                        }`}
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 border-t pt-4">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">My Account</h3>
                                    <ul className="space-y-2">
                                        {isAuthenticated ? (
                                            <>
                                                <li>
                                                    <Link to="/account" className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/orders" className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Orders
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/wishlist" className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Wishlist
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left py-2 px-3 text-red-600 hover:bg-gray-50 rounded-md flex items-center"
                                                    >
                                                        <FaSignOutAlt className="mr-2" /> Sign out
                                                    </button>
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <li>
                                                    <Link to="/login" className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Sign in
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/register" className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md">
                                                        Create account
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                <div className="mt-6 border-t pt-4">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Help & Settings</h3>
                                    <ul className="space-y-2">
                                        <li>
                                            <Link to="/help" className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                                                <FaHeadset className="mr-2" /> Customer Support
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/shipping" className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                                                <FaTruck className="mr-2" /> Shipping Info
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/returns" className="block py-2 px-3 text-gray-700 hover:bg-gray-50 rounded-md flex items-center">
                                                <FaBox className="mr-2" /> Returns & Refunds
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Space to prevent content from being hidden under the fixed header */}
            <div className={`${isScrolled ? 'h-16' : 'h-24'} md:h-36`}></div>
        </>
    );
};

export default Header;