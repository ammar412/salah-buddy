/**
 * Star Burst Animation Component
 * Shows animated stars bursting when earning points
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

interface StarProps {
  index: number;
  totalStars: number;
  size: number;
}

function AnimatedStar({ index, totalStars, size }: StarProps) {
  const scale = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const angle = (index / totalStars) * Math.PI * 2;
    const distance = 80 + Math.random() * 40;
    const delay = index * 50;

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        // Pop in
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 100,
          useNativeDriver: true,
        }),
        // Move outward
        Animated.timing(translateX, {
          toValue: Math.cos(angle) * distance,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: Math.sin(angle) * distance,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        // Rotate
        Animated.timing(rotate, {
          toValue: 360,
          duration: 800,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      // Fade out
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.star,
        {
          transform: [
            { translateX },
            { translateY },
            { scale },
            { rotate: rotateInterpolate },
          ],
          opacity,
        },
      ]}
    >
      <Text style={[styles.starEmoji, { fontSize: size }]}>⭐</Text>
    </Animated.View>
  );
}

interface StarBurstProps {
  visible: boolean;
  points?: number;
  onComplete?: () => void;
}

export function StarBurst({ visible, points = 10, onComplete }: StarBurstProps) {
  const [show, setShow] = React.useState(false);
  const centerScale = useRef(new Animated.Value(0)).current;
  const centerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShow(true);
      centerScale.setValue(0);
      centerOpacity.setValue(0);

      // Animate center points display
      Animated.sequence([
        Animated.parallel([
          Animated.spring(centerScale, {
            toValue: 1.2,
            friction: 4,
            tension: 100,
            useNativeDriver: true,
          }),
          Animated.timing(centerOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(centerScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(centerOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setShow(false);
        onComplete?.();
      });
    }
  }, [visible]);

  if (!show) return null;

  const starCount = Math.min(Math.max(6, Math.floor(points / 5)), 12);

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Stars */}
      {Array.from({ length: starCount }, (_, i) => (
        <AnimatedStar
          key={i}
          index={i}
          totalStars={starCount}
          size={20 + Math.random() * 10}
        />
      ))}

      {/* Center points display */}
      <Animated.View
        style={[
          styles.centerContainer,
          {
            transform: [{ scale: centerScale }],
            opacity: centerOpacity,
          },
        ]}
      >
        <Text style={styles.pointsText}>+{points}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998,
  },
  star: {
    position: 'absolute',
  },
  starEmoji: {
    fontSize: 24,
  },
  centerContainer: {
    backgroundColor: '#F5B526',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#F5B526',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  pointsText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default StarBurst;
