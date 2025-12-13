/**
 * Firebase Configuration and Initialization
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project called "salah-buddy"
 * 3. Enable Authentication (Email/Password)
 * 4. Enable Firestore Database
 * 5. Copy your web app config and replace the placeholder below
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  Auth
} from 'firebase/auth';
// @ts-ignore - getReactNativePersistence is available in react-native environment
import { getReactNativePersistence } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD95yMLj73ZzVAagG1SZZsloZf2efs90Bg",
  authDomain: "salah-buddy-b3ac8.firebaseapp.com",
  projectId: "salah-buddy-b3ac8",
  storageBucket: "salah-buddy-b3ac8.firebasestorage.app",
  messagingSenderId: "675921169506",
  appId: "1:675921169506:web:be4ee90b41e8251b8c153b",
};

// Check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export const initializeFirebase = (): { app: FirebaseApp; auth: Auth; db: Firestore } => {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);

    // Initialize Auth with AsyncStorage persistence for React Native
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });

    // Initialize Firestore
    db = getFirestore(app);
  } else {
    app = getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  }

  return { app, auth, db };
};

// Export initialized instances
export const getFirebaseApp = (): FirebaseApp => {
  if (!app) {
    initializeFirebase();
  }
  return app;
};

export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
};

export const getFirebaseDb = (): Firestore => {
  if (!db) {
    initializeFirebase();
  }
  return db;
};

// Initialize on import if configured
if (isFirebaseConfigured()) {
  initializeFirebase();
}

export { app, auth, db };
