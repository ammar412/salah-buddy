/**
 * Progress Screen
 * 30-day calendar view showing prayer and story completion
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { CalendarDay } from '../../components/progress';
import { useStore } from '../../store';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadow } from '../../constants';

export default function ProgressScreen() {
  const {
    currentDay,
    currentStreak,
    longestStreak,
    totalPrayersCompleted,
    totalStoriesWatched,
    getDayProgress,
  } = useStore();

  // Generate dates for 30 days (simplified - would use actual Ramadan dates)
  const getDayData = (dayNumber: number) => {
    const isToday = dayNumber === currentDay;
    const isFuture = dayNumber > currentDay;

    if (isFuture) {
      return { prayersCompleted: 0, storyWatched: false, isToday, isFuture };
    }

    // Get progress for this day (simplified - would use actual date lookup)
    const progress = getDayProgress(
      new Date(Date.now() - (currentDay - dayNumber) * 86400000)
        .toISOString()
        .split('T')[0]
    );

    return {
      prayersCompleted: progress.prayersCompleted,
      storyWatched: progress.storyWatched,
      isToday,
      isFuture,
    };
  };

  const completedDays = Array.from({ length: currentDay }, (_, i) => i + 1).filter(
    (day) => {
      const data = getDayData(day);
      return data.prayersCompleted === 5 && data.storyWatched;
    }
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Progress</Text>
          <Text style={styles.subtitle}>Track your Ramadan journey</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🏆</Text>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🕌</Text>
            <Text style={styles.statValue}>{totalPrayersCompleted}</Text>
            <Text style={styles.statLabel}>Prayers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📖</Text>
            <Text style={styles.statValue}>{totalStoriesWatched}</Text>
            <Text style={styles.statLabel}>Stories</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statValue}>{completedDays}</Text>
            <Text style={styles.statLabel}>Perfect Days</Text>
          </View>
        </View>

        {/* Calendar Section */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>30-Day Calendar</Text>
          <Text style={styles.sectionSubtitle}>
            Each day shows prayers (dots) and story (📖)
          </Text>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>All prayers + story</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.successLight }]} />
              <Text style={styles.legendText}>All prayers</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.warningLight }]} />
              <Text style={styles.legendText}>Some progress</Text>
            </View>
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarCard}>
            <View style={styles.calendarGrid}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                const data = getDayData(day);
                return (
                  <CalendarDay
                    key={day}
                    day={day}
                    prayersCompleted={data.prayersCompleted}
                    storyWatched={data.storyWatched}
                    isToday={data.isToday}
                    isFuture={data.isFuture}
                  />
                );
              })}
            </View>
          </View>
        </View>

        {/* Motivation Message */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationEmoji}>💪</Text>
          <Text style={styles.motivationText}>
            {currentStreak === 0
              ? "Start your journey today! Complete all prayers and watch today's story."
              : currentStreak < 7
              ? `Great start! ${7 - currentStreak} more days to reach a week!`
              : currentStreak < 15
              ? "Amazing progress! You're halfway through Ramadan!"
              : "Incredible! Keep going strong until the end!"}
          </Text>
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
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xxl,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadow.sm,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.gold,
  },
  statLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  calendarSection: {
    marginTop: Spacing.lg,
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
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  calendarCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    ...Shadow.md,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    ...Shadow.md,
  },
  motivationEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  motivationText: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
});
