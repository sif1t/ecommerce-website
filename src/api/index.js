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
        },
        {
            id: 7,
            name: "Ergonomic Office Chair",
            price: 199.99,
            description: "Comfortable chair with lumbar support for long working hours",
            imageUrl: "https://via.placeholder.com/300",
            category: "furniture",
            rating: 4.7,
            stock: 5,
            originalPrice: 249.99,
            onSale: true
        },
        {
            id: 8,
            name: "Bluetooth Speaker",
            price: 79.99,
            description: "Waterproof portable speaker with 24-hour battery life",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.4,
            stock: 12
        },
        {
            id: 9,
            name: "Yoga Mat",
            price: 29.99,
            description: "Non-slip exercise mat for yoga and home workouts",
            imageUrl: "https://via.placeholder.com/300",
            category: "fitness",
            rating: 4.3,
            stock: 18
        },
        {
            id: 10,
            name: "Stainless Steel Water Bottle",
            price: 24.99,
            description: "Insulated bottle that keeps drinks cold for 24 hours",
            imageUrl: "https://via.placeholder.com/300",
            category: "lifestyle",
            rating: 4.6,
            stock: 30
        },
        {
            id: 11,
            name: "Leather Wallet",
            price: 39.99,
            description: "Classic bifold wallet with RFID protection",
            imageUrl: "https://via.placeholder.com/300",
            category: "accessories",
            rating: 4.2,
            stock: 15
        },
        {
            id: 12,
            name: "Mechanical Keyboard",
            price: 129.99,
            description: "RGB gaming keyboard with tactile mechanical switches",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.8,
            stock: 7,
            originalPrice: 159.99,
            onSale: true
        },
        {
            id: 13,
            name: "Ceramic Plant Pot",
            price: 19.99,
            description: "Minimalist design pot perfect for indoor plants",
            imageUrl: "https://via.placeholder.com/300",
            category: "home",
            rating: 4.0,
            stock: 22
        },
        {
            id: 14,
            name: "Running Shoes",
            price: 89.99,
            description: "Lightweight athletic shoes with cushioned support",
            imageUrl: "https://via.placeholder.com/300",
            category: "footwear",
            rating: 4.5,
            stock: 9
        },
        {
            id: 15,
            name: "Digital Camera",
            price: 499.99,
            description: "Mirrorless camera with 4K video recording",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.7,
            stock: 3
        },
        {
            id: 16,
            name: "Scented Candle Set",
            price: 34.99,
            description: "Set of 3 aromatherapy candles for relaxation",
            imageUrl: "https://via.placeholder.com/300",
            category: "home",
            rating: 4.4,
            stock: 14
        },
        {
            id: 17,
            name: "Backpack",
            price: 59.99,
            description: "Water-resistant backpack with laptop compartment",
            imageUrl: "https://via.placeholder.com/300",
            category: "accessories",
            rating: 4.3,
            stock: 11,
            originalPrice: 79.99,
            onSale: true
        },
        {
            id: 18,
            name: "Smart Light Bulbs",
            price: 44.99,
            description: "Set of 2 WiFi-enabled color changing bulbs",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.1,
            stock: 16
        },
        {
            id: 19,
            name: "Cutting Board",
            price: 27.99,
            description: "Bamboo cutting board with juice groove",
            imageUrl: "https://via.placeholder.com/300",
            category: "kitchen",
            rating: 4.2,
            stock: 20
        },
        {
            id: 20,
            name: "Wireless Mouse",
            price: 39.99,
            description: "Ergonomic rechargeable mouse with silent clicks",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.4,
            stock: 13
        },
        {
            id: 21,
            name: "Throw Blanket",
            price: 49.99,
            description: "Soft knitted blanket for couch or bed",
            imageUrl: "https://via.placeholder.com/300",
            category: "home",
            rating: 4.6,
            stock: 8
        },
        {
            id: 22,
            name: "Sunglasses",
            price: 79.99,
            description: "UV protection sunglasses with polarized lenses",
            imageUrl: "https://via.placeholder.com/300",
            category: "accessories",
            rating: 4.3,
            stock: 17,
            originalPrice: 99.99,
            onSale: true
        },
        {
            id: 23,
            name: "Portable Charger",
            price: 49.99,
            description: "20000mAh power bank with fast charging",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.5,
            stock: 15
        },
        {
            id: 24,
            name: "Fitness Tracker",
            price: 89.99,
            description: "Water-resistant tracker with heart rate monitoring",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.2,
            stock: 6
        },
        {
            id: 25,
            name: "Kitchen Knife Set",
            price: 119.99,
            description: "Professional 5-piece stainless steel knife set",
            imageUrl: "https://via.placeholder.com/300",
            category: "kitchen",
            rating: 4.7,
            stock: 4
        },
        {
            id: 26,
            name: "Wall Art Print",
            price: 29.99,
            description: "Modern abstract art print for home decoration",
            imageUrl: "https://via.placeholder.com/300",
            category: "decor",
            rating: 4.0,
            stock: 23
        },
        {
            id: 27,
            name: "Desk Lamp",
            price: 34.99,
            description: "Adjustable LED desk lamp with touch control",
            imageUrl: "https://via.placeholder.com/300",
            category: "home",
            rating: 4.4,
            stock: 10
        },
        {
            id: 28,
            name: "Tablet",
            price: 349.99,
            description: "10-inch HD display with 64GB storage",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.6,
            stock: 7,
            originalPrice: 399.99,
            onSale: true
        },
        {
            id: 29,
            name: "Indoor Plant",
            price: 24.99,
            description: "Low-maintenance succulent plant in decorative pot",
            imageUrl: "https://via.placeholder.com/300",
            category: "home",
            rating: 4.3,
            stock: 14
        },
        {
            id: 30,
            name: "Wireless Earbuds",
            price: 129.99,
            description: "True wireless earbuds with active noise cancellation",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.7,
            stock: 9
        },
        {
            id: 31,
            name: "Food Processor",
            price: 79.99,
            description: "Multi-function kitchen appliance for chopping and blending",
            imageUrl: "https://via.placeholder.com/300",
            category: "kitchen",
            rating: 4.2,
            stock: 5
        },
        {
            id: 32,
            name: "Resistance Bands",
            price: 19.99,
            description: "Set of 5 exercise bands with different resistance levels",
            imageUrl: "https://via.placeholder.com/300",
            category: "fitness",
            rating: 4.4,
            stock: 25
        },
        {
            id: 33,
            name: "Gaming Console",
            price: 499.99,
            description: "Next-generation gaming system with 1TB storage",
            imageUrl: "https://via.placeholder.com/300",
            category: "electronics",
            rating: 4.9,
            stock: 2,
            originalPrice: 549.99,
            onSale: true
        },
        {
            id: 34,
            name: "Leather Belt",
            price: 29.99,
            description: "Genuine leather belt with classic buckle",
            imageUrl: "https://via.placeholder.com/300",
            category: "accessories",
            rating: 4.1,
            stock: 18
        },
        {
            id: 35,
            name: "Storage Containers",
            price: 24.99,
            description: "Set of 5 stackable containers with airtight lids",
            imageUrl: "https://via.placeholder.com/300",
            category: "kitchen",
            rating: 4.3,
            stock: 13
        },
        {
            id: 36,
            name: "Dumbbell Set",
            price: 119.99,
            description: "Adjustable weights for home strength training",
            imageUrl: "https://via.placeholder.com/300",
            category: "fitness",
            rating: 4.6,
            stock: 4
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