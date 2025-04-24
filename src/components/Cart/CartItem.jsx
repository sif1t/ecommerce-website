import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            onUpdateQuantity(item.id, newQuantity);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 gap-4"
        >
            {/* Product image and info */}
            <div className="flex items-center flex-1">
                <Link to={`/product/${item.id}`}>
                    <img
                        src={item.imageUrl || "https://via.placeholder.com/100"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md mr-4 hover:opacity-80 transition-opacity"
                    />
                </Link>
                <div>
                    <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                        <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                    </Link>
                    {item.category && (
                        <p className="text-gray-500 text-sm capitalize">{item.category}</p>
                    )}
                    <p className="text-gray-700 font-medium mt-1">${item.price.toFixed(2)}</p>
                </div>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded">
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        className="px-2 py-1 border-r border-gray-300 hover:bg-gray-100"
                    >
                        <FaMinus size={10} />
                    </button>
                    <span className="px-3 py-1 min-w-[40px] text-center">
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100"
                    >
                        <FaPlus size={10} />
                    </button>
                </div>

                {/* Item total */}
                <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                {/* Remove button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    aria-label="Remove item"
                >
                    <FaTrash />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default CartItem;