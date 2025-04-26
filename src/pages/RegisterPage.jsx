import React, { useEffect } from 'react';
import Register from '../components/Auth/Register';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    useEffect(() => {
        // Set the document title
        document.title = 'Create Account | Your E-Commerce Shop';

        // Add meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = 'Join our community and create your account to enjoy exclusive deals, faster checkout, and order tracking.';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Register />
        </motion.div>
    );
};

export default RegisterPage;