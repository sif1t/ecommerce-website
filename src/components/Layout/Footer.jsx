import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube, FaArrowRight } from 'react-icons/fa';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email && email.includes('@')) {
            // In a real app, you would call an API to handle the subscription
            console.log('Subscribing email:', email);
            setSubscribed(true);
            setEmail('');

            // Reset the subscribed message after 3 seconds
            setTimeout(() => {
                setSubscribed(false);
            }, 3000);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Logo and About */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="text-2xl font-bold text-white flex items-center mb-4">
                            <svg
                                className="w-8 h-8 mr-2"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            ShopEx
                        </Link>
                        <p className="text-gray-400 mb-4">
                            Discover quality products for every lifestyle. From electronics to fashion, find everything you need with fast shipping and guaranteed satisfaction.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaFacebook size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaTwitter size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaInstagram size={20} />
                            </a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaPinterest size={20} />
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2">
                            <li><Link to="/shop" className="text-gray-400 hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/shop?category=electronics" className="text-gray-400 hover:text-white transition-colors">Electronics</Link></li>
                            <li><Link to="/shop?category=clothing" className="text-gray-400 hover:text-white transition-colors">Clothing</Link></li>
                            <li><Link to="/shop?category=home" className="text-gray-400 hover:text-white transition-colors">Home & Garden</Link></li>
                            <li><Link to="/new-arrivals" className="text-gray-400 hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link to="/sale" className="text-gray-400 hover:text-white transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    {/* Customer Service Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQs</Link></li>
                            <li><Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">Shipping & Delivery</Link></li>
                            <li><Link to="/returns" className="text-gray-400 hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link to="/payment" className="text-gray-400 hover:text-white transition-colors">Payment Methods</Link></li>
                            <li><Link to="/warranty" className="text-gray-400 hover:text-white transition-colors">Warranty</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Signup */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest products, trends, and exclusive offers.</p>

                        <form onSubmit={handleSubscribe} className="space-y-2">
                            <div className="flex">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="bg-gray-800 text-gray-300 py-2 px-3 rounded-l-md flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-md px-3 transition flex items-center"
                                >
                                    <FaArrowRight />
                                </button>
                            </div>
                            {subscribed && (
                                <p className="text-green-400 text-sm">Thank you for subscribing!</p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="border-t border-gray-800 pt-8 pb-6">
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="bg-gray-800 rounded p-2 inline-block w-12 h-8"></span>
                        <span className="bg-gray-800 rounded p-2 inline-block w-12 h-8"></span>
                        <span className="bg-gray-800 rounded p-2 inline-block w-12 h-8"></span>
                        <span className="bg-gray-800 rounded p-2 inline-block w-12 h-8"></span>
                        <span className="bg-gray-800 rounded p-2 inline-block w-12 h-8"></span>
                    </div>
                    <p className="text-center text-gray-500 text-sm mt-4">
                        We accept all major credit cards and payment methods
                    </p>
                </div>

                {/* Copyright and Legal Links */}
                <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <div className="mb-4 flex flex-wrap justify-center gap-4">
                        <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
                        <Link to="/accessibility" className="hover:text-white">Accessibility</Link>
                        <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
                    </div>
                    <p>&copy; {currentYear} ShopEx. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;