import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { fetchProductImage } from '../../api/imageService';

// Category to image mapping - Kept as fallback
const categoryImages = {
    electronics: '/images/categories/electronics.jpg',
    clothing: '/images/categories/clothing.jpg',
    home: '/images/categories/home.jpg',
    books: '/images/categories/books.jpg',
    toys: '/images/categories/toys.jpg',
    sports: '/images/categories/sports.jpg',
    beauty: '/images/categories/beauty.jpg',
    jewelry: '/images/categories/jewelry.jpg',
    // Add more categories as needed
};

// Default image paths by product type - Kept as fallback
const productTypeImages = {
    smartphone: '/images/categories/electronics/smartphone.jpg',
    laptop: '/images/categories/electronics/laptop.jpg',
    headphones: '/images/categories/electronics/headphones.jpg',
    watch: '/images/categories/electronics/watch.jpg',
    tshirt: '/images/categories/clothing/tshirt.jpg',
    jeans: '/images/categories/clothing/jeans.jpg',
    // Add more specific product types as needed
};

const getImageForProduct = async (product) => {
    // Try to get image from our automatic image service
    try {
        const autoImage = await fetchProductImage(product.name, product.category);
        if (autoImage) {
            return autoImage;
        }
    } catch (error) {
        console.error('Error fetching automatic image:', error);
        // Continue to fallbacks if automatic fetch fails
    }

    // If product has a valid imageUrl, use it
    if (product.imageUrl && !product.imageUrl.includes('placeholder')) {
        return product.imageUrl;
    }

    // Try to match by product type (derived from name)
    const productNameLower = product.name.toLowerCase();
    for (const [type, image] of Object.entries(productTypeImages)) {
        if (productNameLower.includes(type)) {
            return image;
        }
    }

    // Fall back to category image
    if (product.category && categoryImages[product.category.toLowerCase()]) {
        return categoryImages[product.category.toLowerCase()];
    }

    // Ultimate fallback: placeholder with product name
    return `https://placehold.co/300x300/e2e8f0/1e293b?text=${product.name}`;
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [productImage, setProductImage] = useState(null);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsImageLoading(true);

        // Fetch product image when component mounts
        getImageForProduct(product)
            .then(imageUrl => {
                if (isMounted) {
                    setProductImage(imageUrl);
                    setIsImageLoading(false);
                }
            })
            .catch(error => {
                console.error(`Error loading image for ${product.name}:`, error);
                if (isMounted) {
                    // Set fallback on error
                    setProductImage(`https://placehold.co/300x300/e2e8f0/1e293b?text=${product.name}`);
                    setIsImageLoading(false);
                }
            });

        return () => {
            isMounted = false; // Cleanup to prevent setting state on unmounted component
        };
    }, [product]);

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
                    {isImageLoading ? (
                        <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
                            <span className="text-gray-400">Loading image...</span>
                        </div>
                    ) : (
                        <img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-300"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/300x300/e2e8f0/1e293b?text=${product.name}`;
                            }}
                        />
                    )}

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