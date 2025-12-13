/**
 * Storage Wrapper using AsyncStorage
 * Works on iOS, Android, and Web
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Synchronous cache for frequently accessed data
const cache: Map<string, string> = new Map();

// Storage interface matching previous API
export const storage = {
  getString: (key: string): string | undefined => {
    return cache.get(key);
  },

  getNumber: (key: string): number | undefined => {
    const value = cache.get(key);
    return value !== undefined ? Number(value) : undefined;
  },

  getBoolean: (key: string): boolean | undefined => {
    const value = cache.get(key);
    if (value === 'true') return true;
    if (value === 'false') return false;
    return undefined;
  },

  set: (key: string, value: string | number | boolean): void => {
    const strValue = String(value);
    cache.set(key, strValue);
    // Async persist to storage
    AsyncStorage.setItem(key, strValue).catch(console.error);
  },

  delete: (key: string): void => {
    cache.delete(key);
    AsyncStorage.removeItem(key).catch(console.error);
  },

  contains: (key: string): boolean => {
    return cache.has(key);
  },

  getAllKeys: (): string[] => {
    return Array.from(cache.keys());
  },

  clearAll: (): void => {
    cache.clear();
    AsyncStorage.clear().catch(console.error);
  },
};

// Initialize cache from AsyncStorage
export const initializeStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const pairs = await AsyncStorage.multiGet(keys);
    pairs.forEach(([key, value]) => {
      if (value !== null) {
        cache.set(key, value);
      }
    });
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
};

// Type-safe storage helpers
export const StorageHelpers = {
  getString: (key: string): string | undefined => storage.getString(key),
  setString: (key: string, value: string): void => storage.set(key, value),
  getNumber: (key: string): number | undefined => storage.getNumber(key),
  setNumber: (key: string, value: number): void => storage.set(key, value),
  getBoolean: (key: string): boolean | undefined => storage.getBoolean(key),
  setBoolean: (key: string, value: boolean): void => storage.set(key, value),
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
  delete: (key: string): void => storage.delete(key),
  contains: (key: string): boolean => storage.contains(key),
  getAllKeys: (): string[] => storage.getAllKeys(),
  clearAll: (): void => storage.clearAll(),
};

// Zustand persist storage adapter
export const zustandStorage = {
  getItem: (name: string): string | null => {
    return storage.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};

export default storage;
