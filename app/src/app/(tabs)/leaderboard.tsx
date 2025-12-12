/**
 * Leaderboard Screen
 * Shows rankings of friends/family based on prayer completion
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LeaderboardRow } from '../../components/leaderboard';
import { useStore } from '../../store';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadow } from '../../constants';

// Mock leaderboard data (would come from backend in production)
const MOCK_LEADERBOARD = [
  { id: '1', name: 'Ahmed', score: 145, streak: 15, avatar: '👦' },
  { id: '2', name: 'Fatima', score: 142, streak: 14, avatar: '👧' },
  { id: '3', name: 'Omar', score: 138, streak: 12, avatar: '👦' },
  { id: '4', name: 'Aisha', score: 130, streak: 10, avatar: '👧' },
  { id: 'current', name: 'You', score: 125, streak: 8, avatar: '⭐' },
  { id: '5', name: 'Yusuf', score: 120, streak: 7, avatar: '👦' },
  { id: '6', name: 'Mariam', score: 115, streak: 6, avatar: '👧' },
  { id: '7', name: 'Ibrahim', score: 108, streak: 5, avatar: '👦' },
  { id: '8', name: 'Khadijah', score: 100, streak: 4, avatar: '👧' },
  { id: '9', name: 'Hassan', score: 95, streak: 3, avatar: '👦' },
];

type LeaderboardTab = 'friends' | 'family' | 'global';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('friends');
  const { currentStreak, totalPrayersCompleted, totalStoriesWatched } = useStore();

  // Calculate current user's score
  const userScore = totalPrayersCompleted * 2 + totalStoriesWatched * 5 + currentStreak * 3;

  // Update mock data with real user score
  const leaderboardData = MOCK_LEADERBOARD.map((entry) => {
    if (entry.id === 'current') {
      return {
        ...entry,
        score: userScore,
        streak: currentStreak,
      };
    }
    return entry;
  }).sort((a, b) => b.score - a.score);

  // Find current user's rank
  const userRank = leaderboardData.findIndex((e) => e.id === 'current') + 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>Compete with friends & family</Text>
        </View>

        {/* User Rank Card */}
        <View style={styles.rankCard}>
          <View style={styles.rankCardContent}>
            <Text style={styles.rankCardEmoji}>🏆</Text>
            <View style={styles.rankCardInfo}>
              <Text style={styles.rankCardTitle}>Your Rank</Text>
              <Text style={styles.rankCardValue}>#{userRank}</Text>
            </View>
          </View>
          <View style={styles.rankCardDivider} />
          <View style={styles.rankCardContent}>
            <Text style={styles.rankCardEmoji}>⭐</Text>
            <View style={styles.rankCardInfo}>
              <Text style={styles.rankCardTitle}>Your Score</Text>
              <Text style={styles.rankCardValue}>{userScore} pts</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['friends', 'family', 'global'] as LeaderboardTab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Scoring Info */}
        <View style={styles.scoringInfo}>
          <Text style={styles.scoringTitle}>How points work:</Text>
          <View style={styles.scoringRow}>
            <Text style={styles.scoringItem}>🕌 Each prayer = 2 pts</Text>
            <Text style={styles.scoringItem}>📖 Each story = 5 pts</Text>
            <Text style={styles.scoringItem}>🔥 Streak bonus = 3 pts/day</Text>
          </View>
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardList}>
          {leaderboardData.map((entry, index) => (
            <LeaderboardRow
              key={entry.id}
              rank={index + 1}
              name={entry.name}
              score={entry.score}
              streak={entry.streak}
              isCurrentUser={entry.id === 'current'}
              avatar={entry.avatar}
            />
          ))}
        </View>

        {/* Invite Friends */}
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteIcon}>👋</Text>
          <Text style={styles.inviteText}>Invite Friends to Compete</Text>
        </TouchableOpacity>
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
  rankCard: {
    flexDirection: 'row',
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.lg,
  },
  rankCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankCardEmoji: {
    fontSize: 32,
    marginRight: Spacing.sm,
  },
  rankCardInfo: {
    flex: 1,
  },
  rankCardTitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  rankCardValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.textLight,
  },
  rankCardDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: Spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xs,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },
  tabActive: {
    backgroundColor: Colors.gold,
  },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.textLight,
    fontFamily: FontFamily.semibold,
  },
  scoringInfo: {
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  scoringTitle: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  scoringRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  scoringItem: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  leaderboardList: {
    marginBottom: Spacing.lg,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.gold,
    borderStyle: 'dashed',
  },
  inviteIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  inviteText: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.md,
    color: Colors.gold,
  },
});
