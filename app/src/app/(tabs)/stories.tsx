/**
 * Stories Screen
 * Grid of 30 daily Ramadan story cards
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StoryCard } from '../../components/stories';
import { useStore } from '../../store';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../constants';
import type { StoryStatus } from '../../types';

// Story titles for 30 days
const STORY_TITLES = [
  "The Night Journey",
  "The First Revelation",
  "Building the Kaaba",
  "Prophet Yusuf's Dream",
  "The Spider's Web",
  "Splitting the Moon",
  "The Sleepers of the Cave",
  "Prophet Musa and Khidr",
  "The Story of Luqman",
  "Prophet Ibrahim's Test",
  "The Queen of Sheba",
  "Prophet Yunus and the Whale",
  "The Boy and the King",
  "The People of the Elephant",
  "Prophet Dawud's Wisdom",
  "The Ant's Warning",
  "Prophet Sulaiman's Kingdom",
  "The Companions of the Garden",
  "Prophet Nuh's Ark",
  "The Patience of Ayyub",
  "Prophet Isa's Miracles",
  "The Story of Maryam",
  "Dhul-Qarnayn's Journey",
  "The People of the Ditch",
  "Prophet Salih and the Camel",
  "The Story of Hud",
  "Prophet Shuaib's Message",
  "The Conquest of Makkah",
  "The Farewell Sermon",
  "Laylatul Qadr",
];

// Gradient colors for each day
const GRADIENT_COLORS: [string, string][] = [
  ['#FF6B6B', '#FF8E8E'],
  ['#4ECDC4', '#6ED7D0'],
  ['#45B7D1', '#6BC5D9'],
  ['#96CEB4', '#AEDBC5'],
  ['#DDA0DD', '#E6B8E6'],
  ['#FF9A8B', '#FFB3A7'],
  ['#A8E6CF', '#BFF0DB'],
  ['#88D8B0', '#A3E4C4'],
  ['#FFEAA7', '#FFF0C4'],
  ['#74B9FF', '#96CAFF'],
  ['#FD79A8', '#FE9ABD'],
  ['#A29BFE', '#B8B3FE'],
  ['#FDCB6E', '#FEDA8E'],
  ['#6C5CE7', '#8B7FED'],
  ['#00B894', '#33C9AC'],
  ['#E17055', '#E88F7A'],
  ['#0984E3', '#3D9FEB'],
  ['#B2BEC3', '#C8D1D5'],
  ['#636E72', '#7D868A'],
  ['#2D3436', '#4A4E50'],
  ['#FF7675', '#FF9594'],
  ['#74B9FF', '#96CAFF'],
  ['#55EFC4', '#7BF4D3'],
  ['#FFEAA7', '#FFF0C4'],
  ['#DFE6E9', '#EBF0F2'],
  ['#FAB1A0', '#FBC4B8'],
  ['#81ECEC', '#A1F1F1'],
  ['#E84393', '#ED6AAB'],
  ['#00CEC9', '#33D9D5'],
  ['#F5B526', '#F8C856'],
];

export default function StoriesScreen() {
  const { currentDay, getStoryStatus, watchStory, totalStoriesWatched } = useStore();

  const handleStoryPress = (dayNumber: number, status: StoryStatus) => {
    if (status === 'locked') {
      Alert.alert(
        'Story Locked',
        `This story will be available on Day ${dayNumber} of Ramadan.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Mark as watched and show the story
    watchStory(dayNumber);
    Alert.alert(
      STORY_TITLES[dayNumber - 1],
      `Day ${dayNumber} story would play here. In the full app, this would open a video player.`,
      [{ text: 'Done' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Daily Stories</Text>
          <Text style={styles.subtitle}>
            30 days of Ramadan adventures
          </Text>
        </View>

        {/* Progress Summary */}
        <View style={styles.progressCard}>
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>{totalStoriesWatched}</Text>
            <Text style={styles.progressLabel}>Watched</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>{30 - totalStoriesWatched}</Text>
            <Text style={styles.progressLabel}>Remaining</Text>
          </View>
          <View style={styles.progressDivider} />
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>Day {currentDay}</Text>
            <Text style={styles.progressLabel}>Current</Text>
          </View>
        </View>

        {/* Story Grid */}
        <View style={styles.grid}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNumber) => {
            const status = getStoryStatus(dayNumber);
            return (
              <StoryCard
                key={dayNumber}
                dayNumber={dayNumber}
                title={STORY_TITLES[dayNumber - 1]}
                status={status}
                gradientColors={GRADIENT_COLORS[dayNumber - 1]}
                onPress={() => handleStoryPress(dayNumber, status)}
              />
            );
          })}
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
  progressCard: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  progressItem: {
    flex: 1,
    alignItems: 'center',
  },
  progressValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.gold,
  },
  progressLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  progressDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
