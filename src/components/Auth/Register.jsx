import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { auth, createRecaptchaVerifier } from '../../firebase/firebase';

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
                                                        <option value="+1">+1 (US)</option>
                                                        <option value="+7">+7 (RU)</option>
                                                        <option value="+20">+20 (EG)</option>
                                                        <option value="+27">+27 (ZA)</option>
                                                        <option value="+30">+30 (GR)</option>
                                                        <option value="+31">+31 (NL)</option>
                                                        <option value="+32">+32 (BE)</option>
                                                        <option value="+33">+33 (FR)</option>
                                                        <option value="+34">+34 (ES)</option>
                                                        <option value="+36">+36 (HU)</option>
                                                        <option value="+39">+39 (IT)</option>
                                                        <option value="+40">+40 (RO)</option>
                                                        <option value="+41">+41 (CH)</option>
                                                        <option value="+43">+43 (AT)</option>
                                                        <option value="+44">+44 (UK)</option>
                                                        <option value="+45">+45 (DK)</option>
                                                        <option value="+46">+46 (SE)</option>
                                                        <option value="+47">+47 (NO)</option>
                                                        <option value="+48">+48 (PL)</option>
                                                        <option value="+49">+49 (DE)</option>
                                                        <option value="+51">+51 (PE)</option>
                                                        <option value="+52">+52 (MX)</option>
                                                        <option value="+54">+54 (AR)</option>
                                                        <option value="+55">+55 (BR)</option>
                                                        <option value="+56">+56 (CL)</option>
                                                        <option value="+57">+57 (CO)</option>
                                                        <option value="+58">+58 (VE)</option>
                                                        <option value="+60">+60 (MY)</option>
                                                        <option value="+61">+61 (AU)</option>
                                                        <option value="+62">+62 (ID)</option>
                                                        <option value="+63">+63 (PH)</option>
                                                        <option value="+64">+64 (NZ)</option>
                                                        <option value="+65">+65 (SG)</option>
                                                        <option value="+66">+66 (TH)</option>
                                                        <option value="+81">+81 (JP)</option>
                                                        <option value="+82">+82 (KR)</option>
                                                        <option value="+84">+84 (VN)</option>
                                                        <option value="+86">+86 (CN)</option>
                                                        <option value="+90">+90 (TR)</option>
                                                        <option value="+91">+91 (IN)</option>
                                                        <option value="+92">+92 (PK)</option>
                                                        <option value="+93">+93 (AF)</option>
                                                        <option value="+94">+94 (LK)</option>
                                                        <option value="+95">+95 (MM)</option>
                                                        <option value="+98">+98 (IR)</option>
                                                        <option value="+212">+212 (MA)</option>
                                                        <option value="+213">+213 (DZ)</option>
                                                        <option value="+216">+216 (TN)</option>
                                                        <option value="+218">+218 (LY)</option>
                                                        <option value="+220">+220 (GM)</option>
                                                        <option value="+221">+221 (SN)</option>
                                                        <option value="+222">+222 (MR)</option>
                                                        <option value="+223">+223 (ML)</option>
                                                        <option value="+224">+224 (GN)</option>
                                                        <option value="+225">+225 (CI)</option>
                                                        <option value="+226">+226 (BF)</option>
                                                        <option value="+227">+227 (NE)</option>
                                                        <option value="+228">+228 (TG)</option>
                                                        <option value="+229">+229 (BJ)</option>
                                                        <option value="+230">+230 (MU)</option>
                                                        <option value="+231">+231 (LR)</option>
                                                        <option value="+232">+232 (SL)</option>
                                                        <option value="+233">+233 (GH)</option>
                                                        <option value="+234">+234 (NG)</option>
                                                        <option value="+235">+235 (TD)</option>
                                                        <option value="+236">+236 (CF)</option>
                                                        <option value="+237">+237 (CM)</option>
                                                        <option value="+238">+238 (CV)</option>
                                                        <option value="+239">+239 (ST)</option>
                                                        <option value="+240">+240 (GQ)</option>
                                                        <option value="+241">+241 (GA)</option>
                                                        <option value="+242">+242 (CG)</option>
                                                        <option value="+243">+243 (CD)</option>
                                                        <option value="+244">+244 (AO)</option>
                                                        <option value="+245">+245 (GW)</option>
                                                        <option value="+246">+246 (IO)</option>
                                                        <option value="+248">+248 (SC)</option>
                                                        <option value="+249">+249 (SD)</option>
                                                        <option value="+250">+250 (RW)</option>
                                                        <option value="+251">+251 (ET)</option>
                                                        <option value="+252">+252 (SO)</option>
                                                        <option value="+253">+253 (DJ)</option>
                                                        <option value="+254">+254 (KE)</option>
                                                        <option value="+255">+255 (TZ)</option>
                                                        <option value="+256">+256 (UG)</option>
                                                        <option value="+257">+257 (BI)</option>
                                                        <option value="+258">+258 (MZ)</option>
                                                        <option value="+260">+260 (ZM)</option>
                                                        <option value="+261">+261 (MG)</option>
                                                        <option value="+262">+262 (RE)</option>
                                                        <option value="+263">+263 (ZW)</option>
                                                        <option value="+264">+264 (NA)</option>
                                                        <option value="+265">+265 (MW)</option>
                                                        <option value="+266">+266 (LS)</option>
                                                        <option value="+267">+267 (BW)</option>
                                                        <option value="+268">+268 (SZ)</option>
                                                        <option value="+269">+269 (KM)</option>
                                                        <option value="+351">+351 (PT)</option>
                                                        <option value="+352">+352 (LU)</option>
                                                        <option value="+353">+353 (IE)</option>
                                                        <option value="+354">+354 (IS)</option>
                                                        <option value="+355">+355 (AL)</option>
                                                        <option value="+356">+356 (MT)</option>
                                                        <option value="+357">+357 (CY)</option>
                                                        <option value="+358">+358 (FI)</option>
                                                        <option value="+359">+359 (BG)</option>
                                                        <option value="+370">+370 (LT)</option>
                                                        <option value="+371">+371 (LV)</option>
                                                        <option value="+372">+372 (EE)</option>
                                                        <option value="+373">+373 (MD)</option>
                                                        <option value="+374">+374 (AM)</option>
                                                        <option value="+375">+375 (BY)</option>
                                                        <option value="+376">+376 (AD)</option>
                                                        <option value="+377">+377 (MC)</option>
                                                        <option value="+378">+378 (SM)</option>
                                                        <option value="+380">+380 (UA)</option>
                                                        <option value="+381">+381 (RS)</option>
                                                        <option value="+382">+382 (ME)</option>
                                                        <option value="+383">+383 (XK)</option>
                                                        <option value="+385">+385 (HR)</option>
                                                        <option value="+386">+386 (SI)</option>
                                                        <option value="+387">+387 (BA)</option>
                                                        <option value="+389">+389 (MK)</option>
                                                        <option value="+420">+420 (CZ)</option>
                                                        <option value="+421">+421 (SK)</option>
                                                        <option value="+423">+423 (LI)</option>
                                                        <option value="+500">+500 (FK)</option>
                                                        <option value="+501">+501 (BZ)</option>
                                                        <option value="+502">+502 (GT)</option>
                                                        <option value="+503">+503 (SV)</option>
                                                        <option value="+504">+504 (HN)</option>
                                                        <option value="+505">+505 (NI)</option>
                                                        <option value="+506">+506 (CR)</option>
                                                        <option value="+507">+507 (PA)</option>
                                                        <option value="+509">+509 (HT)</option>
                                                        <option value="+591">+591 (BO)</option>
                                                        <option value="+592">+592 (GY)</option>
                                                        <option value="+593">+593 (EC)</option>
                                                        <option value="+595">+595 (PY)</option>
                                                        <option value="+597">+597 (SR)</option>
                                                        <option value="+598">+598 (UY)</option>
                                                        <option value="+599">+599 (CW)</option>
                                                        <option value="+670">+670 (TL)</option>
                                                        <option value="+672">+672 (AQ)</option>
                                                        <option value="+673">+673 (BN)</option>
                                                        <option value="+674">+674 (NR)</option>
                                                        <option value="+675">+675 (PG)</option>
                                                        <option value="+676">+676 (TO)</option>
                                                        <option value="+677">+677 (SB)</option>
                                                        <option value="+678">+678 (VU)</option>
                                                        <option value="+679">+679 (FJ)</option>
                                                        <option value="+680">+680 (PW)</option>
                                                        <option value="+681">+681 (WF)</option>
                                                        <option value="+682">+682 (CK)</option>
                                                        <option value="+683">+683 (NU)</option>
                                                        <option value="+685">+685 (WS)</option>
                                                        <option value="+686">+686 (KI)</option>
                                                        <option value="+687">+687 (NC)</option>
                                                        <option value="+688">+688 (TV)</option>
                                                        <option value="+689">+689 (PF)</option>
                                                        <option value="+690">+690 (TK)</option>
                                                        <option value="+691">+691 (FM)</option>
                                                        <option value="+692">+692 (MH)</option>
                                                        <option value="+850">+850 (KP)</option>
                                                        <option value="+852">+852 (HK)</option>
                                                        <option value="+853">+853 (MO)</option>
                                                        <option value="+855">+855 (KH)</option>
                                                        <option value="+856">+856 (LA)</option>
                                                        <option value="+880">+880 (BD)</option>
                                                        <option value="+886">+886 (TW)</option>
                                                        <option value="+960">+960 (MV)</option>
                                                        <option value="+961">+961 (LB)</option>
                                                        <option value="+962">+962 (JO)</option>
                                                        <option value="+963">+963 (SY)</option>
                                                        <option value="+964">+964 (IQ)</option>
                                                        <option value="+965">+965 (KW)</option>
                                                        <option value="+966">+966 (SA)</option>
                                                        <option value="+967">+967 (YE)</option>
                                                        <option value="+968">+968 (OM)</option>
                                                        <option value="+970">+970 (PS)</option>
                                                        <option value="+971">+971 (AE)</option>
                                                        <option value="+972">+972 (IL)</option>
                                                        <option value="+973">+973 (BH)</option>
                                                        <option value="+974">+974 (QA)</option>
                                                        <option value="+975">+975 (BT)</option>
                                                        <option value="+976">+976 (MN)</option>
                                                        <option value="+977">+977 (NP)</option>
                                                        <option value="+992">+992 (TJ)</option>
                                                        <option value="+993">+993 (TM)</option>
                                                        <option value="+994">+994 (AZ)</option>
                                                        <option value="+995">+995 (GE)</option>
                                                        <option value="+996">+996 (KG)</option>
                                                        <option value="+998">+998 (UZ)</option>
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