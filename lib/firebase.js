// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Updated with your new Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyAzBo34wLY-gSMGrxB2Jo9uQKMzjoSSdQc",
  authDomain: "netflix-clone-761af.firebaseapp.com",
  projectId: "netflix-clone-761af",
  storageBucket: "netflix-clone-761af.firebasestorage.app",
  messagingSenderId: "544558060573",
  appId: "1:544558060573:web:01798fb7accb5f61cde2f4",
  measurementId: "G-DQ1PZRWB1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics only on client side
export const getAnalyticsInstance = () => {
  if (typeof window !== 'undefined') {
    return getAnalytics(app);
  }
  return null;
};

export default app;
