import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../../api';
import { FaStar, FaHotjar, FaTag } from 'react-icons/fa';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const getProductsData = async () => {
            try {
                const products = await fetchProducts();

                // Extract unique categories
                const uniqueCategories = [...new Set(products.map(product => product.category))];
                setCategories(uniqueCategories);

                // Get top rated products for featured section
                const topRatedProducts = [...products]
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 3);
                setFeaturedProducts(topRatedProducts);

                // Get on sale products for popular section
                const onSaleProducts = products
                    .filter(product => product.onSale)
                    .slice(0, 3);
                setPopularProducts(onSaleProducts);
            } catch (error) {
                console.error('Error fetching products data:', error);
            } finally {
                setLoading(false);
            }
        };

        getProductsData();
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
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100 space-y-6">
            {/* Categories Section */}
            <div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Categories</h2>
                </div>

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
            </div>

            {/* Featured Products Section */}
            {!loading && featuredProducts.length > 0 && (
                <div>
                    <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <FaStar className="mr-2" /> Featured Products
                        </h3>
                    </div>
                    <div className="px-4 py-3">
                        <ul className="space-y-3">
                            {featuredProducts.map(product => (
                                <li key={`featured-${product.id}`}>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={product.imageUrl || `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(product.name.charAt(0))}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(product.name.charAt(0))}`;
                                                }}
                                            />
                                        </div>
                                        <div className="ml-3 flex-grow">
                                            <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                                            <div className="flex items-center">
                                                <span className="text-amber-500 text-xs mr-1">★</span>
                                                <span className="text-xs text-gray-500">{product.rating}</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600">${product.price.toFixed(2)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Popular Products Section */}
            {!loading && popularProducts.length > 0 && (
                <div>
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <FaHotjar className="mr-2" /> Hot Deals
                        </h3>
                    </div>
                    <div className="px-4 py-3">
                        <ul className="space-y-3">
                            {popularProducts.map(product => (
                                <li key={`popular-${product.id}`}>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="flex items-center hover:bg-gray-50 p-2 rounded-md transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            <img
                                                src={product.imageUrl || `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(product.name.charAt(0))}`}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(product.name.charAt(0))}`;
                                                }}
                                            />
                                        </div>
                                        <div className="ml-3 flex-grow">
                                            <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                                            <div className="flex items-center">
                                                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-md flex items-center">
                                                    <FaTag className="mr-1 text-xs" /> Save ${(product.originalPrice - product.price).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600">${product.price.toFixed(2)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Promo Section */}
            {!loading && (
                <div className="mx-4 mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
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