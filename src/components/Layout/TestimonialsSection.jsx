import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
    {
        id: 1,
        name: 'Emily Johnson',
        role: 'Regular Customer',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 5,
        text: 'The quality of the products exceeded my expectations. The customer service team was incredibly helpful when I needed assistance with my order. Will definitely shop here again!',
        date: 'April 15, 2025'
    },
    {
        id: 2,
        name: 'Michael Chen',
        role: 'Verified Buyer',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 5,
        text: 'Fast shipping and the products are exactly as described. The website made it easy to find exactly what I was looking for. The packaging was also eco-friendly which I appreciate.',
        date: 'March 28, 2025'
    },
    {
        id: 3,
        name: 'Sophia Martinez',
        role: 'Fashion Enthusiast',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 4,
        text: "I've been shopping here for over a year now and have always had great experiences. The product selection is trendy and the website is so intuitive to navigate.",
        date: 'April 2, 2025'
    },
    {
        id: 4,
        name: 'David Wilson',
        role: 'Tech Professional',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 5,
        text: "The tech products here are top-notch. I especially love how detailed the product descriptions are. Makes online shopping much more reliable when you know exactly what you're getting.",
        date: 'April 10, 2025'
    },
    {
        id: 5,
        name: 'Olivia Taylor',
        role: 'Interior Designer',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        rating: 5,
        text: "The home decor items are simply gorgeous! Everything arrived carefully packaged and in perfect condition. I'll definitely be recommending this shop to my clients.",
        date: 'March 15, 2025'
    }
];

const TestimonialsSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(true);

    // Auto-advance testimonials
    useEffect(() => {
        if (!autoplay) return;

        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 6000);

        return () => clearInterval(interval);
    }, [autoplay]);

    // Pause autoplay on hover
    const handleMouseEnter = () => setAutoplay(false);
    const handleMouseLeave = () => setAutoplay(true);

    // Function to render star rating
    const renderRating = (rating) => {
        return Array(5).fill(0).map((_, i) => (
            <FaStar
                key={i}
                className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            />
        ));
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
                <p className="text-lg text-gray-600">Don't just take our word for it - hear from our satisfied customers</p>
            </div>

            <div
                className="relative max-w-5xl mx-auto"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="relative overflow-hidden">
                    <div className="flex items-center justify-center">
                        {/* Main testimonial */}
                        <motion.div
                            key={testimonials[activeIndex].id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
                        >
                            <div className="relative z-10">
                                <div className="absolute -top-2 -left-2">
                                    <FaQuoteLeft size={32} className="text-blue-100" />
                                </div>

                                <div className="flex flex-col md:flex-row items-center mb-6">
                                    <div className="mb-4 md:mb-0 md:mr-6">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                            <img
                                                src={testimonials[activeIndex].image}
                                                alt={testimonials[activeIndex].name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="text-center md:text-left">
                                        <h3 className="text-xl font-bold text-gray-900">{testimonials[activeIndex].name}</h3>
                                        <p className="text-blue-600">{testimonials[activeIndex].role}</p>
                                        <div className="flex mt-1 justify-center md:justify-start">
                                            {renderRating(testimonials[activeIndex].rating)}
                                        </div>
                                    </div>
                                </div>

                                <blockquote>
                                    <p className="text-lg md:text-xl text-gray-700 italic mb-4 leading-relaxed">"{testimonials[activeIndex].text}"</p>
                                    <p className="text-sm text-gray-500">{testimonials[activeIndex].date}</p>
                                </blockquote>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Testimonial navigation */}
                <div className="mt-8 flex justify-center">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`mx-2 rounded-full transition-all duration-300 ${activeIndex === index
                                ? 'w-10 h-2.5 bg-blue-600'
                                : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                                }`}
                            aria-label={`View testimonial ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Decorative elements */}
                <div className="hidden lg:block absolute top-1/4 -left-16 w-32 h-32 rounded-full bg-blue-100 opacity-70"></div>
                <div className="hidden lg:block absolute bottom-1/4 -right-16 w-32 h-32 rounded-full bg-blue-100 opacity-70"></div>
            </div>

            {/* Mini testimonial cards */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.slice(0, 3).map((item, index) => (
                    <motion.div
                        key={`mini-${item.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true, margin: "-50px" }}
                        className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-start mb-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <div className="flex mt-1">
                                    {renderRating(item.rating)}
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-3">"{item.text}"</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialsSection;