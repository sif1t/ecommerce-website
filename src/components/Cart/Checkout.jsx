import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../api';
import { fetchProductImage } from '../../api/imageService';
import { FaLock, FaCheck, FaCreditCard, FaUser, FaTruck } from 'react-icons/fa';

const Checkout = () => {
    const { cartItems, totalAmount, totalItems, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        // Shipping information
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',

        // Payment information
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvc: '',
        saveCard: false,

        // Additional information
        orderNotes: '',
        saveInfo: true
    });

    // State to store processed images
    const [itemImages, setItemImages] = useState({});

    // Fetch product images when cart items change
    useEffect(() => {
        const loadImages = async () => {
            const imagePromises = cartItems.map(async (item) => {
                // Skip if already has image or if already fetching
                if (item.imageUrl || itemImages[item.id]) return { id: item.id, image: item.imageUrl };

                try {
                    const imageUrl = await fetchProductImage(item.name, item.category);
                    return { id: item.id, image: imageUrl };
                } catch (error) {
                    console.error(`Error loading image for ${item.name}:`, error);
                    return {
                        id: item.id,
                        image: `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`
                    };
                }
            });

            const results = await Promise.all(imagePromises);

            // Create a map of item id to image URL
            const newImages = results.reduce((acc, { id, image }) => {
                if (image) acc[id] = image;
                return acc;
            }, {});

            setItemImages(prevImages => ({ ...prevImages, ...newImages }));
        };

        loadImages();
    }, [cartItems]);

    // Calculate additional costs
    const calculateShipping = () => {
        if (totalAmount > 100) return 0; // Free shipping over $100
        if (totalItems === 0) return 0;
        return 10; // Standard shipping
    };

    const calculateTax = () => {
        return totalAmount * 0.08;
    };

    const shipping = calculateShipping();
    const tax = calculateTax();
    const orderTotal = totalAmount + shipping + tax;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (step < 3) {
            setStep(step + 1);
            return;
        }

        // Process order
        try {
            setLoading(true);

            const orderData = {
                items: cartItems,
                subtotal: totalAmount,
                shipping,
                tax,
                total: orderTotal,
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone
                },
                shippingAddress: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country
                },
                paymentMethod: 'credit_card',
                orderNotes: formData.orderNotes
            };

            // Call API to create order
            await createOrder(orderData);

            // Clear cart and show confirmation
            clearCart();
            setOrderComplete(true);

        } catch (error) {
            console.error('Error creating order:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const goToStep = (newStep) => {
        if (newStep < step) {
            setStep(newStep);
        }
    };

    // Get image URL for an item, using our cached images if available
    const getItemImage = (item) => {
        if (item.imageUrl) return item.imageUrl;
        if (itemImages[item.id]) return itemImages[item.id];
        return `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`;
    };

    // If order is complete, show confirmation
    if (orderComplete) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto py-16 px-4 text-center"
            >
                <div className="bg-green-100 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
                    <FaCheck className="text-green-500" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h2>
                <p className="text-gray-700 mb-8">
                    Your order has been received and is now being processed.
                    You will receive an email confirmation shortly.
                </p>
                <p className="text-gray-600 mb-8">
                    Order number: <span className="font-semibold">ORD-{Math.floor(Math.random() * 100000)}</span>
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition"
                >
                    Continue Shopping
                </button>
            </motion.div>
        );
    }

    // Step indicators component
    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            <div
                onClick={() => goToStep(1)}
                className={`flex flex-col items-center ${step >= 1 ? 'cursor-pointer' : ''}`}
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${step > 1 ? 'bg-green-500 text-white' : step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > 1 ? <FaCheck /> : <FaUser />}
                </div>
                <div className={`text-sm ${step === 1 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Shipping</div>
            </div>

            <div className={`w-16 h-1 ${step > 1 ? 'bg-green-500' : 'bg-gray-200'} mx-2`} />

            <div
                onClick={() => goToStep(2)}
                className={`flex flex-col items-center ${step >= 2 ? 'cursor-pointer' : ''}`}
            >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${step > 2 ? 'bg-green-500 text-white' : step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > 2 ? <FaCheck /> : <FaCreditCard />}
                </div>
                <div className={`text-sm ${step === 2 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Payment</div>
            </div>

            <div className={`w-16 h-1 ${step > 2 ? 'bg-green-500' : 'bg-gray-200'} mx-2`} />

            <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                    ${step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <FaTruck />
                </div>
                <div className={`text-sm ${step === 3 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>Confirm</div>
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto">
            <StepIndicator />

            <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="shipping"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email*
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone*
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Address*
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="col-span-2">
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        City*
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                        State*
                                    </label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                        ZIP Code*
                                    </label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center mb-6">
                                <input
                                    type="checkbox"
                                    id="saveInfo"
                                    name="saveInfo"
                                    checked={formData.saveInfo}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-700">
                                    Save this information for next time
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="payment"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

                            <div className="mb-6">
                                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name on Card*
                                </label>
                                <input
                                    type="text"
                                    id="cardName"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Card Number*
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleChange}
                                        required
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                                        Expiration Date*
                                    </label>
                                    <input
                                        type="text"
                                        id="cardExpiry"
                                        name="cardExpiry"
                                        value={formData.cardExpiry}
                                        onChange={handleChange}
                                        required
                                        placeholder="MM/YY"
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                                        CVC/CVV*
                                    </label>
                                    <input
                                        type="text"
                                        id="cardCvc"
                                        name="cardCvc"
                                        value={formData.cardCvc}
                                        onChange={handleChange}
                                        required
                                        placeholder="123"
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center mb-6">
                                <input
                                    type="checkbox"
                                    id="saveCard"
                                    name="saveCard"
                                    checked={formData.saveCard}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                                    Save this card for future purchases
                                </label>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-md mb-6">
                                <div className="flex items-center">
                                    <FaLock className="text-gray-500 mr-2" />
                                    <p className="text-sm text-gray-600">
                                        Your payment information is secure. We use encryption to protect your data.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-blue-600 py-2 px-4 hover:text-blue-800 transition"
                                >
                                    Back to Shipping
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Review Order
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="confirm"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {cartItems.map(item => (
                                        <div key={item.id} className="flex justify-between py-3 border-b border-gray-100">
                                            <div className="flex items-center">
                                                <img
                                                    src={getItemImage(item)}
                                                    alt={item.name}
                                                    className="w-16 h-16 object-cover rounded-md mr-4"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://placehold.co/100x100/e2e8f0/1e293b?text=${encodeURIComponent(item.name)}`;
                                                    }}
                                                />
                                                <div>
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 border-t pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>${totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping</span>
                                        {shipping === 0 ? (
                                            <span className="text-green-500">Free</span>
                                        ) : (
                                            <span>${shipping.toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tax (8%)</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                                        <span>Total</span>
                                        <span>${orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information Summary */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Shipping Information</h3>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <p className="text-gray-700">{formData.firstName} {formData.lastName}</p>
                                <p className="text-gray-700">{formData.address}</p>
                                <p className="text-gray-700">{formData.city}, {formData.state} {formData.zipCode}</p>
                                <p className="text-gray-700">{formData.email}</p>
                                <p className="text-gray-700">{formData.phone}</p>
                            </div>

                            {/* Payment Method Summary */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Payment Method</h3>
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <FaCreditCard className="text-gray-500 mr-2" />
                                    <span className="text-gray-700">
                                        Credit Card ending in {formData.cardNumber.slice(-4)}
                                    </span>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <h3 className="font-semibold mb-3">Order Notes (Optional)</h3>
                                <textarea
                                    name="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleChange}
                                    placeholder="Add any special instructions for delivery or other requests"
                                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="text-blue-600 py-2 px-4 hover:text-blue-800 transition"
                                >
                                    Back to Payment
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`${loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'} 
                                        text-white py-3 px-8 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
};

export default Checkout;