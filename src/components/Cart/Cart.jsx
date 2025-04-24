import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import CartItem from './CartItem';

const Cart = () => {
    const { cartItems, totalAmount } = useContext(CartContext);

    return (
        <div className="container mx-auto my-8">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">Total: ${totalAmount.toFixed(2)}</h2>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;