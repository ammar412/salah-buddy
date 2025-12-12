/**
 * Salah Buddy Type Definitions
 */

// Prayer types
export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface Prayer {
  id: PrayerName;
  name: string;
  arabicName: string;
  icon: string;
  time?: string;
}

export interface PrayerStatus {
  prayerId: PrayerName;
  date: string; // ISO date string YYYY-MM-DD
  completed: boolean;
  completedAt?: string; // ISO datetime
}

// Story types
export type StoryStatus = 'locked' | 'current' | 'watched';

export interface Story {
  id: number; // Day number 1-30
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
}

export interface StoryProgress {
  storyId: number;
  status: StoryStatus;
  watchedAt?: string; // ISO datetime
  watchProgress?: number; // 0-100 percentage
}

// User types
export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

// Progress types
export interface DayProgress {
  date: string; // ISO date string YYYY-MM-DD
  prayersCompleted: number;
  totalPrayers: number;
  storyWatched: boolean;
  streak: number;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  score: number;
  streak: number;
  isCurrentUser: boolean;
}

// Navigation types
export type TabName = 'home' | 'stories' | 'progress' | 'leaderboard';

// Store types
export interface AppState {
  // User
  user: UserProfile | null;

  // Prayers
  todayPrayers: Record<PrayerName, boolean>;
  prayerHistory: PrayerStatus[];

  // Stories
  currentDay: number;
  storyProgress: Record<number, StoryProgress>;

  // Stats
  currentStreak: number;
  longestStreak: number;
  totalPrayersCompleted: number;
  totalStoriesWatched: number;

  // Settings
  prayerTimesLocation: {
    latitude: number;
    longitude: number;
    city?: string;
  } | null;
  notificationsEnabled: boolean;
}

// API response types
export interface PrayerTimesResponse {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

// Component prop types
export interface PrayerCardProps {
  prayer: Prayer;
  completed: boolean;
  onToggle: () => void;
  time?: string;
}

export interface StoryCardProps {
  story: Story;
  status: StoryStatus;
  dayNumber: number;
  onPress: () => void;
}

export interface ProgressCalendarProps {
  month: number;
  year: number;
  progress: DayProgress[];
}

export interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  onPress?: () => void;
}
