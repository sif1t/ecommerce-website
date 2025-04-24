import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const addToCart = (product) => {
        setCartItems((prevItems) => [...prevItems, product]);
        setTotalAmount((prevTotal) => prevTotal + product.price);
    };

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
        const removedItem = cartItems.find(item => item.id === productId);
        if (removedItem) {
            setTotalAmount((prevTotal) => prevTotal - removedItem.price);
        }
    };

    const clearCart = () => {
        setCartItems([]);
        setTotalAmount(0);
    };

    return (
        <CartContext.Provider value={{ cartItems, totalAmount, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};