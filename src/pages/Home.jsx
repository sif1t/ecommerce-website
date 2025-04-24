import React from 'react';
import ProductList from '../components/Products/ProductList';
import Layout from '../components/Layout/Layout';

const Home = () => {
    return (
        <Layout>
            <div className="container mx-auto mt-10">
                <h1 className="text-3xl font-bold text-center">Welcome to Our E-Commerce Store</h1>
                <p className="text-center mt-4">Discover our range of products below:</p>
                <ProductList />
            </div>
        </Layout>
    );
};

export default Home;