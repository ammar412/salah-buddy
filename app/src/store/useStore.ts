/**
 * Salah Buddy Global State Store
 * Using Zustand with MMKV persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import type {
  PrayerName,
  PrayerStatus,
  StoryProgress,
  UserProfile,
  StoryStatus
} from '../types';

// Helper to get today's date string
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Helper to get Ramadan day (1-30) based on start date
const getRamadanDay = (): number => {
  // This would be configured based on actual Ramadan start date
  // For now, we'll use a simple day counter from when user started
  const startDate = new Date('2024-03-11'); // Example Ramadan start
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diffDays, 1), 30);
};

interface StoreState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Today's Prayers
  todayPrayers: Record<PrayerName, boolean>;
  togglePrayer: (prayerId: PrayerName) => void;
  resetTodayPrayers: () => void;

  // Prayer History
  prayerHistory: PrayerStatus[];
  addPrayerToHistory: (status: PrayerStatus) => void;

  // Stories
  currentDay: number;
  storyProgress: Record<number, StoryProgress>;
  watchStory: (storyId: number) => void;
  getStoryStatus: (storyId: number) => StoryStatus;

  // Stats
  currentStreak: number;
  longestStreak: number;
  totalPrayersCompleted: number;
  totalStoriesWatched: number;
  updateStreak: () => void;

  // Settings
  prayerTimesLocation: {
    latitude: number;
    longitude: number;
    city?: string;
  } | null;
  setPrayerTimesLocation: (location: { latitude: number; longitude: number; city?: string } | null) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;

  // Computed
  getTodayProgress: () => { completed: number; total: number };
  getDayProgress: (date: string) => { prayersCompleted: number; storyWatched: boolean };
}

const defaultPrayers: Record<PrayerName, boolean> = {
  fajr: false,
  dhuhr: false,
  asr: false,
  maghrib: false,
  isha: false,
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Today's Prayers
      todayPrayers: { ...defaultPrayers },
      togglePrayer: (prayerId) => {
        const current = get().todayPrayers[prayerId];
        const newValue = !current;

        set((state) => ({
          todayPrayers: { ...state.todayPrayers, [prayerId]: newValue },
          totalPrayersCompleted: newValue
            ? state.totalPrayersCompleted + 1
            : state.totalPrayersCompleted - 1,
        }));

        // Add to history
        if (newValue) {
          get().addPrayerToHistory({
            prayerId,
            date: getTodayString(),
            completed: true,
            completedAt: new Date().toISOString(),
          });
        }

        // Update streak
        get().updateStreak();
      },
      resetTodayPrayers: () => set({ todayPrayers: { ...defaultPrayers } }),

      // Prayer History
      prayerHistory: [],
      addPrayerToHistory: (status) => {
        set((state) => ({
          prayerHistory: [...state.prayerHistory, status],
        }));
      },

      // Stories
      currentDay: getRamadanDay(),
      storyProgress: {},
      watchStory: (storyId) => {
        const currentProgress = get().storyProgress[storyId];
        if (currentProgress?.status === 'watched') return;

        set((state) => ({
          storyProgress: {
            ...state.storyProgress,
            [storyId]: {
              storyId,
              status: 'watched',
              watchedAt: new Date().toISOString(),
              watchProgress: 100,
            },
          },
          totalStoriesWatched: state.totalStoriesWatched + 1,
        }));
      },
      getStoryStatus: (storyId) => {
        const state = get();
        const progress = state.storyProgress[storyId];

        if (progress?.status === 'watched') return 'watched';
        if (storyId === state.currentDay) return 'current';
        if (storyId < state.currentDay) return 'watched'; // Past days should be unlocked
        return 'locked';
      },

      // Stats
      currentStreak: 0,
      longestStreak: 0,
      totalPrayersCompleted: 0,
      totalStoriesWatched: 0,
      updateStreak: () => {
        const state = get();
        const todayCompleted = Object.values(state.todayPrayers).filter(Boolean).length;

        // If all 5 prayers completed today, increment streak
        if (todayCompleted === 5) {
          const newStreak = state.currentStreak + 1;
          set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
          });
        }
      },

      // Settings
      prayerTimesLocation: null,
      setPrayerTimesLocation: (location) => set({ prayerTimesLocation: location }),
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      // Computed
      getTodayProgress: () => {
        const prayers = get().todayPrayers;
        const completed = Object.values(prayers).filter(Boolean).length;
        return { completed, total: 5 };
      },
      getDayProgress: (date) => {
        const state = get();
        const dayPrayers = state.prayerHistory.filter((p) => p.date === date && p.completed);
        const storyForDay = Object.values(state.storyProgress).find(
          (s) => s.watchedAt?.startsWith(date)
        );
        return {
          prayersCompleted: dayPrayers.length,
          storyWatched: !!storyForDay,
        };
      },
    }),
    {
      name: 'salah-buddy-store',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        user: state.user,
        todayPrayers: state.todayPrayers,
        prayerHistory: state.prayerHistory,
        currentDay: state.currentDay,
        storyProgress: state.storyProgress,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        totalPrayersCompleted: state.totalPrayersCompleted,
        totalStoriesWatched: state.totalStoriesWatched,
        prayerTimesLocation: state.prayerTimesLocation,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);

export default useStore;
