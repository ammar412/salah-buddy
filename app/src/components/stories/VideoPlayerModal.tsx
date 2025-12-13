/**
 * Video Player Modal
 * Full-screen video player for story videos
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Colors, Spacing, Typography } from '../../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerModalProps {
  visible: boolean;
  videoUrl: string;
  title: string;
  dayNumber: number;
  onClose: () => void;
  onComplete: () => void;
  onProgress?: (progress: number) => void;
}

export function VideoPlayerModal({
  visible,
  videoUrl,
  title,
  dayNumber,
  onClose,
  onComplete,
  onProgress,
}: VideoPlayerModalProps) {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (!visible) {
      // Reset state when modal closes
      setIsLoading(true);
      setIsPlaying(false);
      setProgress(0);
      setHasCompleted(false);
    }
  }, [visible]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    setIsLoading(false);
    setIsPlaying(status.isPlaying);

    if (status.durationMillis) {
      setDuration(status.durationMillis);
      const currentProgress = (status.positionMillis / status.durationMillis) * 100;
      setProgress(currentProgress);

      onProgress?.(currentProgress);

      // Mark as complete if watched 90% or more
      if (currentProgress >= 90 && !hasCompleted) {
        setHasCompleted(true);
        onComplete();
      }
    }

    // If video finished playing
    if (status.didJustFinish) {
      onComplete();
    }
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const handleReplay = async () => {
    if (!videoRef.current) return;
    await videoRef.current.setPositionAsync(0);
    await videoRef.current.playAsync();
    setHasCompleted(false);
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.dayLabel}>Day {dayNumber}</Text>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Video Container */}
        <View style={styles.videoContainer}>
          {videoUrl ? (
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={styles.video}
              resizeMode={ResizeMode.CONTAIN}
              useNativeControls={false}
              shouldPlay
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />
          ) : (
            // Placeholder for when no video URL is available
            <View style={styles.placeholderVideo}>
              <Text style={styles.placeholderEmoji}>📖</Text>
              <Text style={styles.placeholderTitle}>{title}</Text>
              <Text style={styles.placeholderText}>
                Story video coming soon!{'\n'}
                For now, imagine the beautiful story of{'\n'}
                {title.toLowerCase()}.
              </Text>
            </View>
          )}

          {isLoading && videoUrl && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading story...</Text>
            </View>
          )}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime((progress / 100) * duration)}
              </Text>
              <Text style={styles.timeText}>
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          {/* Playback Controls */}
          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleReplay}
            >
              <Text style={styles.controlIcon}>Replay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayPause}
            >
              <Text style={styles.playIcon}>{isPlaying ? '⏸️' : '▶️'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={onClose}
            >
              <Text style={styles.controlIcon}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Completion Badge */}
        {hasCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedEmoji}>⭐</Text>
            <Text style={styles.completedText}>Story Complete! +15 stars</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  closeButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  closeButtonText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.primary,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dayLabel: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.xs,
    color: '#999',
  },
  title: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.sizes.lg,
    color: '#FFF',
  },
  placeholder: {
    width: 60,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * (9 / 16), // 16:9 aspect ratio
  },
  placeholderVideo: {
    width: SCREEN_WIDTH - Spacing.xl * 2,
    padding: Spacing.xl,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  placeholderTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.sizes.xl,
    color: '#FFF',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  placeholderText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: '#AAA',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: '#FFF',
    marginTop: Spacing.md,
  },
  controls: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  progressContainer: {
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  timeText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.xs,
    color: '#999',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  controlButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  controlIcon: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: '#999',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 28,
  },
  completedBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -40 }],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 24,
  },
  completedEmoji: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  completedText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.sizes.md,
    color: '#FFF',
  },
});

export default VideoPlayerModal;
