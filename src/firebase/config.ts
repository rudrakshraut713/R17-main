import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDwXr_rTxKZm1wd0z38WHfEbDmxUmBoYew",
  authDomain: "r17gaming.firebaseapp.com",
  projectId: "r17gaming",
  storageBucket: "r17gaming.firebasestorage.app",
  messagingSenderId: "843564976009",
  appId: "1:843564976009:web:700563bd12ac5639568358",
  measurementId: "G-ZEXHXMGP8L"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;