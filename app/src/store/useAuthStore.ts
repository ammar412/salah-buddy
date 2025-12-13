/**
 * Authentication Store
 * Manages auth state, family data, and current child profile
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { User } from 'firebase/auth';
import {
  ChildProfile,
  FamilyData,
  signUpParent,
  signIn,
  signOut,
  addChildProfile,
  getChildren,
  verifyChildPin,
  getCurrentUserData,
  getFamilyData,
  subscribeToAuthState,
} from '../services/auth';

// Store unsubscribe function for cleanup
let authUnsubscribe: (() => void) | null = null;

interface AuthState {
  // Auth state
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  familyId: string | null;
  isParent: boolean;

  // Family data
  family: FamilyData | null;
  children: ChildProfile[];

  // Current active child profile
  currentChild: ChildProfile | null;

  // Demo mode (when Firebase not configured)
  isDemoMode: boolean;

  // Actions
  initialize: () => Promise<void>;
  cleanup: () => void; // New: cleanup subscriptions
  signUpAsParent: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createChildProfile: (name: string, avatar: string, pin: string, age: number) => Promise<ChildProfile>;
  selectChild: (child: ChildProfile) => void;
  verifyPin: (childId: string, pin: string) => Promise<boolean>;
  refreshFamilyData: () => Promise<void>;
  enableDemoMode: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: true,
      user: null,
      familyId: null,
      isParent: false,
      family: null,
      children: [],
      currentChild: null,
      isDemoMode: false,

      // Initialize auth state
      initialize: async () => {
        // Clean up any existing subscription first (prevents memory leak)
        if (authUnsubscribe) {
          authUnsubscribe();
          authUnsubscribe = null;
        }

        set({ isLoading: true });

        try {
          // Subscribe to auth state changes and store unsubscribe function
          authUnsubscribe = subscribeToAuthState(async (user) => {
            if (user) {
              const userData = await getCurrentUserData(user.uid);
              if (userData) {
                const family = await getFamilyData(userData.familyId);
                set({
                  isAuthenticated: true,
                  user,
                  familyId: userData.familyId,
                  isParent: userData.isParent,
                  family,
                  children: family?.children || [],
                  isLoading: false,
                });
              }
            } else {
              set({
                isAuthenticated: false,
                user: null,
                familyId: null,
                isParent: false,
                family: null,
                children: [],
                currentChild: null,
                isLoading: false,
              });
            }
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false });
        }
      },

      // Cleanup subscriptions (call on app unmount)
      cleanup: () => {
        if (authUnsubscribe) {
          authUnsubscribe();
          authUnsubscribe = null;
        }
      },

      // Sign up as parent
      signUpAsParent: async (email, password, name) => {
        set({ isLoading: true });
        try {
          const { user, familyId } = await signUpParent(email, password, name);
          set({
            isAuthenticated: true,
            user,
            familyId,
            isParent: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Sign in with email
      signInWithEmail: async (email, password) => {
        set({ isLoading: true });
        try {
          const user = await signIn(email, password);
          const userData = await getCurrentUserData(user.uid);
          if (userData) {
            const family = await getFamilyData(userData.familyId);
            set({
              isAuthenticated: true,
              user,
              familyId: userData.familyId,
              isParent: userData.isParent,
              family,
              children: family?.children || [],
              isLoading: false,
            });
          }
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        await signOut();
        set({
          isAuthenticated: false,
          user: null,
          familyId: null,
          isParent: false,
          family: null,
          children: [],
          currentChild: null,
          isDemoMode: false,
        });
      },

      // Create child profile
      createChildProfile: async (name, avatar, pin, age) => {
        const { familyId } = get();
        if (!familyId) {
          throw new Error('No family ID found');
        }

        const child = await addChildProfile(familyId, name, avatar, pin, age);

        set((state) => ({
          children: [...state.children, child],
        }));

        return child;
      },

      // Select active child
      selectChild: (child) => {
        set({ currentChild: child });
      },

      // Verify child PIN
      verifyPin: async (childId, pin) => {
        const { familyId } = get();
        if (!familyId) return false;

        return await verifyChildPin(familyId, childId, pin);
      },

      // Refresh family data
      refreshFamilyData: async () => {
        const { familyId } = get();
        if (!familyId) return;

        const family = await getFamilyData(familyId);
        set({
          family,
          children: family?.children || [],
        });
      },

      // Enable demo mode (no Firebase required)
      enableDemoMode: () => {
        set({
          isDemoMode: true,
          isAuthenticated: true,
          isLoading: false,
          isParent: false,
          currentChild: {
            id: 'demo-child',
            name: 'Demo Kid',
            avatar: '😊',
            pinHash: 'demo-pin-hash', // Demo mode doesn't need real hash
            age: 8,
            createdAt: new Date(),
          },
        });
      },
    }),
    {
      name: 'salah-buddy-auth',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        familyId: state.familyId,
        isParent: state.isParent,
        currentChild: state.currentChild,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
);

export default useAuthStore;
