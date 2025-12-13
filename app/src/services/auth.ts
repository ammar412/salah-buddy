/**
 * Authentication Service
 * Handles user signup, login, and session management
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from './firebase';
import { hashPin, verifyPin as verifyPinHash } from '../utils/crypto';

// Types
export interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  pinHash: string; // PIN is now stored as a hash
  age: number;
  createdAt: Date;
}

export interface FamilyData {
  id: string;
  parentEmail: string;
  parentName: string;
  children: ChildProfile[];
  createdAt: Date;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  familyId: string;
  isParent: boolean;
  childProfileId?: string;
  createdAt: Date;
}

// Demo mode flag - uses local storage when Firebase not configured
const isDemoMode = !isFirebaseConfigured();

/**
 * Sign up a new parent account
 */
export const signUpParent = async (
  email: string,
  password: string,
  name: string
): Promise<{ user: User; familyId: string }> => {
  if (isDemoMode) {
    throw new Error('Firebase not configured. Please add your Firebase config.');
  }

  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  // Create auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name
  await updateProfile(user, { displayName: name });

  // Create family document
  const familyRef = await addDoc(collection(db, 'families'), {
    parentEmail: email,
    parentName: name,
    createdAt: serverTimestamp(),
  });

  // Create user document
  await setDoc(doc(db, 'users', user.uid), {
    email,
    displayName: name,
    familyId: familyRef.id,
    isParent: true,
    createdAt: serverTimestamp(),
  });

  return { user, familyId: familyRef.id };
};

/**
 * Sign in an existing user
 */
export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  if (isDemoMode) {
    throw new Error('Firebase not configured. Please add your Firebase config.');
  }

  const auth = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  if (isDemoMode) return;

  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
};

/**
 * Add a child profile to a family
 */
export const addChildProfile = async (
  familyId: string,
  name: string,
  avatar: string,
  pin: string,
  age: number
): Promise<ChildProfile> => {
  if (isDemoMode) {
    throw new Error('Firebase not configured. Please add your Firebase config.');
  }

  const db = getFirebaseDb();

  // Generate a temporary ID for hashing (will be replaced with actual doc ID)
  const tempId = `${familyId}_${Date.now()}`;
  const pinHash = await hashPin(pin, tempId);

  const childRef = await addDoc(collection(db, 'families', familyId, 'children'), {
    name,
    avatar,
    pinHash, // Store hashed PIN, not plaintext
    age,
    createdAt: serverTimestamp(),
  });

  // Update the document with the correct hash using actual child ID
  const correctPinHash = await hashPin(pin, childRef.id);
  await updateDoc(childRef, { pinHash: correctPinHash });

  // Create stats document for the child
  await setDoc(doc(db, 'stats', childRef.id), {
    familyId,
    childName: name, // Denormalized for leaderboard
    childAvatar: avatar, // Denormalized for leaderboard
    totalPrayers: 0,
    totalStories: 0,
    currentStreak: 0,
    longestStreak: 0,
    stars: 0,
    createdAt: serverTimestamp(),
  });

  return {
    id: childRef.id,
    name,
    avatar,
    pinHash: correctPinHash,
    age,
    createdAt: new Date(),
  };
};

/**
 * Get all children in a family
 */
export const getChildren = async (familyId: string): Promise<ChildProfile[]> => {
  if (isDemoMode) {
    return [];
  }

  const db = getFirebaseDb();
  const childrenRef = collection(db, 'families', familyId, 'children');
  const snapshot = await getDocs(childrenRef);

  return snapshot.docs.map(docSnapshot => ({
    id: docSnapshot.id,
    name: docSnapshot.data().name,
    avatar: docSnapshot.data().avatar,
    pinHash: docSnapshot.data().pinHash || docSnapshot.data().pin, // Support legacy plaintext PINs
    age: docSnapshot.data().age,
    createdAt: docSnapshot.data().createdAt?.toDate() || new Date(),
  })) as ChildProfile[];
};

/**
 * Verify child PIN against stored hash
 */
export const verifyChildPin = async (
  familyId: string,
  childId: string,
  pin: string
): Promise<boolean> => {
  if (isDemoMode) {
    return true;
  }

  const db = getFirebaseDb();
  const childRef = doc(db, 'families', familyId, 'children', childId);
  const childDoc = await getDoc(childRef);

  if (!childDoc.exists()) {
    return false;
  }

  const data = childDoc.data();

  // Check if PIN is hashed or legacy plaintext
  if (data.pinHash) {
    // New hashed PIN - verify securely
    return verifyPinHash(pin, childId, data.pinHash);
  } else if (data.pin) {
    // Legacy plaintext PIN - verify and migrate to hash
    if (data.pin === pin) {
      // Migrate to hashed PIN
      const newPinHash = await hashPin(pin, childId);
      await updateDoc(childRef, {
        pinHash: newPinHash,
        pin: null, // Remove plaintext PIN
      });
      return true;
    }
    return false;
  }

  return false;
};

/**
 * Get current user data
 */
export const getCurrentUserData = async (uid: string): Promise<UserData | null> => {
  if (isDemoMode) {
    return null;
  }

  const db = getFirebaseDb();
  const userRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return null;
  }

  return {
    uid,
    ...userDoc.data(),
    createdAt: userDoc.data().createdAt?.toDate() || new Date(),
  } as UserData;
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  if (isDemoMode) {
    callback(null);
    return () => {};
  }

  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
};

/**
 * Get family data
 */
export const getFamilyData = async (familyId: string): Promise<FamilyData | null> => {
  if (isDemoMode) {
    return null;
  }

  const db = getFirebaseDb();
  const familyRef = doc(db, 'families', familyId);
  const familyDoc = await getDoc(familyRef);

  if (!familyDoc.exists()) {
    return null;
  }

  const children = await getChildren(familyId);

  return {
    id: familyId,
    ...familyDoc.data(),
    children,
    createdAt: familyDoc.data().createdAt?.toDate() || new Date(),
  } as FamilyData;
};

export default {
  signUpParent,
  signIn,
  signOut,
  addChildProfile,
  getChildren,
  verifyChildPin,
  getCurrentUserData,
  subscribeToAuthState,
  getFamilyData,
};
