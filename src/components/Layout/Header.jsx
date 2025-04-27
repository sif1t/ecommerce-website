import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

// Sample mega menu data
const megaMenuData = {
    categories: [
        {
            name: 'Electronics',
            subcategories: [
                { name: 'Smartphones', link: '/shop?category=smartphones' },
                { name: 'Laptops', link: '/shop?category=laptops' },
                { name: 'Audio', link: '/shop?category=audio' },
                { name: 'Accessories', link: '/shop?category=accessories' }
            ]
        },
        {
            name: 'Fashion',
            subcategories: [
                { name: "Men's Clothing", link: '/shop?category=mens-clothing' },
                { name: "Women's Clothing", link: '/shop?category=womens-clothing' },
                { name: 'Footwear', link: '/shop?category=footwear' },
                { name: 'Accessories', link: '/shop?category=fashion-accessories' }
            ]
        },
        {
            name: 'Home & Living',
            subcategories: [
                { name: 'Furniture', link: '/shop?category=furniture' },
                { name: 'Decor', link: '/shop?category=decor' },
                { name: 'Kitchen', link: '/shop?category=kitchen' },
                { name: 'Bath', link: '/shop?category=bath' }
            ]
        }
    ],
    featured: [
        {
            name: 'Summer Collection',
            description: 'New arrivals for the season',
            image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=300&auto=format&fit=crop',
            link: '/shop?collection=summer'
        },
        {
            name: 'Special Offers',
            description: 'Up to 50% off selected items',
            image: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=300&auto=format&fit=crop',
            link: '/shop?discount=true'
        }
    ]
};

const Header = () => {
    const { cart } = useCart();
    const { currentUser, logout } = useAuth();
    const location = useLocation();

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [megaMenuVisible, setMegaMenuVisible] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);

    const headerRef = useRef(null);
    const searchInputRef = useRef(null);

    // Detect scroll position to change header style
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setIsScrolled(scrollPosition > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mega menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (headerRef.current && !headerRef.current.contains(e.target)) {
                setMegaMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    // Close mobile menu on location change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Implement search functionality
        if (searchQuery.trim()) {
            // Navigate to search results page
            window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleMegaMenuToggle = (category) => {
        if (activeMegaMenu === category) {
            setMegaMenuVisible(false);
            setActiveMegaMenu(null);
        } else {
            setMegaMenuVisible(true);
            setActiveMegaMenu(category);
        }
    };

    // Calculate total cart items
    const cartItemCount = cart?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled
                    ? 'bg-white shadow-md py-2'
                    : 'bg-transparent py-3'
                }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="mr-8">
                        <div className="flex items-center">
                            <span className={`font-bold text-2xl ${isScrolled ? 'text-blue-600' : 'text-white'}`}>
                                LUXEMART
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <nav className="hidden lg:flex items-center space-x-1 flex-grow">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/'
                                    ? 'text-blue-600'
                                    : isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                }`}
                        >
                            Home
                        </Link>

                        {/* Shop dropdown with mega menu */}
                        <div className="relative">
                            <button
                                className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center ${location.pathname.includes('/shop')
                                        ? 'text-blue-600'
                                        : isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                    }`}
                                onClick={() => handleMegaMenuToggle('shop')}
                                aria-expanded={activeMegaMenu === 'shop'}
                            >
                                Shop
                                <FaChevronDown className={`ml-1.5 w-3 h-3 transition-transform ${megaMenuVisible && activeMegaMenu === 'shop' ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Mega Menu */}
                            <AnimatePresence>
                                {megaMenuVisible && activeMegaMenu === 'shop' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl p-6 w-[600px] grid grid-cols-4 gap-6"
                                        onMouseLeave={() => setMegaMenuVisible(false)}
                                    >
                                        {/* Categories section - 3 columns */}
                                        <div className="col-span-3 grid grid-cols-3 gap-6">
                                            {megaMenuData.categories.map((category, index) => (
                                                <div key={index} className="space-y-4">
                                                    <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                                        {category.name}
                                                    </h3>
                                                    <ul className="space-y-2">
                                                        {category.subcategories.map((subcategory, idx) => (
                                                            <li key={idx}>
                                                                <Link
                                                                    to={subcategory.link}
                                                                    className="text-gray-600 hover:text-blue-600 text-sm block transition-colors"
                                                                >
                                                                    {subcategory.name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Featured section - 1 column */}
                                        <div className="col-span-1 space-y-4">
                                            <h3 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
                                                Featured
                                            </h3>
                                            <div className="space-y-4">
                                                {megaMenuData.featured.map((item, index) => (
                                                    <Link key={index} to={item.link} className="block group">
                                                        <div className="rounded-lg overflow-hidden mb-2">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                                            {item.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-600">{item.description}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link
                            to="/categories"
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/categories'
                                    ? 'text-blue-600'
                                    : isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                }`}
                        >
                            Categories
                        </Link>

                        <Link
                            to="/about"
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/about'
                                    ? 'text-blue-600'
                                    : isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                }`}
                        >
                            About
                        </Link>

                        <Link
                            to="/contact"
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === '/contact'
                                    ? 'text-blue-600'
                                    : isScrolled ? 'text-gray-800 hover:text-blue-600' : 'text-white hover:text-blue-200'
                                }`}
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Search button */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className={`p-2 rounded-full hover:bg-opacity-10 transition-colors ${isScrolled
                                    ? 'hover:bg-gray-200 text-gray-800'
                                    : 'hover:bg-white text-white'
                                }`}
                            aria-label="Search"
                        >
                            <FaSearch className="w-5 h-5" />
                        </button>

                        {/* Wishlist - Hidden on small screens */}
                        <Link
                            to="/wishlist"
                            className={`p-2 rounded-full hover:bg-opacity-10 transition-colors hidden sm:flex ${isScrolled
                                    ? 'hover:bg-gray-200 text-gray-800'
                                    : 'hover:bg-white text-white'
                                }`}
                            aria-label="Wishlist"
                        >
                            <FaHeart className="w-5 h-5" />
                        </Link>

                        {/* User actions */}
                        <div className="relative">
                            <Link
                                to={currentUser ? "/account" : "/login"}
                                className={`p-2 rounded-full hover:bg-opacity-10 transition-colors ${isScrolled
                                        ? 'hover:bg-gray-200 text-gray-800'
                                        : 'hover:bg-white text-white'
                                    }`}
                                aria-label={currentUser ? "My Account" : "Login"}
                            >
                                <FaUser className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className={`p-2 rounded-full relative hover:bg-opacity-10 transition-colors ${isScrolled
                                    ? 'hover:bg-gray-200 text-gray-800'
                                    : 'hover:bg-white text-white'
                                }`}
                            aria-label="Shopping Cart"
                        >
                            <FaShoppingCart className="w-5 h-5" />
                            {cartItemCount > 0 && (
                                <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`lg:hidden p-2 rounded-full hover:bg-opacity-10 transition-colors ${isScrolled
                                    ? 'hover:bg-gray-200 text-gray-800'
                                    : 'hover:bg-white text-white'
                                }`}
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileMenuOpen ? (
                                <FaTimes className="w-5 h-5" />
                            ) : (
                                <FaBars className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden bg-white shadow-lg overflow-hidden"
                    >
                        <div className="py-4 px-4">
                            <nav className="flex flex-col space-y-3">
                                <Link
                                    to="/"
                                    className={`px-4 py-2 rounded-md ${location.pathname === '/' ? 'bg-blue-100 text-blue-700' : 'text-gray-800'}`}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/shop"
                                    className={`px-4 py-2 rounded-md ${location.pathname === '/shop' ? 'bg-blue-100 text-blue-700' : 'text-gray-800'}`}
                                >
                                    Shop
                                </Link>
                                <Link
                                    to="/categories"
                                    className={`px-4 py-2 rounded-md ${location.pathname === '/categories' ? 'bg-blue-100 text-blue-700' : 'text-gray-800'}`}
                                >
                                    Categories
                                </Link>
                                <Link
                                    to="/about"
                                    className={`px-4 py-2 rounded-md ${location.pathname === '/about' ? 'bg-blue-100 text-blue-700' : 'text-gray-800'}`}
                                >
                                    About
                                </Link>
                                <Link
                                    to="/contact"
                                    className={`px-4 py-2 rounded-md ${location.pathname === '/contact' ? 'bg-blue-100 text-blue-700' : 'text-gray-800'}`}
                                >
                                    Contact
                                </Link>

                                <div className="border-t border-gray-200 pt-3 mt-3">
                                    {currentUser ? (
                                        <>
                                            <Link
                                                to="/account"
                                                className="px-4 py-2 rounded-md block text-gray-800"
                                            >
                                                My Account
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="px-4 py-2 rounded-md block text-gray-800"
                                            >
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={logout}
                                                className="px-4 py-2 rounded-md block text-gray-800 text-left w-full"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="px-4 py-2 rounded-md block text-gray-800"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="px-4 py-2 rounded-md block text-gray-800"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search overlay */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20"
                        onClick={() => setSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-4 pl-6 pr-12 text-lg text-gray-900 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                                    aria-label="Search"
                                >
                                    <FaSearch className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" />
                                </button>
                            </form>
                            <div className="py-3 px-6 bg-gray-50 border-t border-gray-100">
                                <p className="text-sm text-gray-600">Popular searches: Smartphone, Laptop, Headphones</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;