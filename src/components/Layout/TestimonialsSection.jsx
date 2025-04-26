import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const TestimonialsSection = () => {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            image: "testimonial-sarah",
            text: "I've been shopping here for years and the quality of products never disappoints. Fast shipping and great customer service!"
        },
        {
            id: 2,
            name: "Michael Wilson",
            image: "testimonial-michael",
            text: "The checkout process was seamless and my order arrived earlier than expected. Definitely my go-to online store now!"
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            image: "testimonial-emily",
            text: "Great selection of products at competitive prices. The customer support team was extremely helpful when I had questions!"
        }
    ];

    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">What Our Customers Say</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <motion.div
                            key={testimonial.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <div className="flex items-center mb-4">
                                <div className="mr-4">
                                    <img
                                        src={`/images/testimonials/${testimonial.name.toLowerCase().replace(' ', '-')}.jpg`}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            // Use the cached testimonial images from imageService
                                            e.target.src = `https://images.unsplash.com/photo-${testimonial.image === 'testimonial-michael' ?
                                                '1507003211169-0a1dd7228f2d' :
                                                '1494790108377-be9c29b29330'}?w=100&h=100&fit=crop`;
                                        }}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600">"{testimonial.text}"</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;