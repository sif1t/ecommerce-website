export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const calculateTotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const isInCart = (id, cartItems) => {
    return cartItems.some(item => item.id === id);
};

export const getUniqueItems = (items) => {
    return [...new Map(items.map(item => [item.id, item])).values()];
};