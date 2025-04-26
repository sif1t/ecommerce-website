import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchProducts, searchProducts, fetchMoreProducts } from '../../api';
import ProductCard from './ProductCard';
import { FaSearch, FaSort, FaFilter, FaChevronLeft, FaChevronRight, FaStar, FaTags, FaSpinner } from 'react-icons/fa';
import { preloadProductImages } from '../../api/imageService';

const ProductList = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [filterOpen, setFilterOpen] = useState(false);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [onSaleProducts, setOnSaleProducts] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [pageSize] = useState(16);

    const carouselRef = useRef(null);
    const loadMoreRef = useRef(null);

    // Fetch products
    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                setPage(0);
                const data = await fetchProducts(category);
                setProducts(data);
                setFilteredProducts(data);

                // Check if there might be more products
                setHasMore(data.length >= pageSize);

                // Extract featured products (highest rated)
                const featured = [...data]
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 8);
                setFeaturedProducts(featured);

                // Extract on sale products
                const onSale = data.filter(p => p.onSale || (p.originalPrice && p.originalPrice > p.price));
                setOnSaleProducts(onSale);

                // Group products by category
                const byCategory = data.reduce((acc, product) => {
                    const category = product.category;
                    if (!acc[category]) {
                        acc[category] = [];
                    }
                    acc[category].push(product);
                    return acc;
                }, {});
                setProductsByCategory(byCategory);

                // Preload product images in the background
                preloadProductImages(data).catch(err =>
                    console.error('Error preloading product images:', err)
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [category, pageSize]);

    // Setup intersection observer for infinite loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                // If the "load more" element is visible and we aren't already loading
                if (entries[0].isIntersecting && !loading && !loadingMore && hasMore) {
                    handleLoadMore();
                }
            },
            { threshold: 0.5 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [loading, loadingMore, hasMore, products]);

    // Filter and sort products when any filter changes
    useEffect(() => {
        let result = [...products];

        // Filter by search term
        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by price range
        result = result.filter(
            product => product.price >= priceRange.min && product.price <= priceRange.max
        );

        // Apply sorting
        if (sortOption === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'rating') {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setFilteredProducts(result);
    }, [products, searchTerm, sortOption, priceRange]);

    // Handle search input
    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm.trim() === '') return;

        try {
            setLoading(true);
            setPage(0);
            const results = await searchProducts(searchTerm);
            setProducts(results);
            setFilteredProducts(results);

            // Reset hasMore state based on results
            setHasMore(results.length >= pageSize);

            // Preload images for search results
            preloadProductImages(results).catch(err =>
                console.error('Error preloading search result images:', err)
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle loading more products
    const handleLoadMore = async () => {
        // Don't load more if already loading or no more products
        if (loading || loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const offset = nextPage * pageSize;

            const newProducts = await fetchMoreProducts(offset, pageSize, category);

            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                setPage(nextPage);
                setProducts(prevProducts => [...prevProducts, ...newProducts]);

                // Preload new product images in the background
                preloadProductImages(newProducts).catch(err =>
                    console.error('Error preloading new product images:', err)
                );
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingMore(false);
        }
    };

    // Carousel navigation
    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const { scrollLeft, clientWidth } = carouselRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth / 2
                : scrollLeft + clientWidth / 2;

            carouselRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    // Generate skeleton loaders
    const renderSkeletons = (count = 8) => {
        return Array(count).fill().map((_, index) => (
            <div key={`skeleton-${index}`} className="bg-white rounded-lg overflow-hidden border border-gray-200 p-4">
                <Skeleton height={200} className="mb-4" />
                <Skeleton height={20} width={150} className="mb-2" />
                <Skeleton height={20} width={100} className="mb-2" />
                <Skeleton height={15} count={2} className="mb-4" />
                <div className="flex justify-between">
                    <Skeleton height={30} width={80} />
                    <Skeleton height={30} width={100} />
                </div>
            </div>
        ));
    };

    // Render section divider with title
    const SectionTitle = ({ title, icon, color = "blue" }) => (
        <div className="flex items-center mb-6 mt-12">
            <div className={`h-12 w-12 rounded-full bg-${color}-100 flex items-center justify-center mr-4`}>
                {icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <div className={`h-0.5 bg-${color}-100 flex-grow ml-6`}></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search and Filter UI */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    {/* Search form */}
                    <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search products..."
                            className="px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                        >
                            <FaSearch />
                        </button>
                    </form>

                    {/* Sort and Filter controls */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 px-4 py-2 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="">Sort By</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                            <FaSort className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                        </div>

                        <button
                            onClick={() => setFilterOpen(!filterOpen)}
                            className="bg-white border border-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <FaFilter />
                            <span>Filter</span>
                        </button>
                    </div>
                </div>

                {/* Price filter */}
                {filterOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border border-gray-200 rounded p-4 mb-4"
                    >
                        <h3 className="font-medium mb-2">Price Range</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <span className="mr-2">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                            <span>to</span>
                            <div className="flex items-center">
                                <span className="mr-2">$</span>
                                <input
                                    type="number"
                                    min={priceRange.min}
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Results count when searching/filtering */}
            {!loading && searchTerm && (
                <p className="text-gray-600 mb-4">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    {category ? ` in ${category}` : ''}
                    {searchTerm ? ` for "${searchTerm}"` : ''}
                </p>
            )}

            {/* Error message */}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">Error: {error}</div>}

            {/* Featured Products Carousel (shown only when not searching) */}
            {!loading && !searchTerm && featuredProducts.length > 0 && (
                <div className="mb-12">
                    <SectionTitle
                        title="Featured Products"
                        icon={<FaStar className="text-amber-500 text-xl" />}
                        color="amber"
                    />
                    <div className="relative">
                        <button
                            onClick={() => scrollCarousel('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg h-10 w-10 flex items-center justify-center hover:bg-gray-100"
                        >
                            <FaChevronLeft />
                        </button>

                        <div
                            ref={carouselRef}
                            className="flex overflow-x-auto gap-4 pb-4 snap-x scroll-smooth hide-scrollbar"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {featuredProducts.map(product => (
                                <div
                                    key={`featured-${product.id}`}
                                    className="min-w-[280px] snap-start"
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => scrollCarousel('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg h-10 w-10 flex items-center justify-center hover:bg-gray-100"
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            )}

            {/* On Sale Products (shown only when not searching) */}
            {!loading && !searchTerm && onSaleProducts.length > 0 && (
                <div className="mb-12">
                    <SectionTitle
                        title="Special Deals"
                        icon={<FaTags className="text-red-500 text-xl" />}
                        color="red"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {onSaleProducts.slice(0, 8).map(product => (
                            <ProductCard key={`sale-${product.id}`} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* Products by Category (shown only when not searching/filtering) */}
            {!loading && !searchTerm && !category && Object.keys(productsByCategory).length > 0 &&
                Object.entries(productsByCategory).map(([categoryName, categoryProducts]) => (
                    <div key={categoryName} className="mb-12">
                        <SectionTitle
                            title={categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
                            icon={
                                <div className="text-lg font-bold text-blue-600">
                                    {categoryName.charAt(0).toUpperCase()}
                                </div>
                            }
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryProducts.slice(0, 4).map(product => (
                                <ProductCard key={`${categoryName}-${product.id}`} product={product} />
                            ))}
                        </div>
                    </div>
                ))
            }

            {/* Regular product grid (shown when searching or filtering) */}
            {searchTerm || category ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {loading ? renderSkeletons() : (
                            filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-gray-500 text-lg">No products found. Try adjusting your filters.</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* "Load More" indicator */}
                    {filteredProducts.length > 0 && hasMore && (
                        <div
                            ref={loadMoreRef}
                            className="text-center py-8"
                        >
                            {loadingMore ? (
                                <div className="flex items-center justify-center">
                                    <FaSpinner className="animate-spin text-blue-600 mr-2" />
                                    <span className="text-blue-600">Loading more products...</span>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLoadMore}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Load More Products
                                </motion.button>
                            )}
                        </div>
                    )}
                </>
            ) : (
                // Show "Explore All Products" section
                <div className="mt-16 text-center">
                    <SectionTitle
                        title="Explore All Products"
                        icon={<FaSearch className="text-blue-500 text-xl" />}
                        color="blue"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                        {loading ? renderSkeletons(8) : (
                            products.length > 0 && products
                                .slice(0, Math.min(products.length, 16)) // Show first 16 products initially
                                .map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                        )}
                    </div>

                    {/* "Load More" indicator */}
                    {products.length > 0 && hasMore && (
                        <div
                            ref={loadMoreRef}
                            className="text-center py-8 mt-4"
                        >
                            {loadingMore ? (
                                <div className="flex items-center justify-center">
                                    <FaSpinner className="animate-spin text-blue-600 mr-2" />
                                    <span className="text-blue-600">Loading more products...</span>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLoadMore}
                                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Load More Products
                                </motion.button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductList;