import React, { useEffect } from 'react';
import Login from '../components/Auth/Login';
import { motion } from 'framer-motion';

const LoginPage = () => {
    useEffect(() => {
        // Set the document title
        document.title = 'Sign In | Your E-Commerce Shop';

        // Add meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = 'Sign in to your account to access personalized shopping, order history, and more.';
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Login />
        </motion.div>
    );
};

export default LoginPage;