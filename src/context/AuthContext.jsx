import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUser, loginUser, registerUser, logoutUser } from '../api';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Check for auth token in localStorage
                const token = localStorage.getItem('authToken');

                if (token) {
                    const currentUser = await getUser();
                    setUser(currentUser);
                }
            } catch (err) {
                console.error('Authentication error:', err);
                // Clear invalid token
                localStorage.removeItem('authToken');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);
            const { user: loggedInUser, token } = await loginUser(credentials);

            // Store token for persistent login
            localStorage.setItem('authToken', token);
            setUser(loggedInUser);
            toast.success(`Welcome back, ${loggedInUser.name || 'User'}!`);
            return true;
        } catch (err) {
            setError(err.message || 'Failed to login');
            toast.error(err.message || 'Invalid credentials');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);
            const { user: newUser, token } = await registerUser(userData);

            // Store token for persistent login
            localStorage.setItem('authToken', token);
            setUser(newUser);
            toast.success('Registration successful!');
            return true;
        } catch (err) {
            setError(err.message || 'Failed to register');
            toast.error(err.message || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem('authToken');
            setUser(null);
            toast.info('You have been logged out');
        } catch (err) {
            console.error('Logout error:', err);
            // Force logout on client side even if API fails
            localStorage.removeItem('authToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            isAuthenticated: !!user,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);