import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Checkout from '../components/Cart/Checkout';

const CheckoutPage = () => {
    const { cartItems, totalAmount } = useContext(CartContext);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty. Please add items to your cart before checking out.</p>
            ) : (
                <div>
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    <ul className="mb-4">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between mb-2">
                                <span>{item.name}</span>
                                <span>${item.price.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <Checkout />
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;