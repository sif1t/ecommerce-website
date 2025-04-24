import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { useHistory } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, totalAmount } = useContext(CartContext);
    const history = useHistory();

    const handleCheckout = () => {
        // Implement checkout logic here (e.g., API call)
        alert('Checkout successful!');
        history.push('/'); // Redirect to home after checkout
    };

    return (
        <div className="checkout-container p-4">
            <h2 className="text-2xl font-bold mb-4">Checkout</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <h3 className="text-xl mb-2">Order Summary</h3>
                    <ul className="mb-4">
                        {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between mb-2">
                                <span>{item.name}</span>
                                <span>${item.price}</span>
                            </li>
                        ))}
                    </ul>
                    <h4 className="font-bold">Total: ${totalAmount}</h4>
                    <button 
                        onClick={handleCheckout} 
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    >
                        Complete Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;