import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { FaShoppingCart, FaRegStar, FaStar, FaStarHalfAlt, FaTimes, FaEye, FaRegHeart, FaHeart, FaCheck } from 'react-icons/fa';
import { fetchProductImage } from '../../api/imageService';

const ProductCard = ({ product }) => {
    const { addToCart, isInCart } = useCart();
    const [productImage, setProductImage] = useState(product.imageUrl || null);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [imageLoadError, setImageLoadError] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    // Calculate if product is on sale
    const isOnSale = product.originalPrice && product.price < product.originalPrice;
    const discountPercentage = isOnSale
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Check if product is new (released in last 14 days)
    const isNewProduct = product.releaseDate
        ? (new Date() - new Date(product.releaseDate)) / (1000 * 60 * 60 * 24) <= 14
        : false;

    useEffect(() => {
        let isMounted = true;
        setIsImageLoading(true);

        // Check if product is already in cart
        setAddedToCart(isInCart ? isInCart(product.id) : false);

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
    }, [product, imageLoadError, isInCart]);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        setAddedToCart(true);

        // Show added animation
        setTimeout(() => {
            setAddedToCart(false);
        }, 2000);
    };

    const toggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsWishlist(!isWishlist);
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
                    y: -5,
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)"
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 relative h-full flex flex-col"
            >
                <Link to={`/product/${product.id}`} className="block flex-grow">
                    <div className="relative">
                        {isImageLoading ? (
                            <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center">
                                <span className="text-gray-400">Loading image...</span>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden">
                                <img
                                    src={productImage}
                                    alt={product.name}
                                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                                    onError={handleImageError}
                                />

                                {/* Quick action buttons */}
                                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                                    <button
                                        onClick={toggleWishlist}
                                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                                        aria-label="Add to wishlist"
                                    >
                                        {isWishlist ?
                                            <FaHeart className="text-red-500" /> :
                                            <FaRegHeart className="text-gray-600" />}
                                    </button>

                                    <button
                                        onClick={handleViewDetails}
                                        className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                                        aria-label="Quick view"
                                    >
                                        <FaEye className="text-gray-600" />
                                    </button>
                                </div>

                                {/* Product badges */}
                                <div className="absolute top-2 left-2 flex flex-col gap-2">
                                    {isOnSale && (
                                        <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            {discountPercentage}% OFF
                                        </div>
                                    )}

                                    {isNewProduct && (
                                        <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            NEW
                                        </div>
                                    )}

                                    {product.bestSeller && (
                                        <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            BEST SELLER
                                        </div>
                                    )}

                                    {product.stock <= 5 && product.stock > 0 && (
                                        <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                                            Only {product.stock} left!
                                        </div>
                                    )}
                                </div>

                                {product.stock === 0 && (
                                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">Out of Stock</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="p-4">
                        {/* Category */}
                        {product.category && (
                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                {product.category}
                            </div>
                        )}

                        {/* Product title */}
                        <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>

                        {/* Product rating */}
                        {product.rating && (
                            <div className="mt-1">
                                {renderRating(product.rating)}
                            </div>
                        )}

                        {/* Product description */}
                        <p className="mt-2 text-gray-600 text-sm line-clamp-2 h-10">
                            {product.description}
                        </p>

                        {/* Price section */}
                        <div className="mt-2 flex items-center">
                            {isOnSale ? (
                                <>
                                    <span className="font-bold text-lg text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                </>
                            ) : (
                                <span className="font-bold text-lg text-gray-900">
                                    ${product.price.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>
                </Link>

                {/* Call to action button */}
                <div className="px-4 pb-4 mt-auto">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || addedToCart}
                        className={`w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${product.stock === 0
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                : addedToCart
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {product.stock === 0 ? (
                            <>Out of Stock</>
                        ) : addedToCart ? (
                            <>
                                <FaCheck className="mr-2" />
                                Added to Cart
                            </>
                        ) : (
                            <>
                                <FaShoppingCart className="mr-2" />
                                Add to Cart
                            </>
                        )}
                    </motion.button>
                </div>
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
                            className="bg-white rounded-lg max-w-4xl w-full overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white bg-opacity-60 flex items-center justify-center shadow-md hover:bg-opacity-100"
                            >
                                <FaTimes className="text-gray-800" size={20} />
                            </button>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left: Product Image */}
                                    <div>
                                        <div className="mb-4 bg-gray-50 rounded-lg overflow-hidden">
                                            <img
                                                src={getProductImages()[selectedImageIndex]}
                                                alt={`${product.name} - View ${selectedImageIndex + 1}`}
                                                className="w-full h-80 object-contain mx-auto"
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
                                    </div>

                                    {/* Right: Product Details */}
                                    <div>
                                        {product.category && (
                                            <div className="text-sm text-blue-600 font-medium mb-1">
                                                {product.category}
                                            </div>
                                        )}

                                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{product.name}</h3>

                                        {product.rating && (
                                            <div className="mb-3">
                                                {renderRating(product.rating)}
                                            </div>
                                        )}

                                        <div className="mb-4">
                                            {isOnSale ? (
                                                <div className="flex items-center">
                                                    <span className="text-2xl font-bold text-gray-900">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                                        ${product.originalPrice.toFixed(2)}
                                                    </span>
                                                    <span className="ml-2 text-sm text-white bg-red-500 px-2 py-1 rounded">
                                                        Save {discountPercentage}%
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-900">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-6">
                                            {product.description}
                                        </p>

                                        {/* Availability */}
                                        <div className="flex items-center mb-4">
                                            <span className="text-gray-700 font-medium mr-2">Availability:</span>
                                            {product.stock > 10 ? (
                                                <span className="text-green-600 flex items-center">
                                                    <FaCheck className="mr-1" /> In Stock
                                                </span>
                                            ) : product.stock > 0 ? (
                                                <span className="text-orange-500">
                                                    Low Stock ({product.stock} left)
                                                </span>
                                            ) : (
                                                <span className="text-red-500">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-6 space-y-3">
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Full Details
                                            </Link>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleAddToCart(e);
                                                }}
                                                disabled={product.stock === 0}
                                                className={`w-full flex items-center justify-center py-3 px-4 rounded-md font-medium ${product.stock === 0
                                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                                    }`}
                                            >
                                                <FaShoppingCart className="mr-2" />
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
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