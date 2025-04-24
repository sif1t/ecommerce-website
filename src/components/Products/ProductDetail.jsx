import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { useCart } from '../../context/CartContext';
import { fetchProducts } from '../../api';
import {
    FaShoppingCart,
    FaRegHeart,
    FaHeart,
    FaRegStar,
    FaStar,
    FaStarHalfAlt,
    FaCheck,
    FaMinus,
    FaPlus
} from 'react-icons/fa';

const ProductDetail = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [added, setAdded] = useState(false);

    const { addToCart } = useCart();

    // Fetch related products based on category
    useEffect(() => {
        if (product?.category) {
            const getRelatedProducts = async () => {
                try {
                    setLoading(true);
                    const data = await fetchProducts(product.category);
                    // Filter out current product and limit to 4 products
                    const filtered = data.filter(p => p.id !== product.id).slice(0, 4);
                    setRelatedProducts(filtered);
                } catch (error) {
                    console.error('Failed to fetch related products:', error);
                } finally {
                    setLoading(false);
                }
            };

            getRelatedProducts();
        }
    }, [product]);

    // Reset state when product changes
    useEffect(() => {
        setQuantity(1);
        setSelectedImage(0);
        setAdded(false);
    }, [product?.id]);

    if (!product) {
        return (
            <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Skeleton height={400} className="rounded-lg mb-4" />
                    <div className="grid grid-cols-4 gap-2">
                        <Skeleton height={80} className="rounded" />
                        <Skeleton height={80} className="rounded" />
                        <Skeleton height={80} className="rounded" />
                        <Skeleton height={80} className="rounded" />
                    </div>
                </div>
                <div>
                    <Skeleton height={40} width={300} className="mb-4" />
                    <Skeleton height={30} width={150} className="mb-4" />
                    <Skeleton height={20} count={5} className="mb-4" />
                    <Skeleton height={50} width={200} className="mb-4" />
                    <Skeleton height={60} className="rounded mb-4" />
                </div>
            </div>
        );
    }

    const handleDecrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrementQuantity = () => {
        if (quantity < (product.stock || 10)) {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);

        // Reset added status after 3 seconds
        setTimeout(() => {
            setAdded(false);
        }, 3000);
    };

    const toggleFavorite = () => {
        setFavorite(!favorite);
    };

    // Generate star rating component
    const renderRating = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-star-${i}`} className="text-yellow-400" />);
        }

        return (
            <div className="flex items-center">
                {stars}
                <span className="ml-2 text-gray-600">({rating})</span>
            </div>
        );
    };

    // Mock images for the gallery (in a real app, product would have multiple images)
    const images = [
        product.imageUrl || "https://via.placeholder.com/600",
        "https://via.placeholder.com/600?text=View+2",
        "https://via.placeholder.com/600?text=View+3",
        "https://via.placeholder.com/600?text=View+4"
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Product Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Image Gallery */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative aspect-square overflow-hidden rounded-lg shadow-md"
                    >
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />

                        <button
                            onClick={toggleFavorite}
                            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100"
                        >
                            {favorite ?
                                <FaHeart className="text-red-500" size={20} /> :
                                <FaRegHeart className="text-gray-500" size={20} />
                            }
                        </button>

                        {product.stock <= 5 && product.stock > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                                Only {product.stock} left!
                            </div>
                        )}

                        {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                                <span className="text-white font-bold text-xl">Out of Stock</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Thumbnail Gallery */}
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                            <div
                                key={`thumb-${index}`}
                                onClick={() => setSelectedImage(index)}
                                className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`${product.name} view ${index + 1}`}
                                    className="w-full h-20 object-cover hover:opacity-80 transition-opacity duration-200"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <p className="text-sm text-gray-500 mt-1 capitalize">Category: {product.category}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        {product.rating && renderRating(product.rating)}
                    </div>

                    <div className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</div>

                    <div className="border-t border-b py-4">
                        <p className="text-gray-700">{product.description}</p>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center">
                        {product.stock > 0 ? (
                            <>
                                <FaCheck className="text-green-500 mr-2" />
                                <span className="text-green-500">In Stock</span>
                            </>
                        ) : (
                            <span className="text-red-500">Out of Stock</span>
                        )}
                    </div>

                    {/* Quantity Selector */}
                    {product.stock > 0 && (
                        <div className="flex items-center space-x-4">
                            <p className="text-gray-700">Quantity:</p>
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button
                                    onClick={handleDecrementQuantity}
                                    className="px-3 py-2 border-r border-gray-300 hover:bg-gray-100"
                                    disabled={quantity <= 1}
                                >
                                    <FaMinus size={12} />
                                </button>
                                <span className="px-4 py-2">{quantity}</span>
                                <button
                                    onClick={handleIncrementQuantity}
                                    className="px-3 py-2 border-l border-gray-300 hover:bg-gray-100"
                                    disabled={quantity >= (product.stock || 10)}
                                >
                                    <FaPlus size={12} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Add to Cart Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || added}
                        className={`w-full py-3 px-6 rounded-md text-white font-medium flex items-center justify-center space-x-2 ${product.stock > 0 && !added
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : added
                                    ? 'bg-green-600'
                                    : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {added ? (
                            <>
                                <FaCheck className="mr-2" />
                                Added to Cart
                            </>
                        ) : (
                            <>
                                <FaShoppingCart className="mr-2" />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="mt-16">
                    <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(relatedProduct => (
                            <Link
                                key={relatedProduct.id}
                                to={`/product/${relatedProduct.id}`}
                                className="group"
                            >
                                <div className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-shadow group-hover:shadow-md">
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={relatedProduct.imageUrl || "https://via.placeholder.com/300"}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-medium truncate">{relatedProduct.name}</h3>
                                        <p className="text-gray-900 font-bold mt-1">${relatedProduct.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;