import React from 'react';
import { Helmet } from 'react-helmet-async';
import Login from '../components/Auth/Login';
import { motion } from 'framer-motion';

const LoginPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Helmet>
                <title>Sign In | Your E-Commerce Shop</title>
                <meta name="description" content="Sign in to your account to access personalized shopping, order history, and more." />
            </Helmet>

            <Login />
        </motion.div>
    );
};

export default LoginPage;