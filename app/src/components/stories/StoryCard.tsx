/**
 * Story Card Component
 * Displays a single story card with locked/current/watched states
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadow } from '../../constants';
import type { StoryStatus } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - Spacing.md * 3) / 2;

interface StoryCardProps {
  dayNumber: number;
  title: string;
  status: StoryStatus;
  onPress: () => void;
  gradientColors: [string, string];
}

export function StoryCard({
  dayNumber,
  title,
  status,
  onPress,
  gradientColors,
}: StoryCardProps) {
  const isLocked = status === 'locked';
  const isWatched = status === 'watched';
  const isCurrent = status === 'current';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
      style={styles.container}
    >
      <LinearGradient
        colors={isLocked ? [Colors.border, '#D0D0D0'] : gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, isLocked && styles.cardLocked]}
      >
        {/* Day Badge */}
        <View style={[styles.dayBadge, isLocked && styles.dayBadgeLocked]}>
          <Text style={[styles.dayText, isLocked && styles.dayTextLocked]}>
            Day {dayNumber}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {isLocked ? (
            <>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockedText}>Locked</Text>
            </>
          ) : (
            <>
              <Text style={styles.playIcon}>{isWatched ? '✓' : '▶'}</Text>
              <Text style={styles.title} numberOfLines={2}>
                {title}
              </Text>
            </>
          )}
        </View>

        {/* Status Indicator */}
        {isCurrent && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentText}>NEW</Text>
          </View>
        )}
        {isWatched && (
          <View style={styles.watchedBadge}>
            <Text style={styles.watchedText}>✓</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: Spacing.md,
  },
  card: {
    width: '100%',
    aspectRatio: 0.85,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    justifyContent: 'space-between',
    ...Shadow.md,
  },
  cardLocked: {
    opacity: 0.7,
  },
  dayBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  dayBadgeLocked: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dayText: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
    color: Colors.textLight,
  },
  dayTextLocked: {
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  lockedText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  playIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
    color: Colors.textLight,
  },
  title: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.sm,
    color: Colors.textLight,
    textAlign: 'center',
  },
  currentBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.gold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  currentText: {
    fontFamily: FontFamily.bold,
    fontSize: 10,
    color: Colors.textLight,
  },
  watchedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.success,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watchedText: {
    fontFamily: FontFamily.bold,
    fontSize: 12,
    color: Colors.textLight,
  },
});

export default StoryCard;
