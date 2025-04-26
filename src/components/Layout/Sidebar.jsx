import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../../api';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const products = await fetchProducts();
                // Extract unique categories
                const uniqueCategories = [...new Set(products.map(product => product.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        getCategories();
    }, []);

    return (
        <div className="bg-white shadow-md rounded-lg p-4 sticky top-24">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Product Categories</h2>

            {loading ? (
                <div className="animate-pulse space-y-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="h-6 bg-gray-200 rounded w-3/4"></div>
                    ))}
                </div>
            ) : (
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/shop"
                            className="block py-2 px-3 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                        >
                            All Products
                        </Link>
                    </li>
                    {categories.map((category) => (
                        <li key={category}>
                            <Link
                                to={`/shop?category=${category}`}
                                className="block py-2 px-3 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors capitalize"
                            >
                                {category}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Sidebar;