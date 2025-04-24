import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import CartItem from '../components/Cart/CartItem';
import { FaShoppingCart, FaArrowLeft, FaTrash } from 'react-icons/fa';

const CartPage = () => {
    const { cartItems, totalAmount, totalItems, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    // Calculate shipping cost
    const calculateShipping = () => {
        if (totalAmount > 100) return 0; // Free shipping over $100
        if (totalItems === 0) return 0;
        return 10; // Standard shipping
    };

    // Calculate tax (example: 8%)
    const calculateTax = () => {
        return totalAmount * 0.08;
    };

    // Calculate order total
    const shipping = calculateShipping();
    const tax = calculateTax();
    const orderTotal = totalAmount + shipping + tax;

    // Empty cart component
    const EmptyCart = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 max-w-md mx-auto"
        >
            <div className="bg-gray-100 rounded-full h-32 w-32 flex items-center justify-center mx-auto mb-8">
                <FaShoppingCart className="text-gray-400" size={50} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link
                to="/shop"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
                Start Shopping
            </Link>
        </motion.div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
            <p className="text-gray-600 mb-8">
                {totalItems > 0 ? `You have ${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
            </p>

            {cartItems.length === 0 ? (
                <EmptyCart />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Cart Header */}
                            <div className="flex justify-between items-center p-4 border-b border-gray-200">
                                <h2 className="font-semibold text-lg">Cart Items</h2>
                                <button
                                    onClick={clearCart}
                                    className="text-red-500 hover:text-red-700 flex items-center text-sm"
                                >
                                    <FaTrash className="mr-1" />
                                    Clear Cart
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="divide-y divide-gray-200">
                                <AnimatePresence>
                                    {cartItems.map(item => (
                                        <CartItem
                                            key={item.id}
                                            item={item}
                                            onRemove={removeFromCart}
                                            onUpdateQuantity={updateCartItemQuantity}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Continue Shopping */}
                            <div className="p-4 border-t border-gray-200">
                                <button
                                    onClick={() => navigate('/shop')}
                                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    {shipping === 0 ? (
                                        <span className="text-green-600">Free</span>
                                    ) : (
                                        <span>${shipping.toFixed(2)}</span>
                                    )}
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Tax (8%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>

                                {totalAmount < 100 && totalAmount > 0 && (
                                    <div className="bg-blue-50 text-blue-700 p-3 rounded text-sm">
                                        Add ${(100 - totalAmount).toFixed(2)} more to get FREE shipping!
                                    </div>
                                )}

                                <div className="border-t pt-4 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>${orderTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/checkout')}
                                className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Proceed to Checkout
                            </motion.button>

                            <div className="mt-6 text-center text-sm text-gray-600">
                                <p className="mb-2">We accept</p>
                                <div className="flex justify-center space-x-2">
                                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;