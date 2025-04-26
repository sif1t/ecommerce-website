// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
// Replace these with your actual Firebase project config values from the Firebase Console
// https://console.firebase.google.com/
const firebaseConfig = {
    apiKey: "AIzaSyDK5kn7358AzNUJTNppqSRKpVCs9Nl82ww",
  authDomain: "shopex-80ec1.firebaseapp.com",
  projectId: "shopex-80ec1",
  storageBucket: "shopex-80ec1.firebasestorage.app",
  messagingSenderId: "231400669820",
  appId: "1:231400669820:web:7ff52abaca0c21af4c7ff9",
  measurementId: "G-B89HLK8QER"
};

// Instructions to get your Firebase config:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project or select your existing project
// 3. Click on the web icon (</>) to add a web app to your project if you haven't already
// 4. Register your app with a nickname
// 5. Copy the firebaseConfig object

// Initialize Firebase services
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let analytics = null;

// Initialize analytics only in browser environment
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
}

export { auth, db, storage, analytics };