/**
 * Service to fetch product images automatically from external APIs
 */

// Cache to prevent multiple requests for the same search term
const imageCache = new Map();

// Mapping of product types to specific image URLs
const productImageMapping = {
    'smartphone': 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=300&h=300&fit=crop',
    'wireless headphones': 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&h=300&fit=crop',
    'cotton t-shirt': 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300&h=300&fit=crop',
    'smart watch': 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=300&h=300&fit=crop',
    'denim jeans': 'https://images.unsplash.com/photo-1604176424472-9e9468137840?w=300&h=300&fit=crop',
    'coffee maker': 'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?w=300&h=300&fit=crop',
    'laptop': 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=300&h=300&fit=crop',
    'tablet': 'https://images.unsplash.com/photo-1589739900479-32410bcbgb461?w=300&h=300&fit=crop',
    'sweater': 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=300&h=300&fit=crop',
    'dress': 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=300&h=300&fit=crop',
    'sofa': 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=300&h=300&fit=crop',
    'dining table': 'https://images.unsplash.com/photo-1615066390971-3dc3e6bfd9bd?w=300&h=300&fit=crop',
    'desk lamp': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&h=300&fit=crop',
    'sneakers': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
    // Add more specific product types with high-quality images
    'headphones': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
    'bluetooth speaker': 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=300&h=300&fit=crop',
    'camera': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
    'gaming console': 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=300&h=300&fit=crop',
    'keyboard': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop',
    'mouse': 'https://images.unsplash.com/photo-1563297007-0686b7003af7?w=300&h=300&fit=crop',

    // Customer testimonial profile images
    'testimonial-sarah': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    'testimonial-michael': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    'testimonial-emily': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
};

// Category to generic image mapping as fallback
const categoryImageMapping = {
    'electronics': 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300&h=300&fit=crop',
    'clothing': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&h=300&fit=crop',
    'home': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=300&h=300&fit=crop',
    'furniture': 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=300&h=300&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1613843411478-592cd6b8e214?w=300&h=300&fit=crop',
    'shoes': 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop',
    'kitchen': 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=300&h=300&fit=crop',
    'decor': 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=300&h=300&fit=crop',
    // Add more categories with appropriate images
    'footwear': 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=300&h=300&fit=crop',
    'fitness': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    'beauty': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=300&h=300&fit=crop',
    'sports': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=300&h=300&fit=crop',
    'jewelry': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=300&fit=crop',
    'tech': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop',
    'books': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop',
    'toys': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&h=300&fit=crop',
    'outdoor': 'https://images.unsplash.com/photo-1472591651607-70e2d88ae656?w=300&h=300&fit=crop',
};

/**
 * Find the best matching product type for a given product name
 */
const findMatchingProductType = (productName) => {
    const normalizedName = productName.toLowerCase();
    // Try to find an exact match first
    const exactMatch = Object.keys(productImageMapping).find(type =>
        normalizedName === type.toLowerCase());

    if (exactMatch) return exactMatch;

    // Try to find a partial match
    return Object.keys(productImageMapping).find(type =>
        normalizedName.includes(type.toLowerCase()) ||
        type.toLowerCase().includes(normalizedName));
};

/**
 * Fetch an image for a product based on its name and category
 */
export const fetchProductImage = async (productName, category) => {
    const cacheKey = `${productName}:${category}`;

    // Check cache first
    if (imageCache.has(cacheKey)) {
        return imageCache.get(cacheKey);
    }

    // First try to match by product name against our predefined mappings
    const matchingType = findMatchingProductType(productName);
    if (matchingType && productImageMapping[matchingType]) {
        const imageUrl = productImageMapping[matchingType];
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
    }

    // If no direct product match, try to use category
    if (category && categoryImageMapping[category.toLowerCase()]) {
        const imageUrl = categoryImageMapping[category.toLowerCase()];
        imageCache.set(cacheKey, imageUrl);
        return imageUrl;
    }

    // If still no match, fall back to Unsplash API
    try {
        const searchTerm = `${productName} ${category}`.trim();
        const response = await fetch(`https://source.unsplash.com/300x300/?${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
            imageCache.set(cacheKey, response.url);
            return response.url;
        }
    } catch (error) {
        console.error('Failed to fetch image:', error);
    }

    // Ultimate fallback to Picsum with a consistent seed based on product name
    try {
        const hash = Math.abs(productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000);
        const url = `https://picsum.photos/seed/${hash}/300/300`;
        imageCache.set(cacheKey, url);
        return url;
    } catch (error) {
        console.error('Failed to fetch fallback image:', error);
        return `https://placehold.co/300x300/e2e8f0/1e293b?text=${encodeURIComponent(productName)}`;
    }
};

/**
 * Preload images for a list of products
 * This can be called when the product list loads to fetch images in advance
 */
export const preloadProductImages = async (products) => {
    if (!products || !products.length) return;

    // Process in batches to not overwhelm the browser
    const batchSize = 5;

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        await Promise.all(
            batch.map(product =>
                fetchProductImage(product.name, product.category)
                    .catch(err => console.error(`Failed to preload image for ${product.name}:`, err))
            )
        );
    }
};

/**
 * Add or update image mapping for a specific product type
 */
export const addProductImageMapping = (productType, imageUrl) => {
    productImageMapping[productType.toLowerCase()] = imageUrl;
};

/**
 * Add or update image mapping for a specific category
 */
export const addCategoryImageMapping = (category, imageUrl) => {
    categoryImageMapping[category.toLowerCase()] = imageUrl;
};