import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    // Generate star rating component
    const renderRating = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
        }

        // Add half star if needed
        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
        }

        // Add empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-400" />);
        }

        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-1 text-gray-600 text-sm">({rating})</span>
            </div>
        );
    };

    return (
        <motion.div
            whileHover={{
                scale: 1.03,
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg overflow-hidden border border-gray-200"
        >
            <Link to={`/product/${product.id}`} className="block h-full">
                <div className="relative pb-2/3">
                    <img
                        src={product.imageUrl || `https://placehold.co/300x300/e2e8f0/1e293b?text=${product.name}`}
                        alt={product.name}
                        className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-300"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/300x300/e2e8f0/1e293b?text=${product.name}`;
                        }}
                    />

                    {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Only {product.stock} left!
                        </div>
                    )}

                    {product.stock === 0 && (
                        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">Out of Stock</span>
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                        <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    </div>

                    {product.rating && (
                        <div className="mt-1">
                            {renderRating(product.rating)}
                        </div>
                    )}

                    <p className="mt-2 text-gray-600 text-sm line-clamp-2 h-10">
                        {product.description}
                    </p>

                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                            {product.category && (
                                <span className="capitalize">{product.category}</span>
                            )}
                        </span>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`flex items-center px-3 py-2 rounded-md text-sm ${product.stock > 0
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 cursor-not-allowed text-gray-500'
                                }`}
                        >
                            <FaShoppingCart className="mr-1" />
                            Add to Cart
                        </motion.button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;