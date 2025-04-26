import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../api';
import ProductCard from '../components/Products/ProductCard';
import CategorySection from '../components/Layout/CategorySection';
import TestimonialsSection from '../components/Layout/TestimonialsSection';
import { FaArrowRight, FaShippingFast, FaCreditCard, FaHeadset, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Slider state
    const [currentSlide, setCurrentSlide] = useState(0);

    // Slider content - in a real app, this would come from an API
    const slides = [
        {
            id: 1,
            title: "Shop the Latest Trends",
            description: "Discover quality products for every lifestyle. From electronics to fashion, find everything you need.",
            image: "https://images.unsplash.com/photo-1607082352121-fa243f3dde32?q=80&w=2070",
            buttonText: "Shop Now",
            buttonLink: "/shop",
            secondButtonText: "Featured Product",
            secondButtonLink: "/product/1"
        },
        {
            id: 2,
            title: "Summer Collection 2025",
            description: "Explore our newest arrivals with exclusive designs and unbeatable prices.",
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070",
            buttonText: "View Collection",
            buttonLink: "/shop",
            secondButtonText: "Learn More",
            secondButtonLink: "/about"
        },
        {
            id: 3,
            title: "Tech Gadgets on Sale",
            description: "Up to 40% off on the latest smartphones, laptops, and accessories.",
            image: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?q=80&w=2070",
            buttonText: "Explore Deals",
            buttonLink: "/shop",
            secondButtonText: "Tech Guide",
            secondButtonLink: "/blog"
        }
    ];

    // Auto advance slides
    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    // Set up auto-sliding
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 6000);

        return () => clearInterval(interval);
    }, [nextSlide]);

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
            {/* Hero Section with Slider */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                {/* Slider Container */}
                <div className="relative h-[600px] overflow-hidden">
                    {/* Slider Items */}
                    {slides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                }`}
                        >
                            {/* Slide Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Dark overlay for better text visibility */}
                                <div className="absolute inset-0 bg-[#121a2f] opacity-70"></div>
                            </div>

                            {/* Slide Content */}
                            <div className="relative z-10 container mx-auto px-4 py-28 md:py-36 h-full flex items-center">
                                <motion.div
                                    key={`slide-${index}`}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                    transition={{ duration: 0.8 }}
                                    className="max-w-xl"
                                >
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                        {slide.title}
                                    </h1>
                                    <p className="text-lg md:text-xl mb-8 text-gray-200">
                                        {slide.description}
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link
                                            to={slide.buttonLink}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-center font-medium transition duration-200"
                                        >
                                            {slide.buttonText}
                                        </Link>
                                        <Link
                                            to={slide.secondButtonLink}
                                            className="bg-transparent hover:bg-white hover:text-gray-900 text-white border border-white px-6 py-3 rounded-md text-center font-medium transition duration-200"
                                        >
                                            {slide.secondButtonText}
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    ))}

                    {/* Slider Navigation Arrows */}
                    <div className="absolute inset-0 flex items-center justify-between z-20 px-4">
                        <button
                            onClick={prevSlide}
                            className="bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center transition"
                            aria-label="Previous slide"
                        >
                            <FaChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center transition"
                            aria-label="Next slide"
                        >
                            <FaChevronRight size={20} />
                        </button>
                    </div>

                    {/* Slider Indicators */}
                    <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                                    ? 'bg-white w-10'
                                    : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
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

                    {/* Summer Sale Banner */}
                    <div className="rounded-lg overflow-hidden mb-12 bg-gradient-to-r from-blue-700 to-blue-500 relative">
                        {/* Background image with overlay */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=1470&auto=format&fit=crop"
                                alt="Summer background"
                                className="w-full h-full object-cover mix-blend-overlay opacity-40"
                            />
                        </div>

                        {/* Summer sale content */}
                        <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10 relative z-10">
                            <div className="text-white mb-6 md:mb-0">
                                <h2 className="text-3xl md:text-4xl font-bold mb-3">Summer Sale is On!</h2>
                                <p className="text-lg md:text-xl mb-4">Get up to 50% off on selected items. Limited time offer.</p>
                                <Link
                                    to="/shop?sale=true"
                                    className="inline-block bg-white text-blue-600 py-2 px-6 rounded-md font-medium hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
                                >
                                    Shop the Sale
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center rotate-12 shadow-lg">
                                    <span className="font-bold text-blue-900 text-center">UP TO 50% OFF</span>
                                </div>
                                <img
                                    src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=500&auto=format&fit=crop"
                                    alt="Summer Sale"
                                    className="max-h-40 rounded-lg shadow-lg object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Promotional Banner */}
            <div className="py-16 relative overflow-hidden">
                {/* Background image with overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1520454974749-611b7248ffdb?q=80&w=2070&auto=format&fit=crop"
                        alt="Summer background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-600 opacity-80"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
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
                                className="inline-block bg-white text-blue-600 py-3 px-8 rounded-md font-medium hover:bg-gray-100 transition shadow-md hover:shadow-lg"
                            >
                                Shop the Sale
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="md:w-1/3 relative"
                        >
                            <div className="absolute -top-4 -right-4 bg-yellow-400 text-blue-900 py-2 px-4 rounded-full transform rotate-12 font-bold shadow-lg">
                                SALE
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=500&auto=format&fit=crop"
                                alt="Summer Sale"
                                className="rounded-lg shadow-lg w-full h-auto object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <TestimonialsSection />

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