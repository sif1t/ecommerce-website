/**
 * Service to fetch product images automatically from external APIs
 */

// Cache to prevent multiple requests for the same search term
const imageCache = new Map();

// Mapping of product types to specific image URLs
const productImageMapping = {
    'smartphone': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop',
    'wireless headphones': 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=300&h=300&fit=crop',
    'cotton t-shirt': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    'smart watch': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    'denim jeans': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
    'coffee maker': 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=300&h=300&fit=crop',
    'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
    'tablet': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop',
    'sweater': 'https://images.unsplash.com/photo-1580331452207-11471c63ff8d?w=300&h=300&fit=crop',
    'dress': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop',
    'sofa': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
    'dining table': 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=300&h=300&fit=crop',
    'desk lamp': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop',
    'sneakers': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop',
};

// Category to generic image mapping as fallback
const categoryImageMapping = {
    'electronics': 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&h=300&fit=crop',
    'clothing': 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=300&fit=crop',
    'home': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&h=300&fit=crop',
    'furniture': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=300&h=300&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop',
    'shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    'kitchen': 'https://images.unsplash.com/photo-1556910096-5cdda80356fc?w=300&h=300&fit=crop',
    'decor': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&h=300&fit=crop',
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