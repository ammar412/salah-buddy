/**
 * Firestore Data Service
 * Handles prayer tracking, story progress, and sync with cloud
 */

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';
import type { PrayerName } from '../types';

// Types
export interface PrayerRecord {
  date: string;
  userId: string;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  fajrTime?: Timestamp;
  dhuhrTime?: Timestamp;
  asrTime?: Timestamp;
  maghribTime?: Timestamp;
  ishaTime?: Timestamp;
  updatedAt: Timestamp;
}

export interface StoryProgress {
  userId: string;
  storyDay: number;
  watched: boolean;
  progressPercent: number;
  watchedAt?: Timestamp;
}

export interface UserStats {
  userId: string;
  familyId: string;
  totalPrayers: number;
  totalStories: number;
  currentStreak: number;
  longestStreak: number;
  stars: number;
  lastPrayerDate?: string;
  updatedAt: Timestamp;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  stars: number;
  streak: number;
  familyId: string;
}

const isDemoMode = !isFirebaseConfigured();

// Helper to get today's date string
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get or create today's prayer record
 */
export const getTodayPrayers = async (
  userId: string
): Promise<PrayerRecord | null> => {
  if (isDemoMode) return null;

  const db = getFirebaseDb();
  const today = getTodayString();
  const docId = `${today}_${userId}`;
  const docRef = doc(db, 'prayers', docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as PrayerRecord;
  }

  // Create new record for today
  const newRecord: Partial<PrayerRecord> = {
    date: today,
    userId,
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
    updatedAt: serverTimestamp() as Timestamp,
  };

  await setDoc(docRef, newRecord);
  return newRecord as PrayerRecord;
};

/**
 * Toggle a prayer completion status
 */
export const togglePrayer = async (
  userId: string,
  prayerName: PrayerName,
  completed: boolean
): Promise<void> => {
  if (isDemoMode) return;

  const db = getFirebaseDb();
  const today = getTodayString();
  const docId = `${today}_${userId}`;
  const docRef = doc(db, 'prayers', docId);

  const updates: Record<string, unknown> = {
    [prayerName]: completed,
    updatedAt: serverTimestamp(),
  };

  if (completed) {
    updates[`${prayerName}Time`] = serverTimestamp();
  }

  await updateDoc(docRef, updates);

  // Update stats
  await updateStatsOnPrayerChange(userId, completed);
};

/**
 * Update user stats when prayer changes
 */
const updateStatsOnPrayerChange = async (
  userId: string,
  added: boolean
): Promise<void> => {
  const db = getFirebaseDb();
  const statsRef = doc(db, 'stats', userId);

  await updateDoc(statsRef, {
    totalPrayers: increment(added ? 1 : -1),
    stars: increment(added ? 10 : -10), // 10 points per prayer
    updatedAt: serverTimestamp(),
  });
};

/**
 * Get prayer history for a user
 */
export const getPrayerHistory = async (
  userId: string,
  days: number = 30
): Promise<PrayerRecord[]> => {
  if (isDemoMode) return [];

  const db = getFirebaseDb();
  const prayersRef = collection(db, 'prayers');
  const q = query(
    prayersRef,
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(days)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as PrayerRecord);
};

/**
 * Mark a story as watched
 */
export const markStoryWatched = async (
  userId: string,
  storyDay: number
): Promise<void> => {
  if (isDemoMode) return;

  const db = getFirebaseDb();
  const docId = `${userId}_${storyDay}`;
  const docRef = doc(db, 'storyProgress', docId);

  await setDoc(docRef, {
    userId,
    storyDay,
    watched: true,
    progressPercent: 100,
    watchedAt: serverTimestamp(),
  });

  // Update stats
  const statsRef = doc(db, 'stats', userId);
  await updateDoc(statsRef, {
    totalStories: increment(1),
    stars: increment(15), // 15 points per story
    updatedAt: serverTimestamp(),
  });
};

/**
 * Update story watch progress
 */
export const updateStoryProgress = async (
  userId: string,
  storyDay: number,
  progressPercent: number
): Promise<void> => {
  if (isDemoMode) return;

  const db = getFirebaseDb();
  const docId = `${userId}_${storyDay}`;
  const docRef = doc(db, 'storyProgress', docId);

  await setDoc(
    docRef,
    {
      userId,
      storyDay,
      progressPercent,
      watched: progressPercent >= 90,
      ...(progressPercent >= 90 ? { watchedAt: serverTimestamp() } : {}),
    },
    { merge: true }
  );
};

/**
 * Get story progress for a user
 */
export const getStoryProgress = async (
  userId: string
): Promise<Record<number, StoryProgress>> => {
  if (isDemoMode) return {};

  const db = getFirebaseDb();
  const progressRef = collection(db, 'storyProgress');
  const q = query(progressRef, where('userId', '==', userId));

  const snapshot = await getDocs(q);
  const progress: Record<number, StoryProgress> = {};

  snapshot.docs.forEach(doc => {
    const data = doc.data() as StoryProgress;
    progress[data.storyDay] = data;
  });

  return progress;
};

/**
 * Get user stats
 */
export const getUserStats = async (userId: string): Promise<UserStats | null> => {
  if (isDemoMode) return null;

  const db = getFirebaseDb();
  const statsRef = doc(db, 'stats', userId);
  const statsSnap = await getDoc(statsRef);

  if (!statsSnap.exists()) {
    return null;
  }

  return statsSnap.data() as UserStats;
};

/**
 * Subscribe to real-time family leaderboard
 */
export const subscribeToFamilyLeaderboard = (
  familyId: string,
  callback: (entries: LeaderboardEntry[]) => void
): (() => void) => {
  if (isDemoMode) {
    callback([]);
    return () => {};
  }

  const db = getFirebaseDb();
  const statsRef = collection(db, 'stats');
  const q = query(
    statsRef,
    where('familyId', '==', familyId),
    orderBy('stars', 'desc'),
    limit(20)
  );

  return onSnapshot(q, async (snapshot) => {
    const entries: LeaderboardEntry[] = [];

    for (const docSnap of snapshot.docs) {
      const stats = docSnap.data() as UserStats;

      // Get child profile info
      const childRef = doc(db, 'families', familyId, 'children', docSnap.id);
      const childSnap = await getDoc(childRef);

      if (childSnap.exists()) {
        const childData = childSnap.data();
        entries.push({
          userId: docSnap.id,
          name: childData.name,
          avatar: childData.avatar,
          stars: stats.stars,
          streak: stats.currentStreak,
          familyId,
        });
      }
    }

    callback(entries);
  });
};

/**
 * Calculate and update streak
 */
export const updateStreak = async (userId: string): Promise<void> => {
  if (isDemoMode) return;

  const db = getFirebaseDb();
  const statsRef = doc(db, 'stats', userId);
  const statsSnap = await getDoc(statsRef);

  if (!statsSnap.exists()) return;

  const stats = statsSnap.data() as UserStats;
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  // Check if all prayers completed today
  const todayPrayers = await getTodayPrayers(userId);
  if (!todayPrayers) return;

  const allCompleted =
    todayPrayers.fajr &&
    todayPrayers.dhuhr &&
    todayPrayers.asr &&
    todayPrayers.maghrib &&
    todayPrayers.isha;

  if (allCompleted) {
    let newStreak = 1;

    // Check if continuing streak from yesterday
    if (stats.lastPrayerDate === yesterdayString) {
      newStreak = stats.currentStreak + 1;
    }

    const longestStreak = Math.max(newStreak, stats.longestStreak);

    await updateDoc(statsRef, {
      currentStreak: newStreak,
      longestStreak,
      lastPrayerDate: today,
      stars: increment(5), // Streak bonus
      updatedAt: serverTimestamp(),
    });
  }
};

/**
 * Batch sync local data to Firestore
 */
export const syncLocalDataToCloud = async (
  userId: string,
  localPrayers: Record<PrayerName, boolean>,
  localStoryProgress: Record<number, { watched: boolean }>
): Promise<void> => {
  if (isDemoMode) return;

  const db = getFirebaseDb();
  const batch = writeBatch(db);

  // Sync today's prayers
  const today = getTodayString();
  const prayerDocId = `${today}_${userId}`;
  const prayerRef = doc(db, 'prayers', prayerDocId);

  batch.set(prayerRef, {
    date: today,
    userId,
    ...localPrayers,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  // Sync story progress
  for (const [storyDay, progress] of Object.entries(localStoryProgress)) {
    if (progress.watched) {
      const storyDocId = `${userId}_${storyDay}`;
      const storyRef = doc(db, 'storyProgress', storyDocId);
      batch.set(storyRef, {
        userId,
        storyDay: parseInt(storyDay),
        watched: true,
        progressPercent: 100,
        watchedAt: serverTimestamp(),
      }, { merge: true });
    }
  }

  await batch.commit();
};

export default {
  getTodayPrayers,
  togglePrayer,
  getPrayerHistory,
  markStoryWatched,
  updateStoryProgress,
  getStoryProgress,
  getUserStats,
  subscribeToFamilyLeaderboard,
  updateStreak,
  syncLocalDataToCloud,
};
