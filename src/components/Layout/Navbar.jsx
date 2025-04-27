import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">
                    E-Commerce
                </div>
                <div className="space-x-4">
                    <Link to="/" className="text-gray-300 hover:text-blue-300">Home</Link>
                    <Link to="/shop" className="text-gray-300 hover:text-blue-300">Shop</Link>
                    <Link to="/cart" className="text-gray-300 hover:text-blue-300">Cart</Link>
                    <Link to="/login" className="text-gray-300 hover:text-blue-300">Login</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;