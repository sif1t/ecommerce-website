import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/Cart/CartItem';
import Checkout from '../components/Cart/Checkout';

const CartPage = () => {
    const { cartItems, totalAmount } = useContext(CartContext);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items mb-4">
                        {cartItems.map(item => (
                            <CartItem key={item.id} item={item} />
                        ))}
                    </div>
                    <div className="total-amount mb-4">
                        <h2 className="text-xl font-semibold">Total: ${totalAmount.toFixed(2)}</h2>
                    </div>
                    <Checkout />
                </>
            )}
        </div>
    );
};

export default CartPage;