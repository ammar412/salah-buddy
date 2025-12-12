# Salah Buddy - React Native Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Convert the HTML prototype (`designs/web-app.html`) into a production-ready React Native mobile app for iOS and Android.

**Architecture:** Expo-managed React Native app with file-based routing (Expo Router), MMKV for fast local storage, and offline-first prayer times using adhan.js. All UI components are pre-designed in the HTML prototype.

**Tech Stack:** Expo SDK 52, TypeScript, Expo Router, MMKV, React Native Reanimated, Expo Video, adhan.js

---

## Phase 1: Project Foundation (Week 1)

### Task 1: Initialize Expo Project

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `app/_layout.tsx`

**Step 1: Create new Expo project**

```bash
npx create-expo-app@latest salah-buddy-app --template tabs
cd salah-buddy-app
```

**Step 2: Install core dependencies**

```bash
npx expo install react-native-mmkv expo-video expo-location @react-native-community/netinfo
npm install adhan zustand
```

**Step 3: Configure app.json**

```json
{
  "expo": {
    "name": "Salah Buddy",
    "slug": "salah-buddy",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F5F0E8"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.luqmay.salahbuddy"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F5F0E8"
      },
      "package": "com.luqmay.salahbuddy"
    },
    "plugins": [
      "expo-location"
    ]
  }
}
```

**Step 4: Verify project runs**

```bash
npx expo start
```

Expected: App opens in Expo Go with default tabs template

**Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize Expo project with tabs template"
```

---

### Task 2: Set Up Design System (Theme & Colors)

**Files:**
- Create: `constants/theme.ts`
- Create: `constants/colors.ts`

**Step 1: Create colors file**

```typescript
// constants/colors.ts
export const Colors = {
  // Luqmay Brand Palette
  cream: '#F5F0E8',
  creamDark: '#EBE4D8',
  gold: '#F5B526',
  goldLight: '#FFE082',
  goldDark: '#E5A516',
  dark: '#1C170D',
  darkSoft: '#3D3527',
  white: '#FFFFFF',
  border: '#E8E0CF',

  // Accent Colors
  green: '#22C55E',
  greenLight: '#86EFAC',
  greenDark: '#16A34A',
  coral: '#FF6B6B',
  coralLight: '#FF8E8E',
  purple: '#A78BFA',
  teal: '#14B8A6',

  // Prayer Colors
  fajr: '#FF9A9E',
  dhuhr: '#4FACFE',
  asr: '#FBC2EB',
  maghrib: '#FA709A',
  isha: '#667EEA',
};

// Story gradient colors (for backgrounds)
export const StoryGradients: Record<number, [string, string]> = {
  1: ['#667eea', '#764ba2'],
  2: ['#4facfe', '#00f2fe'],
  3: ['#fa709a', '#fee140'],
  4: ['#a8edea', '#fed6e3'],
  5: ['#d299c2', '#fef9d7'],
  6: ['#89f7fe', '#66a6ff'],
  7: ['#a18cd1', '#fbc2eb'],
  8: ['#ffecd2', '#fcb69f'],
  9: ['#ff9a9e', '#fecfef'],
  10: ['#a1c4fd', '#c2e9fb'],
  11: ['#f093fb', '#f5576c'],
  12: ['#667eea', '#764ba2'],
  13: ['#ff9a9e', '#fad0c4'],
  14: ['#ffecd2', '#fcb69f'],
  15: ['#fbc2eb', '#a6c1ee'],
  16: ['#fa709a', '#fee140'],
  17: ['#5f72bd', '#9b23ea'],
  18: ['#11998e', '#38ef7d'],
  19: ['#396afc', '#2948ff'],
  20: ['#ee9ca7', '#ffdde1'],
  21: ['#c471f5', '#fa71cd'],
  22: ['#48c6ef', '#6f86d6'],
  23: ['#f78ca0', '#fe9a8b'],
  24: ['#a8caba', '#5d4157'],
  25: ['#ffd89b', '#19547b'],
  26: ['#0f0c29', '#302b63'],
  27: ['#360033', '#0b8793'],
  28: ['#f5af19', '#f12711'],
  29: ['#c33764', '#1d2671'],
  30: ['#ed4264', '#ffedbc'],
};
```

**Step 2: Create theme file**

```typescript
// constants/theme.ts
import { Colors } from './colors';

export const Theme = {
  colors: Colors,

  // Spacing (8px base)
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },

  // Border Radius
  radius: {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  },

  // Typography
  fontSize: {
    sm: 14,
    base: 18,
    lg: 22,
    xl: 28,
    '2xl': 36,
    '3xl': 48,
    '4xl': 64,
  },

  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
  },
};
```

**Step 3: Commit**

```bash
git add constants/
git commit -m "feat: add Luqmay brand design system"
```

---

### Task 3: Set Up Custom Font (Lexend)

**Files:**
- Create: `hooks/useFonts.ts`
- Modify: `app/_layout.tsx`

**Step 1: Install expo-font**

```bash
npx expo install expo-font @expo-google-fonts/lexend
```

**Step 2: Update root layout**

```typescript
// app/_layout.tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts, Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, Lexend_700Bold, Lexend_800ExtraBold } from '@expo-google-fonts/lexend';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
```

**Step 3: Verify fonts load**

```bash
npx expo start
```

Expected: App loads without font errors

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Lexend font family"
```

---

### Task 4: Set Up Bottom Tab Navigation

**Files:**
- Modify: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/index.tsx` (Home)
- Create: `app/(tabs)/stories.tsx`
- Create: `app/(tabs)/progress.tsx`
- Create: `app/(tabs)/leaderboard.tsx`

**Step 1: Configure tab layout**

```typescript
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: Colors.goldDark,
        tabBarInactiveTintColor: Colors.darkSoft,
        tabBarLabelStyle: {
          fontFamily: 'Lexend_500Medium',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏠" />,
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          title: 'Stories',
          tabBarIcon: ({ color }) => <TabIcon emoji="📺" />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => <TabIcon emoji="📊" />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Rank',
          tabBarIcon: ({ color }) => <TabIcon emoji="🏆" />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 24 }}>{emoji}</Text>;
}
```

**Step 2: Create placeholder screens**

```typescript
// app/(tabs)/index.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 24,
    color: Colors.dark,
  },
});
```

**Step 3: Create remaining placeholder screens (stories.tsx, progress.tsx, leaderboard.tsx)**

Same pattern as above, change title text only.

**Step 4: Verify navigation works**

```bash
npx expo start
```

Expected: Bottom tabs navigate between 4 screens

**Step 5: Commit**

```bash
git add .
git commit -m "feat: add bottom tab navigation with 4 screens"
```

---

### Task 5: Set Up MMKV Storage

**Files:**
- Create: `store/storage.ts`
- Create: `store/useStore.ts`

**Step 1: Create storage wrapper**

```typescript
// store/storage.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const StorageKeys = {
  USER_NAME: 'user_name',
  PRAYERS: 'prayers',
  STORIES_WATCHED: 'stories_watched',
  STREAK: 'streak',
  STARS: 'stars',
  LAST_PRAYER_DATE: 'last_prayer_date',
};

// Helper functions
export function getObject<T>(key: string): T | null {
  const value = storage.getString(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function setObject<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}
```

**Step 2: Create Zustand store**

```typescript
// store/useStore.ts
import { create } from 'zustand';
import { storage, StorageKeys, getObject, setObject } from './storage';

interface Prayer {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

interface AppState {
  userName: string;
  todayPrayers: Prayer;
  storiesWatched: number[];
  streak: number;
  stars: number;

  // Actions
  setUserName: (name: string) => void;
  togglePrayer: (prayer: keyof Prayer) => void;
  markStoryWatched: (day: number) => void;
  loadFromStorage: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  userName: 'Ahmad',
  todayPrayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
  storiesWatched: [],
  streak: 0,
  stars: 0,

  setUserName: (name) => {
    storage.set(StorageKeys.USER_NAME, name);
    set({ userName: name });
  },

  togglePrayer: (prayer) => {
    const current = get().todayPrayers;
    const updated = { ...current, [prayer]: !current[prayer] };
    setObject(StorageKeys.PRAYERS, updated);

    // Update stars (+10 per prayer)
    const newStars = get().stars + (updated[prayer] ? 10 : -10);
    storage.set(StorageKeys.STARS, newStars);

    set({ todayPrayers: updated, stars: newStars });
  },

  markStoryWatched: (day) => {
    const watched = [...get().storiesWatched];
    if (!watched.includes(day)) {
      watched.push(day);
      setObject(StorageKeys.STORIES_WATCHED, watched);

      // Add stars for watching story
      const newStars = get().stars + 20;
      storage.set(StorageKeys.STARS, newStars);

      set({ storiesWatched: watched, stars: newStars });
    }
  },

  loadFromStorage: () => {
    const userName = storage.getString(StorageKeys.USER_NAME) || 'Ahmad';
    const prayers = getObject<Prayer>(StorageKeys.PRAYERS) || { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
    const watched = getObject<number[]>(StorageKeys.STORIES_WATCHED) || [];
    const streak = storage.getNumber(StorageKeys.STREAK) || 0;
    const stars = storage.getNumber(StorageKeys.STARS) || 0;

    set({ userName, todayPrayers: prayers, storiesWatched: watched, streak, stars });
  },
}));
```

**Step 3: Commit**

```bash
git add store/
git commit -m "feat: add MMKV storage and Zustand state management"
```

---

## Phase 2: Core Screens (Week 2-3)

### Task 6: Build Home Screen - Header Section

**Files:**
- Modify: `app/(tabs)/index.tsx`
- Create: `components/home/Header.tsx`
- Create: `components/home/QuickStats.tsx`

**Step 1: Create Header component**

```typescript
// components/home/Header.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';

export function Header() {
  const { userName } = useStore();
  const currentDay = 12; // TODO: Calculate from Ramadan start

  return (
    <View style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.title}>
          Assalamu Alaikum, <Text style={styles.name}>{userName}!</Text>
        </Text>
        <Text style={styles.subtitle}>
          Day {currentDay} of Ramadan - Keep up the great work!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
  },
  greeting: {},
  title: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 28,
    color: Colors.dark,
  },
  name: {
    color: Colors.gold,
  },
  subtitle: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 16,
    color: Colors.darkSoft,
    marginTop: 4,
  },
});
```

**Step 2: Create QuickStats component**

```typescript
// components/home/QuickStats.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';

export function QuickStats() {
  const { stars } = useStore();
  const totalPrayers = 57; // TODO: Calculate from history
  const rank = 24; // TODO: Get from leaderboard

  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.value}>{totalPrayers}</Text>
        <Text style={styles.label}>Total Prayers</Text>
      </View>
      <View style={styles.stat}>
        <Text style={[styles.value, { color: Colors.gold }]}>#{rank}</Text>
        <Text style={styles.label}>Your Rank</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  stat: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  value: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 32,
    color: Colors.dark,
  },
  label: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 12,
    color: Colors.darkSoft,
    marginTop: 4,
  },
});
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add Home screen header and quick stats"
```

---

### Task 7: Build Prayer Cards Component

**Files:**
- Create: `components/home/PrayerCard.tsx`
- Create: `components/home/PrayerList.tsx`
- Create: `data/prayers.ts`

**Step 1: Create prayer data**

```typescript
// data/prayers.ts
export interface PrayerInfo {
  id: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  emoji: string;
  defaultTime: string;
}

export const PRAYERS: PrayerInfo[] = [
  { id: 'fajr', name: 'Fajr', emoji: '🌅', defaultTime: '5:12 AM' },
  { id: 'dhuhr', name: 'Dhuhr', emoji: '☀️', defaultTime: '12:30 PM' },
  { id: 'asr', name: 'Asr', emoji: '🌤️', defaultTime: '3:45 PM' },
  { id: 'maghrib', name: 'Maghrib', emoji: '🌇', defaultTime: '6:32 PM' },
  { id: 'isha', name: 'Isha', emoji: '🌙', defaultTime: '8:00 PM' },
];
```

**Step 2: Create PrayerCard component**

```typescript
// components/home/PrayerCard.tsx
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { PrayerInfo } from '@/data/prayers';

interface Props {
  prayer: PrayerInfo;
  isCompleted: boolean;
  isCurrent: boolean;
  onToggle: () => void;
}

export function PrayerCard({ prayer, isCompleted, isCurrent, onToggle }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCompleted && styles.completed,
        isCurrent && styles.current,
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{prayer.emoji}</Text>
      <Text style={styles.name}>{prayer.name}</Text>
      <Text style={styles.time}>{prayer.defaultTime}</Text>
      {isCompleted && <Text style={styles.check}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cream,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  completed: {
    backgroundColor: Colors.greenLight + '40',
    borderColor: Colors.green,
  },
  current: {
    borderColor: Colors.gold,
    borderWidth: 3,
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  name: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 18,
    color: Colors.dark,
    flex: 1,
  },
  time: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 14,
    color: Colors.darkSoft,
    marginRight: 12,
  },
  check: {
    fontSize: 20,
    color: Colors.green,
    backgroundColor: Colors.green,
    color: Colors.white,
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
  },
});
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add PrayerCard component with toggle functionality"
```

---

### Task 8: Build Daily Stories Screen

**Files:**
- Modify: `app/(tabs)/stories.tsx`
- Create: `components/stories/StoryCard.tsx`
- Create: `components/stories/StoryGrid.tsx`
- Create: `data/stories.ts`

**Step 1: Create stories data**

```typescript
// data/stories.ts
export interface Story {
  day: number;
  title: string;
  description: string;
  emoji: string;
  gradientColors: [string, string];
}

export const STORIES: Story[] = [
  { day: 1, title: "What is Salah?", description: "Introduction to the beautiful gift of prayer", emoji: "🕌", gradientColors: ['#667eea', '#764ba2'] },
  { day: 2, title: "Making Wudu", description: "Learn how to prepare for prayer", emoji: "💧", gradientColors: ['#4facfe', '#00f2fe'] },
  { day: 3, title: "The 5 Daily Prayers", description: "Meet Fajr, Dhuhr, Asr, Maghrib & Isha", emoji: "🌅", gradientColors: ['#fa709a', '#fee140'] },
  // ... (all 30 stories from prototype)
  { day: 30, title: "Prayer Forever", description: "Keeping salah in your heart", emoji: "❤️", gradientColors: ['#ed4264', '#ffedbc'] },
];
```

**Step 2: Create StoryCard component**

```typescript
// components/stories/StoryCard.tsx
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { Story } from '@/data/stories';

interface Props {
  story: Story;
  isWatched: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  onPress: () => void;
}

export function StoryCard({ story, isWatched, isCurrent, isLocked, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, isCurrent && styles.current]}
      onPress={isLocked ? undefined : onPress}
      activeOpacity={isLocked ? 1 : 0.7}
      disabled={isLocked}
    >
      <LinearGradient
        colors={story.gradientColors}
        style={styles.thumbnail}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.dayBadge}>
          <Text style={styles.dayText}>Day {story.day}</Text>
        </View>
        <Text style={styles.emoji}>{story.emoji}</Text>
        {isWatched && <Text style={styles.check}>✓</Text>}
        {isLocked && <Text style={styles.lock}>🔒</Text>}
        {!isLocked && !isWatched && <Text style={styles.play}>▶</Text>}
      </LinearGradient>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{story.title}</Text>
        <Text style={styles.duration}>⏱️ 3-5 min</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  current: {
    borderColor: Colors.gold,
    borderWidth: 3,
  },
  thumbnail: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dayText: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 11,
    color: Colors.white,
  },
  emoji: {
    fontSize: 40,
  },
  check: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 16,
    color: Colors.white,
    backgroundColor: Colors.green,
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  lock: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 16,
  },
  play: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    fontSize: 16,
    color: Colors.white,
  },
  content: {
    padding: 12,
  },
  title: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 14,
    color: Colors.dark,
    marginBottom: 4,
  },
  duration: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: Colors.darkSoft,
  },
});
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add Daily Stories screen with story cards"
```

---

### Task 9: Build Progress Screen with Calendar

**Files:**
- Modify: `app/(tabs)/progress.tsx`
- Create: `components/progress/StatsGrid.tsx`
- Create: `components/progress/RamadanCalendar.tsx`

**Step 1: Create StatsGrid component**

```typescript
// components/progress/StatsGrid.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';

export function StatsGrid() {
  const { stars, streak, storiesWatched } = useStore();
  const prayersCompleted = 57; // TODO: calculate from history

  const stats = [
    { emoji: '🕌', value: prayersCompleted, label: 'Prayers Completed' },
    { emoji: '🔥', value: streak, label: 'Day Streak' },
    { emoji: '📺', value: storiesWatched.length, label: 'Stories Watched' },
    { emoji: '⭐', value: stars.toLocaleString(), label: 'Stars Earned' },
  ];

  return (
    <View style={styles.grid}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.stat}>
          <Text style={styles.emoji}>{stat.emoji}</Text>
          <Text style={styles.value}>{stat.value}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  stat: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  value: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 28,
    color: Colors.gold,
  },
  label: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 12,
    color: Colors.darkSoft,
    textAlign: 'center',
    marginTop: 4,
  },
});
```

**Step 2: Create RamadanCalendar component**

```typescript
// components/progress/RamadanCalendar.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';

interface DayData {
  day: number;
  prayersCompleted: number;
}

interface Props {
  currentDay: number;
  daysData: DayData[];
}

export function RamadanCalendar({ currentDay, daysData }: Props) {
  const getDayStyle = (day: number, prayers: number) => {
    if (day > currentDay) return styles.future;
    if (day === currentDay) return styles.today;
    if (prayers === 5) return styles.perfect;
    if (prayers > 0) return styles.partial;
    return styles.missed;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ramadan Calendar</Text>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.green }]} />
            <Text style={styles.legendText}>All 5 prayers</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.gold }]} />
            <Text style={styles.legendText}>Some prayers</Text>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        {Array.from({ length: 30 }, (_, i) => {
          const day = i + 1;
          const data = daysData.find(d => d.day === day) || { day, prayersCompleted: 0 };
          return (
            <TouchableOpacity
              key={day}
              style={[styles.day, getDayStyle(day, data.prayersCompleted)]}
            >
              <Text style={styles.dayNumber}>{day}</Text>
              {day <= currentDay && (
                <Text style={styles.prayerCount}>{data.prayersCompleted}/5</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 20,
    color: Colors.dark,
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 12,
    color: Colors.darkSoft,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  day: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  future: {
    backgroundColor: Colors.creamDark,
  },
  today: {
    backgroundColor: Colors.goldLight,
    borderWidth: 2,
    borderColor: Colors.coral,
  },
  perfect: {
    backgroundColor: Colors.green,
  },
  partial: {
    backgroundColor: Colors.gold,
  },
  missed: {
    backgroundColor: Colors.creamDark,
  },
  dayNumber: {
    fontFamily: 'Lexend_700Bold',
    fontSize: 16,
    color: Colors.dark,
  },
  prayerCount: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 10,
    color: Colors.white,
  },
});
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add Progress screen with stats and calendar"
```

---

### Task 10: Build Leaderboard Screen

**Files:**
- Modify: `app/(tabs)/leaderboard.tsx`
- Create: `components/leaderboard/Podium.tsx`
- Create: `components/leaderboard/RankList.tsx`

*(Similar pattern to above - create podium with top 3, rank list with 4-10+, user position card at bottom)*

**Step 1-3:** Create components following prototype design

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Leaderboard screen with podium and rankings"
```

---

## Phase 3: Features & Polish (Week 4-5)

### Task 11: Add Prayer Times API Integration

**Files:**
- Create: `services/prayerTimes.ts`
- Create: `hooks/usePrayerTimes.ts`

**Step 1: Install adhan.js**

```bash
npm install adhan
```

**Step 2: Create prayer times service**

```typescript
// services/prayerTimes.ts
import { Coordinates, PrayerTimes, CalculationMethod, Madhab } from 'adhan';
import * as Location from 'expo-location';
import { storage } from '@/store/storage';

export async function getPrayerTimes(): Promise<PrayerTimes | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      // Default to Riyadh if no permission
      const coords = new Coordinates(24.7136, 46.6753);
      return new PrayerTimes(coords, new Date(), CalculationMethod.UmmAlQura());
    }

    const location = await Location.getCurrentPositionAsync({});
    const coords = new Coordinates(location.coords.latitude, location.coords.longitude);

    return new PrayerTimes(coords, new Date(), CalculationMethod.UmmAlQura());
  } catch (error) {
    console.error('Error getting prayer times:', error);
    return null;
  }
}

export function formatPrayerTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: add prayer times integration with adhan.js"
```

---

### Task 12: Add Video Player Modal

**Files:**
- Create: `components/VideoModal.tsx`
- Modify: `app/(tabs)/stories.tsx`

**Step 1: Create VideoModal component using expo-video**

```typescript
// components/VideoModal.tsx
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Colors } from '@/constants/colors';
import { Story } from '@/data/stories';

interface Props {
  story: Story | null;
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function VideoModal({ story, visible, onClose, onComplete }: Props) {
  // TODO: Replace with actual video URLs
  const videoSource = 'https://example.com/placeholder.mp4';
  const player = useVideoPlayer(videoSource);

  if (!story) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Day {story.day}: {story.title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.videoContainer}>
          {/* Video placeholder - replace with actual VideoView */}
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>🎬</Text>
            <Text style={styles.placeholderText}>Video Player</Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.storyTitle}>{story.title}</Text>
          <Text style={styles.storyDesc}>{story.description}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  title: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 16,
    color: Colors.white,
    flex: 1,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: Colors.white,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 18,
    color: Colors.white,
  },
  info: {
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  storyTitle: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 24,
    color: Colors.dark,
    marginBottom: 8,
  },
  storyDesc: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 16,
    color: Colors.darkSoft,
  },
});
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add video player modal for stories"
```

---

### Task 13: Add Streak Card with Animation

**Files:**
- Create: `components/home/StreakCard.tsx`

**Step 1: Create animated streak card**

```typescript
// components/home/StreakCard.tsx
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

export function StreakCard() {
  const { streak } = useStore();
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 500 }),
        withTiming(1, { duration: 500 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LinearGradient
      colors={[Colors.coral, Colors.coralLight]}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.label}>Current Streak</Text>
      <Animated.Text style={[styles.value, animatedStyle]}>
        {streak}
      </Animated.Text>
      <Text style={styles.days}>days in a row!</Text>
      <Text style={styles.best}>Personal Best: 15 days</Text>

      {/* Background fire emoji */}
      <Text style={styles.fireEmoji}>🔥</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  label: {
    fontFamily: 'Lexend_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  value: {
    fontFamily: 'Lexend_800ExtraBold',
    fontSize: 72,
    color: Colors.white,
    marginVertical: -8,
  },
  days: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 18,
    color: Colors.white,
  },
  best: {
    fontFamily: 'Lexend_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  fireEmoji: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    fontSize: 150,
    opacity: 0.2,
  },
});
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add animated streak card"
```

---

## Phase 4: Testing & Deployment (Week 6)

### Task 14: Add Unit Tests

**Files:**
- Create: `__tests__/store.test.ts`
- Create: `__tests__/prayerTimes.test.ts`

### Task 15: Build for iOS and Android

**Step 1: Build iOS**

```bash
npx expo build:ios
```

**Step 2: Build Android**

```bash
npx expo build:android
```

### Task 16: Submit to App Stores

- Create Apple Developer account
- Create Google Play Developer account
- Submit apps for review

---

## Summary

| Phase | Tasks | Duration |
|-------|-------|----------|
| 1. Foundation | Project setup, design system, navigation, storage | Week 1 |
| 2. Core Screens | Home, Stories, Progress, Leaderboard | Week 2-3 |
| 3. Features | Prayer times, video player, animations | Week 4-5 |
| 4. Deployment | Testing, builds, app store submission | Week 6 |

**Total Estimated Time:** 6 weeks

**Key Files Reference:**
- HTML Prototype: `designs/web-app.html`
- Design Research: `research/implementation-guide.md`
- Tech Stack: `research/tech-stack-research.html`
