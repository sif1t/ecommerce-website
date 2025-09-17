import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart, FaGamepad } from 'react-icons/fa';
import RiflePickupGame from '../components/Game/RiflePickupGame';

const GamePage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-8"
                >
                    <div className="flex items-center gap-4">
                        <Link 
                            to="/" 
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-300"
                        >
                            <FaArrowLeft />
                            <span>Back to Shop</span>
                        </Link>
                        <div className="text-2xl">|</div>
                        <div className="flex items-center gap-2">
                            <FaGamepad className="text-purple-600 text-xl" />
                            <h1 className="text-3xl font-bold text-gray-800">Rifle Pickup Challenge</h1>
                        </div>
                    </div>
                    <Link 
                        to="/shop?category=toys" 
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                    >
                        <FaShoppingCart />
                        <span>Shop Rifles</span>
                    </Link>
                </motion.div>

                {/* Game Description */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-lg shadow-lg p-6 mb-8"
                >
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                The Ultimate Rifle Collection Challenge!
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Test your reflexes and speed in this exciting rifle pickup game! 
                                Click on different types of toy rifles as they appear on screen. 
                                Each rifle type has different point values - collect as many as you can in 60 seconds!
                            </p>
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">5</div>
                                    <div className="text-sm text-gray-600">Rifle Types</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">60</div>
                                    <div className="text-sm text-gray-600">Seconds</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">∞</div>
                                    <div className="text-sm text-gray-600">Fun Level</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <motion.div
                                animate={{ 
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ 
                                    duration: 3, 
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-8xl"
                            >
                                🎯
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Component */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <RiflePickupGame />
                </motion.div>

                {/* Related Products Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 bg-white rounded-lg shadow-lg p-6"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Love the Game? Check Out Our Rifle Collection!
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                        Get your hands on real toy rifles and bring the fun from digital to physical!
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link 
                            to="/shop?category=toys" 
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                        >
                            Toy Rifles
                        </Link>
                        <Link 
                            to="/shop?category=sports" 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                        >
                            Sports Equipment
                        </Link>
                        <Link 
                            to="/shop" 
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                        >
                            All Products
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GamePage;