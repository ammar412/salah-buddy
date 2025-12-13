/**
 * Home Screen
 * Main dashboard with prayer tracking, daily progress, and animations
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PrayerCard, ProgressRing } from '../../components/home';
import { ConfettiAnimation, StarBurst } from '../../components/animations';
import { useStore } from '../../store';
import { useAuthStore } from '../../store/useAuthStore';
import {
  PRAYERS,
  calculatePrayerTimes,
  formatPrayerTimes,
  getTimeUntilNextPrayer,
  type FormattedPrayerTimes,
} from '../../services/prayerTimes';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadow } from '../../constants';
import type { PrayerName } from '../../types';

export default function HomeScreen() {
  const { todayPrayers, togglePrayer, getTodayProgress, currentStreak, currentDay, stars } = useStore();
  const { currentChild, isDemoMode } = useAuthStore();
  const [prayerTimes, setPrayerTimes] = useState<FormattedPrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ hours: number; minutes: number; prayer: PrayerName } | null>(null);

  // Animation states
  const [showConfetti, setShowConfetti] = useState(false);
  const [showStarBurst, setShowStarBurst] = useState(false);
  const [starBurstPoints, setStarBurstPoints] = useState(10);
  const previousCompleted = useRef(0);

  const { completed, total } = getTodayProgress();

  useEffect(() => {
    // Calculate prayer times
    const times = calculatePrayerTimes();
    setPrayerTimes(formatPrayerTimes(times));

    // Update next prayer countdown
    const updateNextPrayer = () => {
      setNextPrayer(getTimeUntilNextPrayer());
    };
    updateNextPrayer();

    // Update every minute
    const interval = setInterval(updateNextPrayer, 60000);
    return () => clearInterval(interval);
  }, []);

  // Track completion changes for animations
  useEffect(() => {
    if (completed > previousCompleted.current) {
      // Prayer was completed - show star burst
      setStarBurstPoints(10);
      setShowStarBurst(true);

      // If all prayers complete, show confetti
      if (completed === 5) {
        setTimeout(() => {
          setShowConfetti(true);
        }, 500);
      }
    }
    previousCompleted.current = completed;
  }, [completed]);

  const handlePrayerToggle = (prayerId: PrayerName) => {
    togglePrayer(prayerId);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getChildName = () => {
    if (isDemoMode) return 'Demo Kid';
    return currentChild?.name || 'Champion';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Animations */}
      <ConfettiAnimation
        visible={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />
      <StarBurst
        visible={showStarBurst}
        points={starBurstPoints}
        onComplete={() => setShowStarBurst(false)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {getChildName()}!</Text>
            <Text style={styles.title}>Salah Buddy</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.starsBadge}>
              <Text style={styles.starsEmoji}>⭐</Text>
              <Text style={styles.starsCount}>{stars}</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayLabel}>Day</Text>
              <Text style={styles.dayNumber}>{currentDay}</Text>
            </View>
          </View>
        </View>

        {/* Progress Card */}
        <LinearGradient
          colors={[Colors.gold, '#E0A520']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.progressLeft}>
            <Text style={styles.progressTitle}>Today's Progress</Text>
            <Text style={styles.progressSubtitle}>
              {completed === total
                ? 'All prayers complete! 🎉'
                : `${total - completed} prayers remaining`}
            </Text>
            {nextPrayer && completed < total && (
              <View style={styles.nextPrayerContainer}>
                <Text style={styles.nextPrayerLabel}>Next: {nextPrayer.prayer}</Text>
                <Text style={styles.nextPrayerTime}>
                  in {nextPrayer.hours}h {nextPrayer.minutes}m
                </Text>
              </View>
            )}
          </View>
          <View style={styles.progressRight}>
            <ProgressRing completed={completed} total={total} size={100} strokeWidth={10} />
          </View>
        </LinearGradient>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakCount}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
          <Text style={styles.streakMessage}>
            {currentStreak === 0
              ? 'Complete all prayers to start your streak!'
              : currentStreak >= 7
              ? 'Amazing! Keep going! 🌟'
              : 'Keep it up!'}
          </Text>
        </View>

        {/* Prayer Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Prayers</Text>
          <Text style={styles.sectionSubtitle}>Tap to mark as complete (+10 stars each)</Text>
        </View>

        <View style={styles.prayerGrid}>
          {PRAYERS.map((prayer) => (
            <PrayerCard
              key={prayer.id}
              prayer={prayer}
              completed={todayPrayers[prayer.id]}
              onToggle={() => handlePrayerToggle(prayer.id)}
              time={prayerTimes?.[prayer.id]}
            />
          ))}
        </View>

        {/* All Complete Celebration */}
        {completed === 5 && (
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>🏆</Text>
            <Text style={styles.celebrationTitle}>Amazing Work!</Text>
            <Text style={styles.celebrationText}>
              You completed all 5 prayers today. Keep up the great work!
            </Text>
          </View>
        )}

        {/* Daily Story Teaser */}
        <View style={styles.storyTeaser}>
          <Text style={styles.storyTeaserIcon}>📖</Text>
          <View style={styles.storyTeaserContent}>
            <Text style={styles.storyTeaserTitle}>Today's Story</Text>
            <Text style={styles.storyTeaserSubtitle}>
              Day {currentDay}: A new adventure awaits!
            </Text>
          </View>
          <Text style={styles.storyTeaserArrow}>→</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  starsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    gap: 4,
  },
  starsEmoji: {
    fontSize: 16,
  },
  starsCount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.gold,
  },
  dayBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  dayLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  dayNumber: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textLight,
  },
  progressCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    ...Shadow.lg,
  },
  progressLeft: {
    flex: 1,
  },
  progressRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  progressSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: Spacing.sm,
  },
  nextPrayerContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  nextPrayerLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  nextPrayerTime: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  streakIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  streakInfo: {
    marginRight: Spacing.md,
  },
  streakCount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  streakLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  streakMessage: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  sectionHeader: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  prayerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  celebrationCard: {
    backgroundColor: Colors.gold + '20',
    borderWidth: 2,
    borderColor: Colors.gold,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  celebrationEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  celebrationTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.gold,
    marginBottom: Spacing.xs,
  },
  celebrationText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  storyTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    ...Shadow.sm,
  },
  storyTeaserIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  storyTeaserContent: {
    flex: 1,
  },
  storyTeaserTitle: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  storyTeaserSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  storyTeaserArrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.gold,
  },
});
