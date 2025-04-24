import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../api';
import ProductCard from '../components/Products/ProductCard';
import CategorySection from '../components/Layout/CategorySection';
import { FaArrowRight, FaShippingFast, FaCreditCard, FaHeadset, FaCheck } from 'react-icons/fa';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch featured products on component mount
    useEffect(() => {
        const getFeaturedProducts = async () => {
            try {
                const products = await fetchProducts();
                // Get a subset of products for featuring (in a real app, you'd have a featured flag in the API)
                setFeaturedProducts(products.slice(0, 4));
            } catch (error) {
                console.error('Error fetching featured products:', error);
            } finally {
                setLoading(false);
            }
        };

        getFeaturedProducts();
    }, []);

    // Animate elements when they come into view
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                {/* Hero Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/hero-background.jpg"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    {/* Dark overlay for better text visibility */}
                    <div className="absolute inset-0 bg-[#121a2f] opacity-90"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 py-28 md:py-36">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Shop the Latest Trends
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-gray-200">
                            Discover quality products for every lifestyle. From electronics to fashion, find everything you need with fast shipping and guaranteed satisfaction.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/shop"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-center font-medium transition duration-200"
                            >
                                Shop Now
                            </Link>
                            <Link
                                to="/product/1"
                                className="bg-transparent hover:bg-white hover:text-gray-900 text-white border border-white px-6 py-3 rounded-md text-center font-medium transition duration-200"
                            >
                                Featured Product
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Value Propositions */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="bg-blue-600 text-white p-3 rounded-full mb-4">
                                <FaShippingFast size={24} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
                            <p className="text-gray-600">On orders over $100</p>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="bg-blue-600 text-white p-3 rounded-full mb-4">
                                <FaCreditCard size={24} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
                            <p className="text-gray-600">100% secure transactions</p>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="bg-blue-600 text-white p-3 rounded-full mb-4">
                                <FaHeadset size={24} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Dedicated customer service</p>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="bg-blue-600 text-white p-3 rounded-full mb-4">
                                <FaCheck size={24} />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
                            <p className="text-gray-600">30-day money back guarantee</p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Category Section - Using the new component */}
            <CategorySection />

            {/* Featured Products */}
            <div className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
                        <Link to="/shop" className="text-blue-600 hover:text-blue-800 flex items-center transition">
                            View All <FaArrowRight className="ml-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Promotional Banner */}
            <div className="bg-blue-600 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="mb-8 md:mb-0 md:w-1/2"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Summer Sale is On!
                            </h2>
                            <p className="text-lg text-blue-100 mb-6">
                                Get up to 50% off on selected items. Limited time offer.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-block bg-white text-blue-600 py-3 px-8 rounded-md font-medium hover:bg-gray-100 transition"
                            >
                                Shop the Sale
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="md:w-1/3"
                        >
                            <img
                                src="https://via.placeholder.com/500x400"
                                alt="Summer Sale"
                                className="rounded-lg shadow-lg w-full h-auto"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center mb-4">
                                <div className="mr-4">
                                    <img
                                        src="https://via.placeholder.com/64"
                                        alt="Customer"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Sarah Johnson</h4>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "I've been shopping here for years and the quality of products never disappoints. Fast shipping and great customer service!"
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center mb-4">
                                <div className="mr-4">
                                    <img
                                        src="https://via.placeholder.com/64"
                                        alt="Customer"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Michael Wilson</h4>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "The checkout process was seamless and my order arrived earlier than expected. Definitely my go-to online store now!"
                            </p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center mb-4">
                                <div className="mr-4">
                                    <img
                                        src="https://via.placeholder.com/64"
                                        alt="Customer"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold">Emily Rodriguez</h4>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">
                                "Great selection of products at competitive prices. The customer support team was extremely helpful when I had questions!"
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="bg-blue-600 rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Subscribe to Our Newsletter
                        </h2>
                        <p className="text-blue-100 mb-6">
                            Get the latest updates, exclusive offers, and special discounts delivered straight to your inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                                type="submit"
                                className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-md font-medium transition"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;