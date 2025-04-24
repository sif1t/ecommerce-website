import axios from 'axios';

// Update this URL to your actual backend API endpoint
const API_URL = 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for authentication
api.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Import local data as fallback
const localData = {
    products: [
        {
            id: 1,
            name: "Smartphone X",
            price: 699.99,
            description: "Latest generation smartphone with advanced camera system",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.5,
            stock: 15
        },
        {
            id: 2,
            name: "Wireless Headphones",
            price: 149.99,
            description: "Premium wireless headphones with noise cancellation",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.2,
            stock: 8
        },
        {
            id: 3,
            name: "Cotton T-shirt",
            price: 19.99,
            description: "Comfortable cotton t-shirt, available in various colors",
            imageUrl: "https://via.placeholder.com/300",
            category: "clothing",
            rating: 4.0,
            stock: 25
        },
        {
            id: 4,
            name: "Smart Watch",
            price: 249.99,
            description: "Fitness tracking and notifications on your wrist",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.3,
            stock: 10
        },
        {
            id: 5,
            name: "Denim Jeans",
            price: 49.99,
            description: "Classic denim jeans with modern fit",
            imageUrl: "https://via.placeholder.com/300",
            category: "clothing",
            rating: 4.1,
            stock: 20
        },
        {
            id: 6,
            name: "Coffee Maker",
            price: 89.99,
            description: "Programmable coffee maker for the perfect cup",
            imageUrl: "https://via.placeholder.com/300",
            category: "home",
            rating: 4.4,
            stock: 7
        }
    ],
    users: [
        {
            id: 1,
            name: "Test User",
            email: "test@example.com",
            password: "password123"
        }
    ]
};

// Product API functions
export const fetchProducts = async (category = null) => {
    try {
        const response = await api.get('/products', {
            params: category ? { category } : {}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        console.log('Using local product data as fallback');

        // Filter by category if specified
        if (category) {
            return localData.products.filter(p => p.category === category);
        }

        return localData.products;
    }
};

export const fetchProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        // Return local product with matching id
        const product = localData.products.find(p => p.id === Number(id));
        if (product) return product;
        throw new Error('Product not found');
    }
};

export const searchProducts = async (query) => {
    try {
        const response = await api.get(`/products/search`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        // Search local data
        const results = localData.products.filter(
            p => p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.description.toLowerCase().includes(query.toLowerCase())
        );
        return results;
    }
};

// Auth API functions
export const getUser = async () => {
    try {
        const response = await api.get('/auth/user');
        return response.data;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);

        // For demo purposes only - mock successful login if API fails
        if (process.env.NODE_ENV === 'development') {
            // Check against local user data
            const user = localData.users.find(
                u => u.email === credentials.email && u.password === credentials.password
            );

            if (user) {
                const { password, ...userWithoutPassword } = user;
                return {
                    user: userWithoutPassword,
                    token: "mock-jwt-token-for-development"
                };
            }
        }

        throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);

        // For demo purposes only - mock successful registration if API fails
        if (process.env.NODE_ENV === 'development') {
            const newUser = {
                id: localData.users.length + 1,
                ...userData
            };
            const { password, ...userWithoutPassword } = newUser;

            return {
                user: userWithoutPassword,
                token: "mock-jwt-token-for-development"
            };
        }

        throw new Error(error.response?.data?.message || 'Registration failed');
    }
};

export const logoutUser = async () => {
    try {
        const response = await api.post('/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Error during logout:', error);
        // For client-side logout, just resolve anyway
        return { success: true };
    }
};

// Cart API functions - no local storage here as we're using CartContext instead
export const fetchCartItems = async () => {
    try {
        const response = await api.get('/cart');
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        // Return empty array as CartContext will handle local storage
        return [];
    }
};

export const addItemToCart = async (productId, quantity) => {
    try {
        const response = await api.post('/cart', { productId, quantity });
        return response.data;
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw new Error('Failed to add item to cart');
    }
};

export const updateCartItem = async (itemId, quantity) => {
    try {
        const response = await api.put(`/cart/${itemId}`, { quantity });
        return response.data;
    } catch (error) {
        console.error('Error updating cart item:', error);
        throw new Error('Failed to update cart item');
    }
};

export const removeCartItem = async (itemId) => {
    try {
        const response = await api.delete(`/cart/${itemId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw new Error('Failed to remove cart item');
    }
};

// Order API functions
export const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw new Error('Failed to create order');
    }
};

export const fetchOrders = async () => {
    try {
        const response = await api.get('/orders');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
};

export const fetchOrderById = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order with ID ${orderId}:`, error);
        throw new Error('Order not found');
    }
};