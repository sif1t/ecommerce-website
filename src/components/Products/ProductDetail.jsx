import React from 'react';

const ProductDetail = ({ product }) => {
    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto" />
            <p className="mt-2 text-lg">{product.description}</p>
            <p className="mt-4 text-xl font-semibold">${product.price}</p>
            <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                Add to Cart
            </button>
        </div>
    );
};

export default ProductDetail;