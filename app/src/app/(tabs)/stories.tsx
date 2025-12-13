/**
 * Stories Screen
 * Grid of 30 daily Ramadan story cards with video player
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StoryCard, VideoPlayerModal } from '../../components/stories';
import { useStore } from '../../store';
import { useAuthStore } from '../../store/useAuthStore';
import { updateStoryProgress } from '../../services/firestore';
import { Colors, Spacing, FontFamily, FontSize, BorderRadius } from '../../constants';
import type { StoryStatus } from '../../types';

// Story data for 30 days
const STORIES = [
  { title: "The Night Journey", videoUrl: "" },
  { title: "The First Revelation", videoUrl: "" },
  { title: "Building the Kaaba", videoUrl: "" },
  { title: "Prophet Yusuf's Dream", videoUrl: "" },
  { title: "The Spider's Web", videoUrl: "" },
  { title: "Splitting the Moon", videoUrl: "" },
  { title: "The Sleepers of the Cave", videoUrl: "" },
  { title: "Prophet Musa and Khidr", videoUrl: "" },
  { title: "The Story of Luqman", videoUrl: "" },
  { title: "Prophet Ibrahim's Test", videoUrl: "" },
  { title: "The Queen of Sheba", videoUrl: "" },
  { title: "Prophet Yunus and the Whale", videoUrl: "" },
  { title: "The Boy and the King", videoUrl: "" },
  { title: "The People of the Elephant", videoUrl: "" },
  { title: "Prophet Dawud's Wisdom", videoUrl: "" },
  { title: "The Ant's Warning", videoUrl: "" },
  { title: "Prophet Sulaiman's Kingdom", videoUrl: "" },
  { title: "The Companions of the Garden", videoUrl: "" },
  { title: "Prophet Nuh's Ark", videoUrl: "" },
  { title: "The Patience of Ayyub", videoUrl: "" },
  { title: "Prophet Isa's Miracles", videoUrl: "" },
  { title: "The Story of Maryam", videoUrl: "" },
  { title: "Dhul-Qarnayn's Journey", videoUrl: "" },
  { title: "The People of the Ditch", videoUrl: "" },
  { title: "Prophet Salih and the Camel", videoUrl: "" },
  { title: "The Story of Hud", videoUrl: "" },
  { title: "Prophet Shuaib's Message", videoUrl: "" },
  { title: "The Conquest of Makkah", videoUrl: "" },
  { title: "The Farewell Sermon", videoUrl: "" },
  { title: "Laylatul Qadr", videoUrl: "" },
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
  const [selectedStory, setSelectedStory] = useState<{
    dayNumber: number;
    title: string;
    videoUrl: string;
  } | null>(null);

  const { currentDay, getStoryStatus, watchStory, totalStoriesWatched, stars } = useStore();
  const { currentChild, isDemoMode } = useAuthStore();

  const handleStoryPress = (dayNumber: number, status: StoryStatus) => {
    if (status === 'locked') {
      Alert.alert(
        'Story Locked',
        `This story will be available on Day ${dayNumber} of Ramadan.`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Open video player
    const story = STORIES[dayNumber - 1];
    setSelectedStory({
      dayNumber,
      title: story.title,
      videoUrl: story.videoUrl,
    });
  };

  const handleVideoClose = () => {
    setSelectedStory(null);
  };

  const handleVideoComplete = () => {
    if (selectedStory) {
      watchStory(selectedStory.dayNumber);
    }
  };

  const handleVideoProgress = async (progress: number) => {
    if (!selectedStory || isDemoMode || !currentChild) return;

    // Update progress in Firestore (debounced, only update every 10%)
    if (progress % 10 < 1) {
      try {
        await updateStoryProgress(currentChild.id, selectedStory.dayNumber, progress);
      } catch (error) {
        console.error('Failed to update story progress:', error);
      }
    }
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
            <Text style={styles.progressValue}>{stars}</Text>
            <Text style={styles.progressLabel}>Stars</Text>
          </View>
        </View>

        {/* Today's Story Highlight */}
        {getStoryStatus(currentDay) !== 'watched' && (
          <View style={styles.todayCard}>
            <Text style={styles.todayLabel}>Today's Story</Text>
            <Text style={styles.todayTitle}>{STORIES[currentDay - 1]?.title}</Text>
            <Text style={styles.todayEmoji}>📖</Text>
          </View>
        )}

        {/* Story Grid */}
        <View style={styles.grid}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNumber) => {
            const status = getStoryStatus(dayNumber);
            return (
              <StoryCard
                key={dayNumber}
                dayNumber={dayNumber}
                title={STORIES[dayNumber - 1]?.title || 'Coming Soon'}
                status={status}
                gradientColors={GRADIENT_COLORS[dayNumber - 1]}
                onPress={() => handleStoryPress(dayNumber, status)}
              />
            );
          })}
        </View>
      </ScrollView>

      {/* Video Player Modal */}
      {selectedStory && (
        <VideoPlayerModal
          visible={true}
          videoUrl={selectedStory.videoUrl}
          title={selectedStory.title}
          dayNumber={selectedStory.dayNumber}
          onClose={handleVideoClose}
          onComplete={handleVideoComplete}
          onProgress={handleVideoProgress}
        />
      )}
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
  todayCard: {
    backgroundColor: Colors.gold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  todayLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.xs,
  },
  todayTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: '#FFF',
    textAlign: 'center',
  },
  todayEmoji: {
    fontSize: 40,
    marginTop: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
