import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            {/* Add padding top to account for fixed header */}
            <div className="mt-24">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 py-8">
                    {children}
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;