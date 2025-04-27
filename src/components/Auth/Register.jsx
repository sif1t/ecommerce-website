import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { auth, createRecaptchaVerifier } from '../../firebase/firebase';
import { countryCodes, popularCountryCodes } from '../../utils/countryCodes'; // Import country codes

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        countryCode: '+91'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [phoneLoading, setPhoneLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');

    const recaptchaVerifierRef = useRef(null);
    const recaptchaContainerRef = useRef(null);

    const { register, signInWithGoogle, signInWithPhone, verifyOTP } = useAuth();
    const navigate = useNavigate();

    const { firstName, lastName, email, password, confirmPassword, phoneNumber, countryCode } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });

        // Clear error for this field when user types
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Check first name
        if (!firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Check password strength
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Check password matching
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Check terms acceptance
        if (!acceptTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const userData = {
                name: `${firstName} ${lastName}`.trim(),
                email,
                password
            };

            const success = await register(userData);

            if (success) {
                navigate('/');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setErrors({
                general: 'Registration failed. Please try again later.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        setGoogleLoading(true);
        try {
            const success = await signInWithGoogle();
            if (success) {
                navigate('/');
            }
        } catch (err) {
            console.error('Google registration error:', err);
            setErrors({
                general: 'Google sign-up failed. Please try again later.'
            });
        } finally {
            setGoogleLoading(false);
        }
    };

    // Initialize recaptcha when component mounts (for phone auth)
    useEffect(() => {
        if (authMethod === 'phone' && !recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current = createRecaptchaVerifier(auth, recaptchaContainerRef.current, {
                size: 'normal',
                callback: () => {
                    // reCAPTCHA solved, allow sending OTP
                },
                'expired-callback': () => {
                    // Reset reCAPTCHA
                    if (recaptchaVerifierRef.current) {
                        recaptchaVerifierRef.current.clear();
                        recaptchaVerifierRef.current = null;
                    }
                    setErrors({
                        ...errors,
                        phoneNumber: 'reCAPTCHA expired, please try again'
                    });
                }
            });

            recaptchaVerifierRef.current.render();
        }

        return () => {
            // Clean up recaptcha when component unmounts
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
                recaptchaVerifierRef.current = null;
            }
        };
    }, [authMethod]);

    const validatePhoneForm = () => {
        const newErrors = {};

        // Validate phone number (simple validation for 10-digit number)
        if (!phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{10}$/.test(phoneNumber)) {
            newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
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
            if (!recaptchaVerifierRef.current) {
                throw new Error('reCAPTCHA not initialized');
            }

            // Include country code with phone number
            const fullPhoneNumber = `${countryCode}${phoneNumber}`;
            const success = await signInWithPhone(fullPhoneNumber, recaptchaVerifierRef.current);

            if (success) {
                setVerificationSent(true);
            }
        } catch (err) {
            console.error('Phone verification error:', err);
            setErrors({
                general: 'Failed to send verification code. Please try again.'
            });

            // Reset recaptcha
            if (recaptchaVerifierRef.current) {
                recaptchaVerifierRef.current.clear();
                recaptchaVerifierRef.current = null;
            }
        } finally {
            setPhoneLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!verificationCode.trim()) {
            setErrors({
                verificationCode: 'Please enter the verification code'
            });
            return;
        }

        setPhoneLoading(true);

        try {
            const success = await verifyOTP(verificationCode);

            if (success) {
                navigate('/');
            }
        } catch (err) {
            console.error('OTP verification error:', err);
            setErrors({
                verificationCode: 'Invalid verification code. Please try again.'
            });
        } finally {
            setPhoneLoading(false);
        }
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
                        <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                        <p className="text-blue-100">Join our community today</p>
                    </div>

                    <div className="p-6">
                        {errors.general && (
                            <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                                <p>{errors.general}</p>
                            </div>
                        )}

                        {/* Auth Method Selection Tabs */}
                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                type="button"
                                onClick={() => setAuthMethod('email')}
                                className={`py-2 px-4 font-medium text-sm ${authMethod === 'email'
                                    ? 'text-blue-600 border-b-2 border-blue-500'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Email
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setAuthMethod('phone');
                                    setVerificationSent(false);
                                }}
                                className={`py-2 px-4 font-medium text-sm ${authMethod === 'phone'
                                    ? 'text-blue-600 border-b-2 border-blue-500'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Phone Number
                            </button>
                        </div>

                        {authMethod === 'email' ? (
                            // Email Registration Form
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                                <FaUser />
                                            </div>
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                value={firstName}
                                                onChange={handleChange}
                                                className={`appearance-none border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="John"
                                            />
                                        </div>
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                                <FaUser />
                                            </div>
                                            <input
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                value={lastName}
                                                onChange={handleChange}
                                                className="appearance-none border border-gray-300 rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                </div>

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
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={handleChange}
                                            className={`appearance-none border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                                            name="password"
                                            id="password"
                                            value={password}
                                            onChange={handleChange}
                                            className={`appearance-none border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                    <p className="text-gray-500 text-xs mt-1">Password must be at least 8 characters</p>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                            <FaLock />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={handleChange}
                                            className={`appearance-none border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="terms"
                                            name="terms"
                                            type="checkbox"
                                            checked={acceptTerms}
                                            onChange={() => setAcceptTerms(!acceptTerms)}
                                            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${errors.terms ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="terms" className="text-gray-700">
                                            I agree to the{' '}
                                            <Link to="/terms" className="text-blue-600 hover:underline">
                                                Terms of Service
                                            </Link>{' '}
                                            and{' '}
                                            <Link to="/privacy" className="text-blue-600 hover:underline">
                                                Privacy Policy
                                            </Link>
                                        </label>
                                        {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                                    >
                                        {isLoading ? "Creating Account..." : "Create Account"}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            // Phone Registration Form
                            <>
                                {!verificationSent ? (
                                    <form onSubmit={handleSendOTP} className="space-y-4">
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
                                                        className="appearance-none border border-gray-300 rounded-l w-24 py-3 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                                        placeholder="1234567890"
                                                    />
                                                </div>
                                            </div>
                                            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                                            <p className="text-gray-500 text-xs mt-1">Enter phone number without country code (e.g., 1234567890)</p>
                                        </div>

                                        {/* reCAPTCHA Container */}
                                        <div className="my-4">
                                            <div ref={recaptchaContainerRef} id="recaptcha-container" className="flex justify-center"></div>
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                disabled={phoneLoading}
                                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${phoneLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                                            >
                                                {phoneLoading ? "Sending Code..." : "Send Verification Code"}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                                        <div className="mb-4">
                                            <button
                                                type="button"
                                                onClick={() => setVerificationSent(false)}
                                                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
                                            >
                                                <FaArrowLeft className="mr-1" /> Back to Phone Number
                                            </button>
                                            <p className="text-sm text-gray-600">
                                                We've sent a verification code to <span className="font-medium">{phoneNumber}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="verificationCode">
                                                Verification Code
                                            </label>
                                            <input
                                                type="text"
                                                id="verificationCode"
                                                value={verificationCode}
                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                className={`appearance-none border ${errors.verificationCode ? 'border-red-500' : 'border-gray-300'} rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Enter 6-digit code"
                                            />
                                            {errors.verificationCode && <p className="text-red-500 text-xs mt-1">{errors.verificationCode}</p>}
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                disabled={phoneLoading}
                                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${phoneLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                                            >
                                                {phoneLoading ? "Verifying..." : "Verify & Sign Up"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleRegister}
                                    disabled={isLoading || googleLoading || phoneLoading}
                                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    <FaGoogle className="mr-2 text-red-600" />
                                    {googleLoading ? "Signing up..." : "Google"}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Register;