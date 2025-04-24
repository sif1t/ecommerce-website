import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Initialize cart from localStorage if available
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [totalAmount, setTotalAmount] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Update localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Calculate totals
        const { itemCount, amount } = cartItems.reduce(
            (acc, item) => ({
                itemCount: acc.itemCount + item.quantity,
                amount: acc.amount + (item.price * item.quantity)
            }),
            { itemCount: 0, amount: 0 }
        );

        setTotalItems(itemCount);
        setTotalAmount(Number(amount.toFixed(2)));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            // Check if product already exists in cart
            const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                // If product exists, update its quantity
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + quantity
                };
                toast.success(`Updated ${product.name} quantity in your cart`);
                return updatedItems;
            } else {
                // If product doesn't exist, add it with the specified quantity
                toast.success(`Added ${product.name} to your cart`);
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    const removeFromCart = (productId) => {
        const item = cartItems.find(item => item.id === productId);
        if (item) {
            setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
            toast.info(`Removed ${item.name} from your cart`);
        }
    };

    const updateCartItemQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
        toast.info('Cart cleared');
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            totalAmount,
            totalItems,
            addToCart,
            removeFromCart,
            updateCartItemQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};