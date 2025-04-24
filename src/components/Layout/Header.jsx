import React from 'react';

const Header = () => {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">E-Commerce Website</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:underline">Home</a></li>
                        <li><a href="/shop" className="hover:underline">Shop</a></li>
                        <li><a href="/cart" className="hover:underline">Cart</a></li>
                        <li><a href="/login" className="hover:underline">Login</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;