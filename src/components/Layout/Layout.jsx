import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const pathname = location.pathname;

    // Only show sidebar on shop and product pages
    const showSidebar = pathname === '/shop' ||
        pathname.startsWith('/product/') ||
        pathname.includes('category');

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            {/* Add padding top to account for fixed header */}
            <div className="mt-24">
                <Navbar />
                <div className="flex flex-col md:flex-row w-full">
                    {showSidebar && (
                        <div className="md:w-1/4 lg:w-1/5 bg-gray-50">
                            <div className="sticky top-28 transition-all duration-300 px-4">
                                <Sidebar />
                            </div>
                        </div>
                    )}
                    <div className="flex-grow">
                        <div className="container mx-auto px-4 py-8">
                            <main className="w-full">
                                {children}
                            </main>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;