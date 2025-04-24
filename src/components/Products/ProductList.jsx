import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { fetchProducts, searchProducts } from '../../api';
import ProductCard from './ProductCard';
import { FaSearch, FaSort, FaFilter } from 'react-icons/fa';
import { preloadProductImages } from '../../api/imageService';

const ProductList = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [filterOpen, setFilterOpen] = useState(false);

    // Fetch products
    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                const data = await fetchProducts(category);
                setProducts(data);
                setFilteredProducts(data);

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
    }, [category]);

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
            const results = await searchProducts(searchTerm);
            setProducts(results);
            setFilteredProducts(results);

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

    // Generate skeleton loaders
    const renderSkeletons = () => {
        return Array(8).fill().map((_, index) => (
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

            {/* Results count */}
            {!loading && (
                <p className="text-gray-600 mb-4">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    {category ? ` in ${category}` : ''}
                    {searchTerm ? ` for "${searchTerm}"` : ''}
                </p>
            )}

            {/* Error message */}
            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">Error: {error}</div>}

            {/* Product grid */}
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
        </div>
    );
};

export default ProductList;