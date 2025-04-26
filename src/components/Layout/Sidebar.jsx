import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../../api';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const getCategories = async () => {
            try {
                const products = await fetchProducts();
                // Extract unique categories
                const uniqueCategories = [...new Set(products.map(product => product.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        getCategories();
    }, []);

    // Check if a category is currently active
    const isActive = (category) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get('category') === category;
    };

    // Check if "All Products" is active
    const isAllActive = () => {
        const searchParams = new URLSearchParams(location.search);
        return location.pathname === '/shop' && !searchParams.get('category');
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
            {/* Sidebar Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Categories</h2>
            </div>

            {/* Category List */}
            <div className="px-4 py-5">
                {loading ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="h-8 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                ) : (
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/shop"
                                className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${isAllActive()
                                        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm border-l-4 border-blue-500'
                                        : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                All Products
                            </Link>
                        </li>
                        {categories.map((category) => (
                            <motion.li
                                key={category}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link
                                    to={`/shop?category=${category}`}
                                    className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${isActive(category)
                                            ? 'bg-blue-50 text-blue-700 font-medium shadow-sm border-l-4 border-blue-500'
                                            : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="capitalize">{category}</span>
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Promo Section */}
            {!loading && (
                <div className="mt-4 mx-4 mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Special Deals</h3>
                    <p className="text-xs text-gray-600">Discover our exclusive offers and save on your favorite products!</p>
                    <Link
                        to="/shop?discount=true"
                        className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                        View Deals →
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Sidebar;