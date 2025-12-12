/**
 * Prayer Card Component
 * Displays a single prayer with toggle functionality
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius, Shadow } from '../../constants';
import type { Prayer } from '../../types';

interface PrayerCardProps {
  prayer: Prayer;
  completed: boolean;
  onToggle: () => void;
  time?: string;
}

export function PrayerCard({ prayer, completed, onToggle, time }: PrayerCardProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Bounce animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onToggle();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.container,
          completed && styles.containerCompleted,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[styles.iconContainer, completed && styles.iconContainerCompleted]}>
          <Text style={styles.icon}>{prayer.icon}</Text>
        </View>
        <Text style={[styles.name, completed && styles.nameCompleted]}>
          {prayer.name}
        </Text>
        {time && (
          <Text style={[styles.time, completed && styles.timeCompleted]}>
            {time}
          </Text>
        )}
        <View style={[styles.checkbox, completed && styles.checkboxCompleted]}>
          {completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 70,
    alignItems: 'center',
    padding: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    ...Shadow.md,
  },
  containerCompleted: {
    backgroundColor: Colors.successLight,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  iconContainerCompleted: {
    backgroundColor: Colors.success,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    fontFamily: FontFamily.semibold,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  nameCompleted: {
    color: Colors.success,
  },
  time: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  timeCompleted: {
    color: Colors.success,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkmark: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PrayerCard;
