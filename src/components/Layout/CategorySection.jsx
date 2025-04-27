import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

// Featured categories with images and descriptions
const categories = [
    {
        id: 'electronics',
        name: 'Electronics',
        description: 'Cutting-edge technology for your modern lifestyle',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1032&auto=format&fit=crop',
        color: 'from-blue-500 to-indigo-600',
        count: 124
    },
    {
        id: 'fashion',
        name: 'Fashion',
        description: 'Trendy styles for every occasion',
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1170&auto=format&fit=crop',
        color: 'from-pink-500 to-rose-500',
        count: 237
    },
    {
        id: 'home',
        name: 'Home & Living',
        description: 'Beautiful essentials for your space',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=958&auto=format&fit=crop',
        color: 'from-amber-500 to-orange-600',
        count: 189
    },
    {
        id: 'beauty',
        name: 'Beauty',
        description: 'Self-care products for your wellness routine',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=980&auto=format&fit=crop',
        color: 'from-purple-500 to-violet-600',
        count: 103
    },
    {
        id: 'sports',
        name: 'Sports & Outdoors',
        description: 'Equipment and gear for active lifestyles',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop',
        color: 'from-green-500 to-emerald-600',
        count: 158
    },
    {
        id: 'books',
        name: 'Books & Media',
        description: 'Expand your knowledge and imagination',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1170&auto=format&fit=crop',
        color: 'from-cyan-500 to-blue-500',
        count: 214
    }
];

const CategorySection = () => {
    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <div className="container mx-auto px-6">
            {/* Section Header with subtle animation and improved styling */}
            <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5 }}
            >
                <span className="text-blue-600 font-medium mb-2 block">Browse Collections</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Shop by Category</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Explore our wide range of carefully curated products across popular categories
                </p>
            </motion.div>

            {/* Category Grid with staggered animations */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {categories.map((category) => (
                    <motion.div
                        key={category.id}
                        variants={itemVariants}
                        whileHover={{
                            y: -5,
                            transition: { duration: 0.2 }
                        }}
                        className="group relative overflow-hidden rounded-2xl shadow-lg h-72 sm:h-80 md:h-96"
                    >
                        {/* Category background image with overlay gradient */}
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Gradient overlay using the category's color */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}></div>
                        </div>

                        {/* Category content with improved layout */}
                        <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 text-white">
                            <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                                <h3 className="text-2xl sm:text-3xl font-bold mb-2">{category.name}</h3>
                                <p className="text-white/90 mb-4 max-w-xs">{category.description}</p>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium bg-white/20 backdrop-blur-sm py-1 px-3 rounded-full">
                                    {category.count} Products
                                </span>

                                <Link
                                    to={`/shop?category=${category.id}`}
                                    className="flex items-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-2 px-4 rounded-full text-sm font-medium transition-all duration-300 group-hover:pl-5"
                                >
                                    Explore
                                    <FaArrowRight className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* "View all categories" button with animated arrow */}
            <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <Link
                    to="/shop"
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-medium transition-colors group"
                >
                    View All Categories
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
            </motion.div>
        </div>
    );
};

export default CategorySection;