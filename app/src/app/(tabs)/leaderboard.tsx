/**
 * Leaderboard Screen
 * Shows real-time rankings of family members based on stars earned
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LeaderboardRow } from '../../components/leaderboard';
import { useStore } from '../../store';
import { useAuthStore } from '../../store/useAuthStore';
import { subscribeToFamilyLeaderboard, LeaderboardEntry } from '../../services/firestore';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadow } from '../../constants';

// Demo leaderboard data (used when Firebase not configured)
const DEMO_LEADERBOARD = [
  { userId: '1', name: 'Ahmed', stars: 145, streak: 15, avatar: '👦', familyId: 'demo' },
  { userId: '2', name: 'Fatima', stars: 142, streak: 14, avatar: '👧', familyId: 'demo' },
  { userId: '3', name: 'Omar', stars: 138, streak: 12, avatar: '👦', familyId: 'demo' },
  { userId: '4', name: 'Aisha', stars: 130, streak: 10, avatar: '👧', familyId: 'demo' },
  { userId: 'demo-child', name: 'Demo Kid', stars: 125, streak: 8, avatar: '😊', familyId: 'demo' },
  { userId: '5', name: 'Yusuf', stars: 120, streak: 7, avatar: '👦', familyId: 'demo' },
];

type LeaderboardTab = 'family' | 'global';

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('family');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { currentStreak, stars } = useStore();
  const { familyId, currentChild, isDemoMode } = useAuthStore();

  // Subscribe to real-time leaderboard
  useEffect(() => {
    if (isDemoMode) {
      // Use demo data with user's actual stats
      const demoData = DEMO_LEADERBOARD.map((entry) => {
        if (entry.userId === 'demo-child') {
          return { ...entry, stars, streak: currentStreak };
        }
        return entry;
      }).sort((a, b) => b.stars - a.stars);

      setLeaderboard(demoData);
      setIsLoading(false);
      return;
    }

    if (!familyId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const unsubscribe = subscribeToFamilyLeaderboard(familyId, (entries) => {
      setLeaderboard(entries);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [familyId, isDemoMode, stars, currentStreak]);

  // Calculate user's rank
  const userRank = currentChild
    ? leaderboard.findIndex((e) => e.userId === currentChild.id) + 1
    : 0;

  const userStars = currentChild
    ? leaderboard.find((e) => e.userId === currentChild.id)?.stars || stars
    : stars;

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
          <Text style={styles.subtitle}>Compete with your family</Text>
        </View>

        {/* User Rank Card */}
        <View style={styles.rankCard}>
          <View style={styles.rankCardContent}>
            <Text style={styles.rankCardEmoji}>🏆</Text>
            <View style={styles.rankCardInfo}>
              <Text style={styles.rankCardTitle}>Your Rank</Text>
              <Text style={styles.rankCardValue}>
                {userRank > 0 ? `#${userRank}` : '-'}
              </Text>
            </View>
          </View>
          <View style={styles.rankCardDivider} />
          <View style={styles.rankCardContent}>
            <Text style={styles.rankCardEmoji}>⭐</Text>
            <View style={styles.rankCardInfo}>
              <Text style={styles.rankCardTitle}>Your Stars</Text>
              <Text style={styles.rankCardValue}>{userStars}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['family', 'global'] as LeaderboardTab[]).map((tab) => (
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
          <Text style={styles.scoringTitle}>How to earn stars:</Text>
          <View style={styles.scoringRow}>
            <Text style={styles.scoringItem}>🕌 Each prayer = 10 stars</Text>
            <Text style={styles.scoringItem}>📖 Each story = 15 stars</Text>
            <Text style={styles.scoringItem}>🔥 All 5 prayers = +5 bonus</Text>
          </View>
        </View>

        {/* Leaderboard List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.loadingText}>Loading leaderboard...</Text>
          </View>
        ) : leaderboard.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.emptyTitle}>No Family Members Yet</Text>
            <Text style={styles.emptyText}>
              Add more children to your family to see them on the leaderboard!
            </Text>
          </View>
        ) : (
          <View style={styles.leaderboardList}>
            {leaderboard.map((entry, index) => (
              <LeaderboardRow
                key={entry.userId}
                rank={index + 1}
                name={entry.name}
                score={entry.stars}
                streak={entry.streak}
                isCurrentUser={currentChild?.id === entry.userId}
                avatar={entry.avatar}
              />
            ))}
          </View>
        )}

        {/* Global Tab Coming Soon */}
        {activeTab === 'global' && (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonEmoji}>🌍</Text>
            <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
            <Text style={styles.comingSoonText}>
              Global leaderboard will be available in a future update.
            </Text>
          </View>
        )}

        {/* Invite Family */}
        <TouchableOpacity style={styles.inviteButton}>
          <Text style={styles.inviteIcon}>👋</Text>
          <Text style={styles.inviteText}>Invite Family Members</Text>
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  leaderboardList: {
    marginBottom: Spacing.lg,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  comingSoonEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  comingSoonTitle: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  comingSoonText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
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
