/**
 * Leaderboard Row Component
 * Single row in the leaderboard showing rank, avatar, name, and score
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadow } from '../../constants';

interface LeaderboardRowProps {
  rank: number;
  name: string;
  score: number;
  streak: number;
  isCurrentUser: boolean;
  avatar?: string;
  onPress?: () => void;
}

export function LeaderboardRow({
  rank,
  name,
  score,
  streak,
  isCurrentUser,
  avatar,
  onPress,
}: LeaderboardRowProps) {
  const getRankStyle = () => {
    if (rank === 1) return { backgroundColor: Colors.rankGold };
    if (rank === 2) return { backgroundColor: Colors.rankSilver };
    if (rank === 3) return { backgroundColor: Colors.rankBronze };
    return { backgroundColor: Colors.border };
  };

  const getRankEmoji = () => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.container,
        isCurrentUser && styles.containerCurrentUser,
      ]}
    >
      {/* Rank */}
      <View style={[styles.rankBadge, getRankStyle()]}>
        {getRankEmoji() ? (
          <Text style={styles.rankEmoji}>{getRankEmoji()}</Text>
        ) : (
          <Text style={styles.rankText}>{rank}</Text>
        )}
      </View>

      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatar || name.charAt(0).toUpperCase()}</Text>
      </View>

      {/* Name and Streak */}
      <View style={styles.info}>
        <Text style={[styles.name, isCurrentUser && styles.nameCurrentUser]}>
          {name}
          {isCurrentUser && ' (You)'}
        </Text>
        <View style={styles.streakContainer}>
          <Text style={styles.streakIcon}>🔥</Text>
          <Text style={styles.streakText}>{streak} day streak</Text>
        </View>
      </View>

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.scoreLabel}>pts</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  containerCurrentUser: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  rankEmoji: {
    fontSize: 18,
  },
  rankText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.sm,
    color: Colors.textLight,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textLight,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  nameCurrentUser: {
    color: Colors.gold,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  streakIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  streakText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.gold,
  },
  scoreLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});

export default LeaderboardRow;
