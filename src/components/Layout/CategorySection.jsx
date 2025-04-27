import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = () => {
    const categories = [
        {
            name: 'Electronics',
            description: 'Latest gadgets and tech',
            image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300&h=300&fit=crop',
            slug: 'electronics'
        },
        {
            name: 'Clothing',
            description: 'Fashion and apparel',
            image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&h=300&fit=crop',
            slug: 'clothing'
        },
        {
            name: 'Home',
            description: 'Furniture and decor',
            image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=300&h=300&fit=crop',
            slug: 'home'
        },
        {
            name: 'Beauty',
            description: 'Skincare and cosmetics',
            image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300&h=300&fit=crop',
            slug: 'beauty'
        },
        {
            name: 'Sports',
            description: 'Athletic gear and equipment',
            image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&h=300&fit=crop',
            slug: 'sports'
        },
        {
            name: 'Books',
            description: 'Fiction and non-fiction titles',
            image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=300&fit=crop',
            slug: 'books'
        },
        {
            name: 'Toys',
            description: 'Games and entertainment',
            image: 'https://images.unsplash.com/photo-1599751449628-8da1da7433a5?w=300&h=300&fit=crop',
            slug: 'toys'
        },
        {
            name: 'Jewelry',
            description: 'Watches and accessories',
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=300&fit=crop',
            slug: 'jewelry'
        }
    ];

    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.slug}
                            className="relative overflow-hidden rounded-lg group shadow-md hover:shadow-xl transition-shadow"
                            style={{
                                background: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4)), url(${category.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '240px'
                            }}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-0"
                            />

                            <div className="absolute inset-0 flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                                <p className="text-gray-100 mb-4">{category.description}</p>
                                <Link
                                    to={`/shop?category=${category.slug}`}
                                    className="text-blue-300 hover:text-blue-100 inline-flex items-center transition-colors"
                                >
                                    Shop Now <span className="ml-1">→</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySection;