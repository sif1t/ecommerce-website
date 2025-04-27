import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProducts } from '../api';
import ProductCard from '../components/Products/ProductCard';
import CategorySection from '../components/Layout/CategorySection';
import TestimonialsSection from '../components/Layout/TestimonialsSection';
import { FaArrowRight, FaShippingFast, FaCreditCard, FaHeadset, FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loading, setLoading] = useState(true);

    // Slider state
    const [currentSlide, setCurrentSlide] = useState(0);

    // Slider content - in a real app, this would come from an API
    const slides = [
        {
            id: 1,
            title: "Elevate Your Shopping Experience",
            subtitle: "New Collection 2025",
            description: "Discover premium-quality products curated for the modern lifestyle. Exclusive designs, unparalleled comfort.",
            image: "https://images.unsplash.com/photo-1607082352121-fa243f3dde32?q=80&w=2070",
            buttonText: "Explore Collection",
            buttonLink: "/shop",
            secondButtonText: "Learn More",
            secondButtonLink: "/product/1"
        },
        {
            id: 2,
            title: "Premium Summer Essentials",
            subtitle: "Limited Edition",
            description: "Handpicked selections with exclusive designs and exceptional craftsmanship at competitive prices.",
            image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070",
            buttonText: "Shop Collection",
            buttonLink: "/shop",
            secondButtonText: "View Lookbook",
            secondButtonLink: "/about"
        },
        {
            id: 3,
            title: "Next-Generation Tech",
            subtitle: "Innovation Series",
            description: "Cutting-edge electronics with state-of-the-art features. Experience tomorrow's technology today.",
            image: "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?q=80&w=2070",
            buttonText: "Discover Deals",
            buttonLink: "/shop",
            secondButtonText: "Tech Specs",
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

    // Fetch all products and categorize them
    useEffect(() => {
        const getAllProducts = async () => {
            try {
                const allProducts = await fetchProducts();
                // Get a subset of products for featuring
                setFeaturedProducts(allProducts.slice(0, 4));

                // Filter products for specific categories
                const categoriesToDisplay = ['beauty', 'sports', 'books', 'toys', 'jewelry'];
                const categorized = {};
                categoriesToDisplay.forEach(categorySlug => {
                    categorized[categorySlug] = allProducts
                        .filter(p => p.category && p.category.toLowerCase() === categorySlug)
                        .slice(0, 4); // Take first 4 products for each category section
                });
                setProductsByCategory(categorized);

            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        getAllProducts();
    }, []);

    // Animate elements when they come into view
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
    };

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                <div className="relative h-[650px] lg:h-[700px] xl:h-[800px] overflow-hidden">
                    <AnimatePresence initial={false}>
                        {slides.map((slide, index) => (
                            <motion.div
                                key={slide.id}
                                initial={{ opacity: 0 }}
                                animate={index === currentSlide ? { opacity: 1 } : { opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1 }}
                                className={`absolute inset-0 z-0 ${index === currentSlide ? 'block' : 'hidden'}`}
                            >
                                <motion.div
                                    className="absolute inset-0"
                                    initial={{ scale: 1.1 }}
                                    animate={{ scale: index === currentSlide ? 1 : 1.1 }}
                                    transition={{ duration: 6, ease: "easeOut" }}
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#121a2f]/95 via-[#121a2f]/70 to-transparent"></div>
                                    {/* Fix the SVG background implementation */}
                                    <div 
                                        className="absolute inset-0" 
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E")`,
                                            opacity: 0.2
                                        }}
                                    ></div>
                                </motion.div>

                                <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                        transition={{
                                            duration: 0.8,
                                            delay: 0.3,
                                            staggerChildren: 0.1
                                        }}
                                        className="max-w-2xl"
                                    >
                                        <motion.span
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.3 }}
                                            className="inline-block py-1.5 px-4 bg-blue-600 text-sm font-medium text-white rounded-md mb-6 shadow-lg shadow-blue-900/30"
                                        >
                                            {slide.subtitle}
                                        </motion.span>

                                        <motion.h1
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
                                        >
                                            {slide.title.split(' ').map((word, i) => (
                                                <span key={i} className="inline-block mr-2">
                                                    {word}{' '}
                                                </span>
                                            ))}
                                        </motion.h1>

                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="text-lg md:text-xl mb-8 text-gray-200 font-light leading-relaxed"
                                        >
                                            {slide.description}
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.6 }}
                                            className="flex flex-col sm:flex-row gap-4"
                                        >
                                            <Link
                                                to={slide.buttonLink}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md text-center font-medium transition-all duration-300 shadow-lg hover:shadow-blue-600/30 transform hover:-translate-y-1 border border-blue-500/30 backdrop-blur-sm"
                                            >
                                                {slide.buttonText}
                                            </Link>
                                            <Link
                                                to={slide.secondButtonLink}
                                                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-md text-center font-medium transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1"
                                            >
                                                {slide.secondButtonText}
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8, duration: 1 }}
                                        className="hidden lg:block absolute bottom-28 right-20 z-20"
                                    >
                                        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-xl rotate-3 transform hover:rotate-0 transition-all duration-300">
                                            <div className="flex items-center space-x-2 text-sm font-medium">
                                                <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                                                <span>2,500+ People Online Now</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="absolute inset-0 flex items-center justify-between z-20 px-4">
                        <button
                            onClick={prevSlide}
                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 border border-white/20 shadow-lg group"
                            aria-label="Previous slide"
                        >
                            <FaChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 border border-white/20 shadow-lg group"
                            aria-label="Next slide"
                        >
                            <FaChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>

                    <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    index === currentSlide
                                        ? 'bg-white w-10 shadow-lg shadow-white/30'
                                        : 'bg-white/30 w-2.5 hover:bg-white/50'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white py-16 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-12">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeInUp}
                            className="flex items-start"
                        >
                            <div className="bg-blue-600/10 text-blue-600 p-4 rounded-lg mr-4">
                                <FaShippingFast size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Free Express Shipping</h3>
                                <p className="text-gray-600">Complimentary shipping on all orders over $100</p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeInUp}
                            className="flex items-start"
                        >
                            <div className="bg-blue-600/10 text-blue-600 p-4 rounded-lg mr-4">
                                <FaCreditCard size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Secure Transactions</h3>
                                <p className="text-gray-600">End-to-end encrypted payment processing</p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeInUp}
                            className="flex items-start"
                        >
                            <div className="bg-blue-600/10 text-blue-600 p-4 rounded-lg mr-4">
                                <FaHeadset size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Premium Support</h3>
                                <p className="text-gray-600">Dedicated assistance available 24/7</p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={fadeInUp}
                            className="flex items-start"
                        >
                            <div className="bg-blue-600/10 text-blue-600 p-4 rounded-lg mr-4">
                                <FaCheck size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Satisfaction Guarantee</h3>
                                <p className="text-gray-600">30-day hassle-free returns policy</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="py-20">
                <CategorySection />
            </div>

            <div className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                        <div>
                            <span className="text-blue-600 font-medium mb-2 block">Curated Selection</span>
                            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
                        </div>
                        <Link to="/shop" className="group mt-4 md:mt-0 flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
                            Discover All Products
                            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="rounded-xl overflow-hidden mb-16 bg-gradient-to-r from-blue-700 to-blue-500 shadow-xl relative">
                        <div className="absolute inset-0 z-0">
                            <img
                                src="https://images.unsplash.com/photo-1473186505569-9c61870c11f9?q=80&w=1470&auto=format&fit=crop"
                                alt="Summer background"
                                className="w-full h-full object-cover mix-blend-overlay opacity-40"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 relative z-10">
                            <div className="text-white mb-8 md:mb-0 md:pr-8">
                                <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-md mb-4">
                                    Limited Time Offer
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Summer Collection <br className="hidden md:block" />Up To <span className="text-yellow-300">50% Off</span></h2>
                                <p className="text-lg mb-6 text-blue-50 font-light max-w-lg">
                                    Discover our exclusive summer styles with premium quality and exceptional comfort. Shop now before they're gone.
                                </p>
                                <Link
                                    to="/shop?sale=true"
                                    className="inline-flex items-center bg-white text-blue-600 py-3 px-8 rounded-md font-medium hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg"
                                >
                                    Shop the Sale
                                    <FaArrowRight className="ml-2" />
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center rotate-12 shadow-lg z-10">
                                    <span className="font-bold text-blue-900 text-center">UP TO 50% OFF</span>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl">
                                    <img
                                        src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=500&auto=format&fit=crop"
                                        alt="Summer Sale"
                                        className="w-72 h-72 object-cover rounded-lg shadow-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>

            {Object.entries(productsByCategory).map(([categorySlug, products]) => (
                products.length > 0 && (
                    <div key={categorySlug} className="py-20 bg-gray-50 border-t border-gray-100">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
                                <div>
                                    <span className="text-blue-600 font-medium mb-2 block">Collection</span>
                                    <h2 className="text-3xl md:text-4xl font-bold capitalize">{categorySlug}</h2>
                                </div>
                                <Link to={`/shop?category=${categorySlug}`} className="group mt-4 md:mt-0 flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                    View All {categorySlug}
                                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            ))}

            <div className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1520454974749-611b7248ffdb?q=80&w=2070&auto=format&fit=crop"
                        alt="Promotion background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-600/80"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="mb-10 md:mb-0 md:w-1/2"
                        >
                            <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-md mb-4">
                                Exclusive Offer
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Elevate Your Style<br />This Season
                            </h2>
                            <p className="text-lg md:text-xl text-blue-50 mb-8 font-light max-w-lg">
                                Discover our premium collection with exceptional quality and unmatched comfort at special seasonal pricing.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center bg-white text-blue-600 py-4 px-8 rounded-md font-medium hover:bg-blue-50 transition-colors shadow-md hover:shadow-xl"
                            >
                                Explore Collection
                                <FaArrowRight className="ml-2" />
                            </Link>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="md:w-2/5 relative"
                        >
                            <div className="absolute -top-8 -right-8 w-28 h-28 bg-yellow-400 rounded-full flex items-center justify-center rotate-12 shadow-lg z-10">
                                <div className="text-center">
                                    <span className="block font-bold text-3xl text-blue-900">50%</span>
                                    <span className="block font-bold text-sm text-blue-900">OFF</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=500&auto=format&fit=crop"
                                    alt="Seasonal Collection"
                                    className="rounded-lg w-full h-auto object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="py-20 bg-white border-t border-gray-100">
                <TestimonialsSection />
            </div>

            <div className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/5 bg-blue-600 p-12 flex items-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
                                <div className="absolute bottom-0 right-0 w-56 h-56 bg-blue-400 rounded-full translate-x-1/3 translate-y-1/3 opacity-50"></div>

                                <div className="relative z-10 text-white">
                                    <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
                                    <p className="text-blue-100 font-light">
                                        Join our community and be the first to receive our latest product updates, exclusive offers, and styling tips.
                                    </p>
                                </div>
                            </div>

                            <div className="md:w-3/5 p-12">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                                    Subscribe to Our Newsletter
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    Get special discounts and personalized recommendations delivered straight to your inbox.
                                </p>
                                <form className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Subscribe Now
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;