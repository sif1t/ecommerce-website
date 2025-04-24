/**
 * Service to fetch product images automatically from external APIs
 */

// Cache to prevent multiple requests for the same search term
const imageCache = new Map();

/**
 * Fetch an image from Unsplash API based on search term
 * Note: In a real application, you would need to register for an API key
 * This is a simplified implementation that uses public APIs with limitations
 */
export const fetchProductImage = async (productName, category) => {
    const searchTerm = `${productName} ${category}`.trim();

    // Check cache first
    if (imageCache.has(searchTerm)) {
        return imageCache.get(searchTerm);
    }

    // Attempt to get an image from Unsplash public API
    // Note: This is rate-limited and should be replaced with a proper API key in production
    try {
        const response = await fetch(`https://source.unsplash.com/300x300/?${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
            // Store the URL in cache
            imageCache.set(searchTerm, response.url);
            return response.url;
        }
    } catch (error) {
        console.error('Failed to fetch image:', error);
    }

    // Fallback to Picsum if Unsplash fails
    try {
        // Use product name hash to get consistent image for the same product
        const hash = Math.abs(productName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000);
        const url = `https://picsum.photos/seed/${hash}/300/300`;
        imageCache.set(searchTerm, url);
        return url;
    } catch (error) {
        console.error('Failed to fetch fallback image:', error);
        return null;
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