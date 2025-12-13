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

// Types
export interface ChildProfile {
  id: string;
  name: string;
  avatar: string;
  pin: string;
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

  const childRef = await addDoc(collection(db, 'families', familyId, 'children'), {
    name,
    avatar,
    pin,
    age,
    createdAt: serverTimestamp(),
  });

  // Create stats document for the child
  await setDoc(doc(db, 'stats', childRef.id), {
    familyId,
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
    pin,
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

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as ChildProfile[];
};

/**
 * Verify child PIN
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

  return childDoc.data().pin === pin;
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
