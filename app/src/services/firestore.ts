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
  runTransaction,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';
import type { PrayerName } from '../types';
import { getTodayString } from '../utils/date';

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
 * Toggle a prayer completion status using a transaction
 * This ensures prayer and stats are updated atomically
 */
export const togglePrayer = async (
  userId: string,
  prayerName: PrayerName,
  completed: boolean
): Promise<void> => {
  if (isDemoMode) return;

  const db = getFirebaseDb();
  const today = getTodayString();
  const prayerDocId = `${today}_${userId}`;
  const prayerRef = doc(db, 'prayers', prayerDocId);
  const statsRef = doc(db, 'stats', userId);

  await runTransaction(db, async (transaction) => {
    // Read both documents first (required by Firestore transactions)
    const prayerDoc = await transaction.get(prayerRef);
    const statsDoc = await transaction.get(statsRef);

    // Prepare prayer updates
    const prayerUpdates: Record<string, unknown> = {
      [prayerName]: completed,
      updatedAt: serverTimestamp(),
      userId,
      date: today,
    };

    if (completed) {
      prayerUpdates[`${prayerName}Time`] = serverTimestamp();
    } else {
      prayerUpdates[`${prayerName}Time`] = null;
    }

    // Update prayer document
    if (prayerDoc.exists()) {
      transaction.update(prayerRef, prayerUpdates);
    } else {
      // Create new prayer record if doesn't exist
      transaction.set(prayerRef, {
        date: today,
        userId,
        fajr: false,
        dhuhr: false,
        asr: false,
        maghrib: false,
        isha: false,
        ...prayerUpdates,
      });
    }

    // Update stats atomically (only when completing, not when uncompleting)
    if (completed && statsDoc.exists()) {
      transaction.update(statsRef, {
        totalPrayers: increment(1),
        stars: increment(10), // 10 points per prayer
        updatedAt: serverTimestamp(),
      });
    }
  });
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
 * Uses denormalized data (childName, childAvatar stored in stats) to avoid N+1 queries
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

  // Use denormalized data to avoid N+1 queries
  return onSnapshot(q, (snapshot) => {
    const entries: LeaderboardEntry[] = snapshot.docs
      .map((docSnap) => {
        const stats = docSnap.data();
        return {
          userId: docSnap.id,
          name: stats.childName || 'Unknown', // Denormalized field
          avatar: stats.childAvatar || '👤', // Denormalized field
          stars: stats.stars || 0,
          streak: stats.currentStreak || 0,
          familyId,
        };
      });

    callback(entries);
  });
};

/**
 * Calculate and update streak using a transaction to prevent duplicate bonuses
 */
export const updateStreak = async (userId: string): Promise<void> => {
  if (isDemoMode) return;

  const db = getFirebaseDb();
  const statsRef = doc(db, 'stats', userId);
  const today = getTodayString();

  // Check if all prayers completed today first (outside transaction)
  const todayPrayers = await getTodayPrayers(userId);
  if (!todayPrayers) return;

  const allCompleted =
    todayPrayers.fajr &&
    todayPrayers.dhuhr &&
    todayPrayers.asr &&
    todayPrayers.maghrib &&
    todayPrayers.isha;

  if (!allCompleted) return;

  // Use transaction to prevent race conditions and duplicate bonuses
  await runTransaction(db, async (transaction) => {
    const statsSnap = await transaction.get(statsRef);
    if (!statsSnap.exists()) return;

    const stats = statsSnap.data() as UserStats;

    // Already awarded streak bonus for today - don't duplicate
    if (stats.lastPrayerDate === today) {
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];

    let newStreak = 1;

    // Check if continuing streak from yesterday
    if (stats.lastPrayerDate === yesterdayString) {
      newStreak = stats.currentStreak + 1;
    }

    const longestStreak = Math.max(newStreak, stats.longestStreak);

    transaction.update(statsRef, {
      currentStreak: newStreak,
      longestStreak,
      lastPrayerDate: today,
      stars: increment(5), // Streak bonus (only awarded once per day)
      updatedAt: serverTimestamp(),
    });
  });
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
  markStoryWatched,
  updateStoryProgress,
  getStoryProgress,
  getUserStats,
  subscribeToFamilyLeaderboard,
  updateStreak,
  syncLocalDataToCloud,
};
