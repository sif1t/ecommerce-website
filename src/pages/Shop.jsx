import React, { useEffect, useState } from 'react';
import ProductList from '../components/Products/ProductList';
import { fetchProducts } from '../api';
import { useLocation } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchProducts();

                // Apply category filter if present in URL
                const filteredData = categoryParam
                    ? data.filter(product => product.category.toLowerCase() === categoryParam.toLowerCase())
                    : data;

                setProducts(filteredData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getProducts();
    }, [categoryParam]);

    if (loading) return <div className="container mx-auto p-4">Loading...</div>;
    if (error) return <div className="container mx-auto p-4">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                {categoryParam
                    ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Products`
                    : 'All Products'}
            </h1>
            <ProductList products={products} category={categoryParam} />
        </div>
    );
};

export default Shop;