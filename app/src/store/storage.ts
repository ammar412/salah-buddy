/**
 * MMKV Storage Wrapper
 * Fast, encrypted key-value storage for React Native
 */

import { MMKV } from 'react-native-mmkv';

// Create MMKV instance
export const storage = new MMKV({
  id: 'salah-buddy-storage',
  encryptionKey: 'salah-buddy-2024', // In production, use secure key management
});

// Storage keys
export const StorageKeys = {
  USER_PROFILE: 'user_profile',
  PRAYER_HISTORY: 'prayer_history',
  STORY_PROGRESS: 'story_progress',
  CURRENT_STREAK: 'current_streak',
  LONGEST_STREAK: 'longest_streak',
  TOTAL_PRAYERS: 'total_prayers',
  TOTAL_STORIES: 'total_stories',
  PRAYER_LOCATION: 'prayer_location',
  NOTIFICATIONS_ENABLED: 'notifications_enabled',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  LAST_ACTIVE_DATE: 'last_active_date',
} as const;

// Type-safe storage helpers
export const StorageHelpers = {
  // String operations
  getString: (key: string): string | undefined => {
    return storage.getString(key);
  },

  setString: (key: string, value: string): void => {
    storage.set(key, value);
  },

  // Number operations
  getNumber: (key: string): number | undefined => {
    return storage.getNumber(key);
  },

  setNumber: (key: string, value: number): void => {
    storage.set(key, value);
  },

  // Boolean operations
  getBoolean: (key: string): boolean | undefined => {
    return storage.getBoolean(key);
  },

  setBoolean: (key: string, value: boolean): void => {
    storage.set(key, value);
  },

  // JSON operations (for objects and arrays)
  getJSON: <T>(key: string): T | undefined => {
    const value = storage.getString(key);
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch {
      return undefined;
    }
  },

  setJSON: <T>(key: string, value: T): void => {
    storage.set(key, JSON.stringify(value));
  },

  // Delete operations
  delete: (key: string): void => {
    storage.delete(key);
  },

  // Check if key exists
  contains: (key: string): boolean => {
    return storage.contains(key);
  },

  // Get all keys
  getAllKeys: (): string[] => {
    return storage.getAllKeys();
  },

  // Clear all data
  clearAll: (): void => {
    storage.clearAll();
  },
};

// Zustand persist storage adapter
export const zustandStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};

export default storage;
