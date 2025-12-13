/**
 * Salah Buddy Global State Store
 * Using Zustand with MMKV persistence + Firestore sync
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from './storage';
import { useAuthStore } from './useAuthStore';
import {
  getTodayPrayers,
  togglePrayer as togglePrayerInFirestore,
  markStoryWatched,
  updateStoryProgress as updateStoryProgressInFirestore,
  getStoryProgress as getStoryProgressFromFirestore,
  getUserStats,
  updateStreak as updateStreakInFirestore,
  syncLocalDataToCloud,
  getAppSettings,
  getRamadanDayFromSettings,
  type AppSettings,
  type GamificationSettings,
  type RamadanSettings,
} from '../services/firestore';
import type {
  PrayerName,
  PrayerStatus,
  StoryProgress,
  UserProfile,
  StoryStatus
} from '../types';
import { getTodayString } from '../utils/date';

// Default gamification values (fallback when settings not loaded)
const DEFAULT_GAMIFICATION: GamificationSettings = {
  starsPerPrayer: 10,
  streakBonus: 5,
  storyBonus: 15,
  maxDailyStars: 0,
};

// Helper to get Ramadan day (1-30) based on settings or fallback
const getRamadanDay = (ramadanSettings: RamadanSettings | null): number => {
  return getRamadanDayFromSettings(ramadanSettings);
};

interface StoreState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Today's Prayers
  todayPrayers: Record<PrayerName, boolean>;
  togglePrayer: (prayerId: PrayerName) => void;
  resetTodayPrayers: () => void;
  loadTodayPrayers: () => Promise<void>;

  // Prayer History
  prayerHistory: PrayerStatus[];
  addPrayerToHistory: (status: PrayerStatus) => void;

  // Stories
  currentDay: number;
  storyProgress: Record<number, StoryProgress>;
  watchStory: (storyId: number) => void;
  loadStoryProgress: () => Promise<void>;
  getStoryStatus: (storyId: number) => StoryStatus;

  // Stats
  currentStreak: number;
  longestStreak: number;
  totalPrayersCompleted: number;
  totalStoriesWatched: number;
  stars: number;
  updateStreak: () => void;
  loadStats: () => Promise<void>;

  // Sync
  isSyncing: boolean;
  lastSyncAt: string | null;
  syncToCloud: () => Promise<void>;

  // App Settings (from Firestore)
  ramadanSettings: RamadanSettings | null;
  gamificationSettings: GamificationSettings;
  loadAppSettings: () => Promise<void>;

  // Local Settings
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

      // App Settings (from Firestore)
      ramadanSettings: null,
      gamificationSettings: DEFAULT_GAMIFICATION,
      loadAppSettings: async () => {
        try {
          const settings = await getAppSettings();
          const currentDay = getRamadanDay(settings.ramadan);
          set({
            ramadanSettings: settings.ramadan,
            gamificationSettings: settings.gamification,
            currentDay,
          });
        } catch (error) {
          console.error('Failed to load app settings:', error);
        }
      },

      // Today's Prayers
      todayPrayers: { ...defaultPrayers },
      togglePrayer: async (prayerId) => {
        const current = get().todayPrayers[prayerId];
        const newValue = !current;
        const { starsPerPrayer } = get().gamificationSettings;

        // Store previous state for rollback
        const previousState = {
          todayPrayers: { ...get().todayPrayers },
          totalPrayersCompleted: get().totalPrayersCompleted,
          stars: get().stars,
        };

        // Update local state immediately (optimistic update)
        set((state) => ({
          todayPrayers: { ...state.todayPrayers, [prayerId]: newValue },
          totalPrayersCompleted: newValue
            ? state.totalPrayersCompleted + 1
            : state.totalPrayersCompleted - 1,
          stars: newValue ? state.stars + starsPerPrayer : state.stars - starsPerPrayer,
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

        // Sync to Firestore
        const authState = useAuthStore.getState();
        if (authState.currentChild && !authState.isDemoMode) {
          try {
            await togglePrayerInFirestore(authState.currentChild.id, prayerId, newValue);
          } catch (error) {
            console.error('Failed to sync prayer to cloud:', error);
            // Rollback optimistic update on failure
            set({
              todayPrayers: previousState.todayPrayers,
              totalPrayersCompleted: previousState.totalPrayersCompleted,
              stars: previousState.stars,
            });
            // Re-throw so UI can show error
            throw error;
          }
        }

        // Update streak
        get().updateStreak();
      },
      resetTodayPrayers: () => set({ todayPrayers: { ...defaultPrayers } }),

      loadTodayPrayers: async () => {
        const authState = useAuthStore.getState();
        if (!authState.currentChild || authState.isDemoMode) return;

        try {
          const cloudPrayers = await getTodayPrayers(authState.currentChild.id);
          if (cloudPrayers) {
            set({
              todayPrayers: {
                fajr: cloudPrayers.fajr,
                dhuhr: cloudPrayers.dhuhr,
                asr: cloudPrayers.asr,
                maghrib: cloudPrayers.maghrib,
                isha: cloudPrayers.isha,
              },
            });
          }
        } catch (error) {
          console.error('Failed to load prayers from cloud:', error);
        }
      },

      // Prayer History
      prayerHistory: [],
      addPrayerToHistory: (status) => {
        set((state) => ({
          prayerHistory: [...state.prayerHistory, status],
        }));
      },

      // Stories
      currentDay: getRamadanDay(null), // Will be updated when loadAppSettings is called
      storyProgress: {},
      watchStory: async (storyId) => {
        const currentProgress = get().storyProgress[storyId];
        if (currentProgress?.status === 'watched') return;

        const { storyBonus } = get().gamificationSettings;

        // Update local state immediately
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
          stars: state.stars + storyBonus,
        }));

        // Sync to Firestore
        const authState = useAuthStore.getState();
        if (authState.currentChild && !authState.isDemoMode) {
          try {
            await markStoryWatched(authState.currentChild.id, storyId);
          } catch (error) {
            console.error('Failed to sync story to cloud:', error);
          }
        }
      },

      loadStoryProgress: async () => {
        const authState = useAuthStore.getState();
        if (!authState.currentChild || authState.isDemoMode) return;

        try {
          const cloudProgress = await getStoryProgressFromFirestore(authState.currentChild.id);
          const localProgress: Record<number, StoryProgress> = {};

          Object.entries(cloudProgress).forEach(([day, progress]) => {
            localProgress[parseInt(day)] = {
              storyId: progress.storyDay,
              status: progress.watched ? 'watched' : 'locked',
              watchedAt: progress.watchedAt?.toDate().toISOString(),
              watchProgress: progress.progressPercent,
            };
          });

          set({ storyProgress: localProgress });
        } catch (error) {
          console.error('Failed to load story progress from cloud:', error);
        }
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
      stars: 0,

      updateStreak: async () => {
        const state = get();
        const todayCompleted = Object.values(state.todayPrayers).filter(Boolean).length;
        const { streakBonus } = state.gamificationSettings;

        // If all 5 prayers completed today, update streak
        if (todayCompleted === 5) {
          const newStreak = state.currentStreak + 1;
          set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            stars: state.stars + streakBonus, // Streak bonus from settings
          });

          // Sync to Firestore
          const authState = useAuthStore.getState();
          if (authState.currentChild && !authState.isDemoMode) {
            try {
              await updateStreakInFirestore(authState.currentChild.id);
            } catch (error) {
              console.error('Failed to update streak in cloud:', error);
            }
          }
        }
      },

      loadStats: async () => {
        const authState = useAuthStore.getState();
        if (!authState.currentChild || authState.isDemoMode) return;

        try {
          const stats = await getUserStats(authState.currentChild.id);
          if (stats) {
            set({
              totalPrayersCompleted: stats.totalPrayers,
              totalStoriesWatched: stats.totalStories,
              currentStreak: stats.currentStreak,
              longestStreak: stats.longestStreak,
              stars: stats.stars,
            });
          }
        } catch (error) {
          console.error('Failed to load stats from cloud:', error);
        }
      },

      // Sync
      isSyncing: false,
      lastSyncAt: null,

      syncToCloud: async () => {
        const state = get();
        const authState = useAuthStore.getState();

        if (!authState.currentChild || authState.isDemoMode) return;

        set({ isSyncing: true });

        try {
          // Convert story progress to the format expected by sync function
          const localStoryProgress: Record<number, { watched: boolean }> = {};
          Object.entries(state.storyProgress).forEach(([day, progress]) => {
            localStoryProgress[parseInt(day)] = {
              watched: progress.status === 'watched',
            };
          });

          await syncLocalDataToCloud(
            authState.currentChild.id,
            state.todayPrayers,
            localStoryProgress
          );

          set({
            isSyncing: false,
            lastSyncAt: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Failed to sync to cloud:', error);
          set({ isSyncing: false });
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
        stars: state.stars,
        prayerTimesLocation: state.prayerTimesLocation,
        notificationsEnabled: state.notificationsEnabled,
        lastSyncAt: state.lastSyncAt,
        // Cache app settings locally for offline support
        ramadanSettings: state.ramadanSettings,
        gamificationSettings: state.gamificationSettings,
      }),
    }
  )
);

export default useStore;
