import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    PhoneAuthProvider,
    signInWithCredential
} from 'firebase/auth';
import {
    auth,
    storeUserData
} from '../firebase/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verificationId, setVerificationId] = useState(null);

    // Set up auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser ? {
                uid: currentUser.uid,
                email: currentUser.email,
                name: currentUser.displayName || 'User',
                photoURL: currentUser.photoURL,
                phoneNumber: currentUser.phoneNumber
            } : null);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Setup Recaptcha Verifier
    const setupRecaptcha = (containerRef, verifierRef) => {
        if (!containerRef.current || verifierRef.current) return;

        try {
            const recaptchaVerifier = new RecaptchaVerifier(auth, containerRef.current, {
                'size': 'normal',
                'callback': () => {
                    // reCAPTCHA solved, allow sign in
                },
                'expired-callback': () => {
                    toast.error('reCAPTCHA has expired. Please solve it again.');
                }
            });

            recaptchaVerifier.render();
            verifierRef.current = recaptchaVerifier;
        } catch (err) {
            console.error('Error setting up reCAPTCHA:', err);
        }
    };

    // Email/Password Login
    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);
            const { email, password } = credentials;
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const loggedInUser = userCredential.user;

            // Store user data
            await storeUserData(loggedInUser);

            toast.success(`Welcome back, ${loggedInUser.displayName || 'User'}!`);
            return true;
        } catch (err) {
            const errorMessage = getFirebaseAuthErrorMessage(err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Register with Email/Password
    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);
            const { email, password, name } = userData;

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // You can update the user profile here if needed
            // await updateProfile(userCredential.user, { displayName: name });

            // Store user data with additional fields
            await storeUserData({
                ...userCredential.user,
                displayName: name
            });

            toast.success('Registration successful!');
            return true;
        } catch (err) {
            const errorMessage = getFirebaseAuthErrorMessage(err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Google Sign In
    const signInWithGoogle = async () => {
        try {
            setError(null);
            setLoading(true);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Store user data
            await storeUserData(result.user);

            toast.success('Successfully signed in with Google!');
            return true;
        } catch (err) {
            const errorMessage = getFirebaseAuthErrorMessage(err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Phone Number Sign In
    const signInWithPhone = async (phoneNumber, appVerifier) => {
        try {
            setError(null);
            setLoading(true);
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setVerificationId(confirmationResult.verificationId);
            toast.success('OTP sent to your phone number!');
            return true;
        } catch (err) {
            const errorMessage = getFirebaseAuthErrorMessage(err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const verifyOTP = async (otp) => {
        try {
            setError(null);
            setLoading(true);

            if (!verificationId) {
                toast.error('No verification ID found. Please request OTP again.');
                return false;
            }

            const PhoneAuthCredential = PhoneAuthProvider.credential(verificationId, otp);
            const userCredential = await signInWithCredential(auth, PhoneAuthCredential);
            const loggedInUser = userCredential.user;

            // Store user data
            await storeUserData(loggedInUser);

            toast.success('Phone number verified successfully!');
            setVerificationId(null);
            return true;
        } catch (err) {
            const errorMessage = getFirebaseAuthErrorMessage(err);
            setError(errorMessage);
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            toast.info('You have been logged out');
        } catch (err) {
            console.error('Logout error:', err);
            toast.error('Error during logout');
        }
    };

    // Helper function to handle Firebase auth errors
    const getFirebaseAuthErrorMessage = (error) => {
        switch (error.code || error.errorCode) {
            case 'auth/invalid-email':
                return 'Invalid email address format.';
            case 'auth/user-disabled':
                return 'This account has been disabled.';
            case 'auth/user-not-found':
                return 'No account found with this email.';
            case 'auth/wrong-password':
                return 'Invalid password.';
            case 'auth/email-already-in-use':
                return 'Email already in use.';
            case 'auth/weak-password':
                return 'Password is too weak.';
            case 'auth/popup-closed-by-user':
                return 'Authentication popup was closed before completion.';
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with the same email address but different sign-in credentials. Try signing in with a different method.';
            case 'auth/cancelled-popup-request':
                return 'The authentication request was cancelled.';
            case 'auth/operation-not-allowed':
                return 'This login method is not enabled. Please contact support.';
            case 'auth/auth-domain-config-required':
                return 'Authentication domain configuration is required. Please contact support.';
            case 'auth/app-deleted':
                return 'Authentication service is unavailable. Please try again later.';
            case 'auth/invalid-api-key':
                return 'Invalid API key. Please contact support.';
            case 'auth/network-request-failed':
                return 'Network error occurred. Please check your internet connection.';
            case 'auth/invalid-verification-code':
                return 'Invalid verification code. Please try again.';
            case 'auth/invalid-verification-id':
                return 'Invalid verification ID. Please request a new code.';
            case 'auth/code-expired':
                return 'Verification code has expired. Please request a new code.';
            default:
                return error.message || error.errorMessage || 'An unknown error occurred.';
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
            signInWithGoogle,
            signInWithPhone,
            verifyOTP,
            logout,
            setupRecaptcha
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);