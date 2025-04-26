import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaRegStar, FaStar, FaStarHalfAlt, FaTimes, FaEye } from 'react-icons/fa';
import { fetchProductImage } from '../../api/imageService';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const [productImage, setProductImage] = useState(product.imageUrl || null);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageLoadError, setImageLoadError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setIsImageLoading(true);

        // First try to use existing imageUrl from the product
        if (product.imageUrl && !imageLoadError) {
            setProductImage(product.imageUrl);
            setIsImageLoading(false);
            return;
        }

        // If no imageUrl or previous load failed, try to fetch product image
        fetchProductImage(product.name, product.category)
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
                    setProductImage(`https://placehold.co/300x300/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`);
                    setIsImageLoading(false);
                }
            });

        return () => {
            isMounted = false; // Cleanup to prevent setting state on unmounted component
        };
    }, [product, imageLoadError]);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleViewDetails = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowImageModal(true);
    };

    const handleImageError = () => {
        setImageLoadError(true);
        setProductImage(`https://placehold.co/300x300/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`);
    };

    // Generate image views for the product
    const getProductImages = () => {
        // Start with the main product image
        const mainImage = productImage || `https://placehold.co/600x600/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`;

        // Check if this product should display the summer sale banner
        const isSaleItem = product.onSale || product.price < product.originalPrice;

        // Create consistent alternative views
        return [
            mainImage,
            isSaleItem ?
                // Summer sale banner for products on sale
                "https://via.placeholder.com/600x600/1e6bd4/ffffff?text=Summer+Sale+is+On!%0AGet+up+to+50%+off+on+selected+items.%0ALimited+time+offer." :
                `https://placehold.co/600x600/f1f5f9/334155?text=${encodeURIComponent(product.name)} View 2`,
            `https://placehold.co/600x600/f8fafc/1e293b?text=${encodeURIComponent(product.name)} View 3`,
            `https://placehold.co/600x600/e0f2fe/0c4a6e?text=${encodeURIComponent(product.name)} View 4`
        ];
    };

    // Close image modal
    const closeModal = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setShowImageModal(false);
        setSelectedImageIndex(0); // Reset to first image when modal closes
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
            stars.push(<FaRegStar key={`empty-star-${i}`} className="text-gray-400" />);
        }

        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-1 text-gray-600 text-sm">({rating})</span>
            </div>
        );
    };

    return (
        <>
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
                                onError={handleImageError}
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
                            <button
                                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                                onClick={handleViewDetails}
                            >
                                <FaEye className="mr-1" /> View Details
                            </button>

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

            {/* Image Modal - Show 4 views when View Details is clicked */}
            <AnimatePresence>
                {showImageModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-lg max-w-3xl w-full overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white bg-opacity-60 flex items-center justify-center shadow-md hover:bg-opacity-100"
                            >
                                <FaTimes className="text-gray-800" size={20} />
                            </button>

                            <div className="p-4">
                                <div className="mb-4">
                                    <img
                                        src={getProductImages()[selectedImageIndex]}
                                        alt={`${product.name} - View ${selectedImageIndex + 1}`}
                                        className="w-full h-72 object-contain mx-auto"
                                        onError={handleImageError}
                                    />
                                </div>

                                {/* Thumbnails for switching between views */}
                                <div className="grid grid-cols-4 gap-2">
                                    {getProductImages().map((image, index) => (
                                        <div
                                            key={`modal-thumb-${index}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSelectedImageIndex(index);
                                            }}
                                            className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                                        >
                                            <img
                                                src={image}
                                                alt={`${product.name} view ${index + 1}`}
                                                className="w-full h-16 object-cover hover:opacity-80 transition-opacity duration-200"
                                                onError={handleImageError}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                                        <p className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</p>
                                    </div>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Go To Product
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ProductCard;