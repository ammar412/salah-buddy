/**
 * Confetti Animation Component
 * Shows celebratory confetti when triggered
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiPieceProps {
  delay: number;
  color: string;
  startX: number;
}

function ConfettiPiece({ delay, color, startX }: ConfettiPieceProps) {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(startX)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const wobble = Math.random() * 100 - 50; // Random horizontal drift

    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        // Fall down
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT + 50,
          duration: 3000 + Math.random() * 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // Wobble side to side
        Animated.timing(translateX, {
          toValue: startX + wobble,
          duration: 3000 + Math.random() * 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        // Rotate
        Animated.timing(rotate, {
          toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // Fade out near bottom
        Animated.sequence([
          Animated.delay(2500),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          backgroundColor: color,
          transform: [
            { translateX },
            { translateY },
            { rotate: rotateInterpolate },
          ],
          opacity,
        },
      ]}
    />
  );
}

interface ConfettiAnimationProps {
  visible: boolean;
  onComplete?: () => void;
}

const COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#F5B526', // Gold
  '#95E1D3', // Mint
  '#F38181', // Coral
  '#AA96DA', // Purple
  '#FCBAD3', // Pink
];

export function ConfettiAnimation({ visible, onComplete }: ConfettiAnimationProps) {
  const [pieces, setPieces] = React.useState<{ id: number; color: string; startX: number; delay: number }[]>([]);

  useEffect(() => {
    if (visible) {
      // Generate confetti pieces
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        startX: Math.random() * SCREEN_WIDTH,
        delay: Math.random() * 500,
      }));
      setPieces(newPieces);

      // Clear after animation
      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [visible]);

  if (!visible || pieces.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          color={piece.color}
          startX={piece.startX}
          delay={piece.delay}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  confettiPiece: {
    position: 'absolute',
    width: 10,
    height: 20,
    borderRadius: 2,
  },
});

export default ConfettiAnimation;
