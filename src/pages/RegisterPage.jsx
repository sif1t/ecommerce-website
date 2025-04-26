import React from 'react';
import { Helmet } from 'react-helmet-async';
import Register from '../components/Auth/Register';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Helmet>
                <title>Create Account | Your E-Commerce Shop</title>
                <meta name="description" content="Join our community and create your account to enjoy exclusive deals, faster checkout, and order tracking." />
            </Helmet>
            
            <Register />
        </motion.div>
    );
};

export default RegisterPage;