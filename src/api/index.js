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
        },
        // Beauty Products
        {
            id: 37,
            name: "Luxury Skincare Set",
            price: 89.99,
            description: "Complete skincare routine with cleanser, moisturizer, and serum",
            imageUrl: "https://via.placeholder.com/300",
            category: "beauty",
            rating: 4.7,
            stock: 12
        },
        {
            id: 38,
            name: "Professional Hair Dryer",
            price: 129.99,
            description: "Salon-quality hair dryer with multiple heat and speed settings",
            imageUrl: "https://via.placeholder.com/300",
            category: "beauty",
            rating: 4.5,
            stock: 8
        },
        {
            id: 39,
            name: "Organic Face Mask Collection",
            price: 24.99,
            description: "Set of 5 natural ingredient face masks for different skin concerns",
            imageUrl: "https://via.placeholder.com/300",
            category: "beauty",
            rating: 4.3,
            stock: 20,
            originalPrice: 34.99,
            onSale: true
        },
        {
            id: 40,
            name: "Premium Makeup Brush Set",
            price: 49.99,
            description: "12-piece professional quality makeup brush collection with case",
            imageUrl: "https://via.placeholder.com/300",
            category: "beauty",
            rating: 4.6,
            stock: 15
        },
        {
            id: 41,
            name: "Natural Perfume",
            price: 69.99,
            description: "Long-lasting fragrance with notes of jasmine and sandalwood",
            imageUrl: "https://via.placeholder.com/300",
            category: "beauty",
            rating: 4.4,
            stock: 10
        },

        // Sports Products
        {
            id: 42,
            name: "Basketball",
            price: 29.99,
            description: "Official size and weight basketball for indoor or outdoor play",
            imageUrl: "https://via.placeholder.com/300",
            category: "sports",
            rating: 4.5,
            stock: 25
        },
        {
            id: 43,
            name: "Tennis Racket Pro",
            price: 159.99,
            description: "Competition-grade tennis racket with optimal power and control",
            imageUrl: "https://via.placeholder.com/300",
            category: "sports",
            rating: 4.8,
            stock: 6
        },
        {
            id: 44,
            name: "Hiking Backpack 40L",
            price: 89.99,
            description: "Weatherproof backpack with hydration system compatibility",
            imageUrl: "https://via.placeholder.com/300",
            category: "sports",
            rating: 4.6,
            stock: 14,
            originalPrice: 119.99,
            onSale: true
        },
        {
            id: 45,
            name: "Smart Jump Rope",
            price: 24.99,
            description: "Digital jump rope that counts jumps and calories burned",
            imageUrl: "https://via.placeholder.com/300",
            category: "sports",
            rating: 4.2,
            stock: 30
        },
        {
            id: 46,
            name: "Compression Running Leggings",
            price: 44.99,
            description: "High-performance leggings with moisture-wicking technology",
            imageUrl: "https://via.placeholder.com/300",
            category: "sports",
            rating: 4.4,
            stock: 18
        },

        // Books Products
        {
            id: 47,
            name: "The Modern Cookbook",
            price: 35.99,
            description: "200+ innovative recipes for contemporary home cooking",
            imageUrl: "https://via.placeholder.com/300",
            category: "books",
            rating: 4.7,
            stock: 22
        },
        {
            id: 48,
            name: "Science Fiction Anthology",
            price: 24.99,
            description: "Collection of award-winning short stories from top sci-fi authors",
            imageUrl: "https://via.placeholder.com/300",
            category: "books",
            rating: 4.5,
            stock: 15
        },
        {
            id: 49,
            name: "Personal Finance Guide",
            price: 19.99,
            description: "Practical strategies for saving, investing, and building wealth",
            imageUrl: "https://via.placeholder.com/300",
            category: "books",
            rating: 4.6,
            stock: 28,
            originalPrice: 29.99,
            onSale: true
        },
        {
            id: 50,
            name: "Historical Biography Collection",
            price: 45.99,
            description: "Boxed set of three bestselling historical biographies",
            imageUrl: "https://via.placeholder.com/300",
            category: "books",
            rating: 4.8,
            stock: 7
        },
        {
            id: 51,
            name: "Children's Illustrated Atlas",
            price: 22.99,
            description: "Educational world atlas with vibrant illustrations for young readers",
            imageUrl: "https://via.placeholder.com/300",
            category: "books",
            rating: 4.4,
            stock: 19
        },

        // Toys Products
        {
            id: 52,
            name: "Building Blocks Set",
            price: 39.99,
            description: "250-piece creative construction set for ages 4-12",
            imageUrl: "https://via.placeholder.com/300",
            category: "toys",
            rating: 4.7,
            stock: 24
        },
        {
            id: 53,
            name: "Remote Control Car",
            price: 59.99,
            description: "High-speed RC car with all-terrain capabilities and long battery life",
            imageUrl: "https://via.placeholder.com/300",
            category: "toys",
            rating: 4.5,
            stock: 16,
            originalPrice: 79.99,
            onSale: true
        },
        {
            id: 54,
            name: "Educational Science Kit",
            price: 34.99,
            description: "Hands-on experiments to learn science concepts for ages 8+",
            imageUrl: "https://via.placeholder.com/300",
            category: "toys",
            rating: 4.6,
            stock: 13
        },
        {
            id: 55,
            name: "Plush Animal Collection",
            price: 29.99,
            description: "Set of 4 soft, huggable animal plushies for all ages",
            imageUrl: "https://via.placeholder.com/300",
            category: "toys",
            rating: 4.4,
            stock: 30
        },
        {
            id: 56,
            name: "Strategy Board Game",
            price: 44.99,
            description: "Award-winning family board game for 2-6 players",
            imageUrl: "https://via.placeholder.com/300",
            category: "toys",
            rating: 4.8,
            stock: 9
        },

        // Jewelry Products
        {
            id: 57,
            name: "Silver Pendant Necklace",
            price: 79.99,
            description: "Handcrafted sterling silver pendant on 18-inch chain",
            imageUrl: "https://via.placeholder.com/300",
            category: "jewelry",
            rating: 4.7,
            stock: 18
        },
        {
            id: 58,
            name: "Gold Hoop Earrings",
            price: 149.99,
            description: "14K gold-plated hoops with hypoallergenic posts",
            imageUrl: "https://via.placeholder.com/300",
            category: "jewelry",
            rating: 4.6,
            stock: 12,
            originalPrice: 179.99,
            onSale: true
        },
        {
            id: 59,
            name: "Gemstone Ring Set",
            price: 99.99,
            description: "Set of 3 stackable rings with different colored gemstones",
            imageUrl: "https://via.placeholder.com/300",
            category: "jewelry",
            rating: 4.5,
            stock: 10
        },
        {
            id: 60,
            name: "Men's Stainless Steel Watch",
            price: 199.99,
            description: "Modern chronograph watch with genuine leather band",
            imageUrl: "https://via.placeholder.com/300",
            category: "jewelry",
            rating: 4.8,
            stock: 7
        },
        {
            id: 61,
            name: "Pearl Bracelet",
            price: 89.99,
            description: "Elegant freshwater pearl bracelet with silver clasp",
            imageUrl: "https://via.placeholder.com/300",
            category: "jewelry",
            rating: 4.4,
            stock: 15
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

// Generate unique ID for new products
const getNextProductId = () => {
    const maxId = localData.products.reduce((max, product) => Math.max(max, product.id), 0);
    return maxId + 1;
};

// Arrays for generating random products
const productTypes = [
    { name: "Premium Headphones", category: "electronics", basePrice: 149.99, desc: "High-end wireless headphones with superior sound quality" },
    { name: "Ultra-Slim Laptop", category: "electronics", basePrice: 899.99, desc: "Powerful and lightweight laptop with all-day battery life" },
    { name: "Designer Watch", category: "accessories", basePrice: 199.99, desc: "Elegant timepiece with premium materials and water resistance" },
    { name: "Fitness Smartband", category: "electronics", basePrice: 79.99, desc: "Activity tracker with heart rate monitoring and sleep analysis" },
    { name: "Organic Cotton Sweater", category: "clothing", basePrice: 59.99, desc: "Soft, sustainable sweater perfect for everyday wear" },
    { name: "Stainless Steel Cookware Set", category: "kitchen", basePrice: 149.99, desc: "Professional-grade cooking set with non-stick coating" },
    { name: "HD Smart TV", category: "electronics", basePrice: 549.99, desc: "Crystal clear display with integrated streaming services" },
    { name: "Bluetooth Earbuds", category: "electronics", basePrice: 89.99, desc: "True wireless earbuds with active noise cancellation" },
    { name: "Leather Crossbody Bag", category: "accessories", basePrice: 129.99, desc: "Stylish and functional bag with multiple compartments" },
    { name: "Adjustable Dumbbell Set", category: "fitness", basePrice: 179.99, desc: "Space-saving weights for home workouts" },
    { name: "Ceramic Dinner Set", category: "home", basePrice: 69.99, desc: "Modern dinnerware set for everyday use or special occasions" },
    { name: "Air Purifier", category: "home", basePrice: 129.99, desc: "HEPA filter system to remove allergens and pollutants" },
    { name: "Ergonomic Desk Chair", category: "furniture", basePrice: 219.99, desc: "Comfortable office chair with adjustable features" },
    { name: "Premium Coffee Beans", category: "grocery", basePrice: 19.99, desc: "Specialty roasted coffee from sustainable sources" },
    { name: "Digital Drawing Tablet", category: "electronics", basePrice: 149.99, desc: "Precision tablet for digital artists and designers" },
    { name: "Wireless Charging Pad", category: "electronics", basePrice: 39.99, desc: "Fast-charging compatible with multiple devices" },
    { name: "Indoor Plant Collection", category: "home", basePrice: 49.99, desc: "Set of low-maintenance plants to purify your space" },
    { name: "Premium Yoga Mat", category: "fitness", basePrice: 59.99, desc: "Extra thick, eco-friendly exercise mat with alignment markings" },
    { name: "Aromatherapy Diffuser", category: "home", basePrice: 44.99, desc: "Essential oil diffuser with color-changing LED lights" },
    { name: "Smart Home Speaker", category: "electronics", basePrice: 129.99, desc: "Voice-controlled speaker with premium sound quality" }
];

const variants = ["Pro", "Elite", "Plus", "Max", "Ultra", "Premium", "Deluxe", "Limited Edition", "Classic", "Signature"];
const colors = ["Black", "White", "Silver", "Gold", "Rose Gold", "Navy", "Red", "Green", "Blue", "Purple"];
const sizes = ["Small", "Medium", "Large", "X-Large", "Compact", "Standard", "Deluxe"];

// Generate a random product
export const generateRandomProduct = () => {
    const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
    const variant = Math.random() > 0.5 ? variants[Math.floor(Math.random() * variants.length)] + " " : "";
    const color = Math.random() > 0.6 ? colors[Math.floor(Math.random() * colors.length)] + " " : "";
    const size = Math.random() > 0.7 ? sizes[Math.floor(Math.random() * sizes.length)] + " " : "";

    // Randomize price within ±20% of base price
    const priceVariation = (Math.random() * 0.4) - 0.2; // -20% to +20%
    const price = Math.round((productType.basePrice * (1 + priceVariation)) * 100) / 100;

    // About 30% of products will be on sale
    const onSale = Math.random() < 0.3;
    const originalPrice = onSale ? Math.round((price * 1.2) * 100) / 100 : null;

    // Random stock between 1-30
    const stock = Math.floor(Math.random() * 30) + 1;

    // Random rating between 3.5 and 5.0
    const rating = Math.round((3.5 + (Math.random() * 1.5)) * 10) / 10;

    return {
        id: getNextProductId(),
        name: `${color}${size}${variant}${productType.name}`,
        price,
        description: productType.desc,
        imageUrl: null, // Will be fetched by the imageService
        category: productType.category,
        rating,
        stock,
        originalPrice: onSale ? originalPrice : undefined,
        onSale
    };
};

// Generate multiple random products at once
export const generateRandomProducts = (count = 10) => {
    const newProducts = [];
    for (let i = 0; i < count; i++) {
        newProducts.push(generateRandomProduct());
    }
    return newProducts;
};

// Add generated products to local data
export const addGeneratedProductsToLocalData = (count = 10) => {
    const newProducts = generateRandomProducts(count);
    localData.products = [...localData.products, ...newProducts];
    return newProducts;
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

// Fetch more products (for pagination or "load more" feature)
export const fetchMoreProducts = async (offset = 0, limit = 10, category = null) => {
    try {
        const response = await api.get('/products', {
            params: {
                _start: offset,
                _limit: limit,
                ...(category && { category })
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching more products:', error);

        // Generate new products if we've exhausted the local data
        if (offset >= localData.products.length) {
            const newProducts = addGeneratedProductsToLocalData(limit);

            if (category) {
                return newProducts.filter(p => p.category === category);
            }

            return newProducts;
        }

        // Otherwise return a slice of existing local data
        let products = localData.products;
        if (category) {
            products = products.filter(p => p.category === category);
        }

        return products.slice(offset, offset + limit);
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