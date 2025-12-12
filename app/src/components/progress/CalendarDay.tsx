/**
 * Calendar Day Component
 * Single day cell in the progress calendar
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, BorderRadius } from '../../constants';

interface CalendarDayProps {
  day: number;
  prayersCompleted: number;
  storyWatched: boolean;
  isToday: boolean;
  isFuture: boolean;
  onPress?: () => void;
}

export function CalendarDay({
  day,
  prayersCompleted,
  storyWatched,
  isToday,
  isFuture,
  onPress,
}: CalendarDayProps) {
  const isPerfect = prayersCompleted === 5 && storyWatched;
  const hasProgress = prayersCompleted > 0 || storyWatched;

  const getBackgroundColor = () => {
    if (isFuture) return Colors.surfaceLight;
    if (isPerfect) return Colors.success;
    if (prayersCompleted === 5) return Colors.successLight;
    if (hasProgress) return Colors.warningLight;
    return Colors.cardBackground;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isFuture}
      activeOpacity={0.7}
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        isToday && styles.todayBorder,
        isFuture && styles.futureDim,
      ]}
    >
      <Text
        style={[
          styles.dayNumber,
          isPerfect && styles.dayNumberPerfect,
          isFuture && styles.dayNumberFuture,
        ]}
      >
        {day}
      </Text>

      {!isFuture && (
        <View style={styles.indicators}>
          {/* Prayer dots */}
          <View style={styles.prayerDots}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i <= prayersCompleted ? styles.dotFilled : styles.dotEmpty,
                ]}
              />
            ))}
          </View>

          {/* Story indicator */}
          {storyWatched && <Text style={styles.storyIcon}>📖</Text>}
        </View>
      )}

      {isPerfect && <Text style={styles.perfectIcon}>⭐</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 56,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  todayBorder: {
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  futureDim: {
    opacity: 0.5,
  },
  dayNumber: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  dayNumberPerfect: {
    color: Colors.textLight,
  },
  dayNumberFuture: {
    color: Colors.textMuted,
  },
  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  prayerDots: {
    flexDirection: 'row',
    gap: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotFilled: {
    backgroundColor: Colors.success,
  },
  dotEmpty: {
    backgroundColor: Colors.border,
  },
  storyIcon: {
    fontSize: 8,
    marginLeft: 2,
  },
  perfectIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 12,
  },
});

export default CalendarDay;
