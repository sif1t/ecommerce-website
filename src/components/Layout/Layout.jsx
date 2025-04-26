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
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {showSidebar && (
                            <div className="md:w-1/4 lg:w-1/5">
                                <div className="sticky top-28 transition-all duration-300">
                                    <Sidebar />
                                </div>
                            </div>
                        )}
                        <main className={`flex-grow ${showSidebar ? 'md:w-3/4 lg:w-4/5' : 'w-full'}`}>
                            {children}
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;