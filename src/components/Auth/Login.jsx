import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { countryCodes, popularCountryCodes } from '../../utils/countryCodes'; // Import country codes

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        phoneNumber: '',
        countryCode: '+1'
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [errors, setErrors] = useState({});
    const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'

    const recaptchaContainerRef = useRef(null);
    const recaptchaVerifierRef = useRef(null);

    const { login, signInWithGoogle, signInWithPhone, setupRecaptcha } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { email, password, phoneNumber, countryCode } = formData;

    // Get redirect path from location state or default to home page
    const from = location.state?.from?.pathname || '/';

    // Setup recaptcha when component mounts
    useEffect(() => {
        if (loginMethod === 'phone' && !recaptchaVerifierRef.current) {
            setupRecaptcha(recaptchaContainerRef, recaptchaVerifierRef);
        }
    }, [loginMethod, setupRecaptcha]);

    // Check if there's a saved email for "Remember me"
    useEffect(() => {
        const savedEmail = localStorage.getItem('userEmail');
        if (savedEmail) {
            setFormData((prevData) => ({ ...prevData, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));

        // Clear errors when user is typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const success = await login({ email, password });

            if (success) {
                // If remember me is checked, save the email
                if (rememberMe) {
                    localStorage.setItem('userEmail', email);
                } else {
                    localStorage.removeItem('userEmail');
                }

                toast.success('Login successful!');

                // Redirect to the original requested page or home
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.code ? getErrorMessage(err.code) : 'Login failed. Please check your credentials.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper function to provide user-friendly error messages
    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/user-not-found':
                return 'No account found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/too-many-requests':
                return 'Too many failed login attempts. Please try again later.';
            default:
                return 'An error occurred during login. Please try again.';
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');

        try {
            const success = await signInWithGoogle();
            if (success) {
                toast.success('Google sign-in successful!');
                navigate(from, { replace: true });
            }
        } catch (err) {
            console.error('Google sign-in error:', err);
            setError('Google sign-in failed. Please try again.');
            toast.error('Google sign-in failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const validatePhoneForm = () => {
        const newErrors = {};

        // Validate phone number (simple validation for digits)
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{8,15}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid phone number (8-15 digits)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!validatePhoneForm()) {
            return;
        }

        setPhoneLoading(true);

        try {
            // Include country code with phone number
            const fullPhoneNumber = `${countryCode}${phoneNumber}`;

            if (!recaptchaVerifierRef.current) {
                throw new Error("reCAPTCHA not initialized");
            }

            const success = await signInWithPhone(fullPhoneNumber, recaptchaVerifierRef.current);

            if (success) {
                setVerificationSent(true);
                toast.info('Verification code sent to your phone!');
            }
        } catch (err) {
            console.error('Phone verification error:', err);
            setErrors({
                general: 'Failed to send verification code. Please try again.'
            });
            toast.error('Failed to send verification code. Please try again.');
        } finally {
            setPhoneLoading(false);
        }
    };

    const switchLoginMethod = (method) => {
        setLoginMethod(method);
        setError('');
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-[calc(100vh-120px)] bg-gray-50 px-4 py-12"
        >
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-blue-600 px-6 py-8 text-white text-center">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-blue-100">Sign in to your account to continue</p>
                    </div>

                    <div className="p-6">
                        {/* Tab navigation for login options */}
                        <div className="flex mb-6 border-b">
                            <button
                                className={`flex-1 py-2 text-center font-medium ${loginMethod === 'email'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => switchLoginMethod('email')}
                            >
                                Email
                            </button>
                            <button
                                className={`flex-1 py-2 text-center font-medium ${loginMethod === 'phone'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => switchLoginMethod('phone')}
                            >
                                Phone
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                <p>{error}</p>
                            </div>
                        )}

                        {loginMethod === 'email' ? (
                            // Email login form
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <FaEnvelope />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={email}
                                            onChange={handleChange}
                                            className="appearance-none border border-gray-300 rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <FaLock />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={handleChange}
                                            className="appearance-none border border-gray-300 rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {isLoading ? "Signing in..." : "Sign In"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Phone login form
                            <form onSubmit={handleSendOTP} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phoneNumber">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <FaPhone />
                                        </div>
                                        <div className="flex">
                                            <select
                                                name="countryCode"
                                                id="countryCode"
                                                value={countryCode}
                                                onChange={handleChange}
                                                className="appearance-none border border-gray-300 rounded-l w-24 py-3 pl-10 pr-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {/* Popular codes first */}
                                                {popularCountryCodes.map(({ code, country }) => (
                                                    <option key={`popular-${code}`} value={code}>
                                                        {code} ({country})
                                                    </option>
                                                ))}
                                                <option value="" disabled>──────────</option>
                                                {/* All other codes */}
                                                {countryCodes
                                                    .filter(cc => !popularCountryCodes.some(pcc => pcc.code === cc.code))
                                                    .map(({ code, country }) => (
                                                        <option key={code} value={code}>
                                                            {code} ({country})
                                                        </option>
                                                    ))}
                                            </select>
                                            <input
                                                type="tel"
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                value={phoneNumber}
                                                onChange={handleChange}
                                                className={`appearance-none border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-r w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Phone number"
                                            />
                                        </div>
                                        {errors.phoneNumber && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Recaptcha container */}
                                <div id="recaptcha-container" ref={recaptchaContainerRef}></div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={phoneLoading}
                                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${phoneLoading ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        {phoneLoading ? "Sending..." : "Send verification code"}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    disabled={googleLoading || isLoading}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <FaGoogle className="mr-2 text-red-600" />
                                    {googleLoading ? "Signing in..." : "Continue with Google"}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </motion.div>
    );
};

export default Login;