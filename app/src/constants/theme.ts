/**
 * Salah Buddy Theme Constants
 * Spacing, typography, and layout values
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
} as const;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const FontFamily = {
  regular: 'Lexend_400Regular',
  medium: 'Lexend_500Medium',
  semibold: 'Lexend_600SemiBold',
  bold: 'Lexend_700Bold',
} as const;

// Typography alias for consistency across components
export const Typography = {
  fonts: FontFamily,
  sizes: FontSize,
} as const;

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

export const Layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  maxContentWidth: 600,
  tabBarHeight: 80,
  headerHeight: 60,
} as const;

// Prayer card dimensions
export const PrayerCard = {
  width: 70,
  height: 100,
  iconSize: 32,
} as const;

// Story card dimensions
export const StoryCard = {
  width: (SCREEN_WIDTH - Spacing.md * 3) / 2, // 2 columns with padding
  aspectRatio: 1.2, // Height relative to width
} as const;

// Progress calendar
export const CalendarDay = {
  size: 40,
  gap: 8,
} as const;

export const Theme = {
  spacing: Spacing,
  borderRadius: BorderRadius,
  fontSize: FontSize,
  fontWeight: FontWeight,
  fontFamily: FontFamily,
  shadow: Shadow,
  layout: Layout,
  prayerCard: PrayerCard,
  storyCard: StoryCard,
  calendarDay: CalendarDay,
} as const;

export default Theme;
