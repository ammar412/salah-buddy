/**
 * Salah Buddy Color Palette
 * Based on Luqmay brand guidelines
 */

export const Colors = {
  // Primary brand colors
  cream: '#F5F0E8',
  gold: '#F5B526',

  // Text colors
  textPrimary: '#1a1a1a',
  textSecondary: '#666666',
  textMuted: '#888888',
  textLight: '#FFFFFF',

  // Background colors
  background: '#F5F0E8',
  cardBackground: '#FFFFFF',
  surfaceLight: '#FAF8F5',

  // Status colors
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  warningLight: '#FFF3E0',
  error: '#F44336',
  errorLight: '#FFEBEE',

  // Prayer status colors
  prayerComplete: '#4CAF50',
  prayerPending: '#E0E0E0',
  prayerMissed: '#F44336',

  // Story card gradient colors
  storyGradients: {
    day1: ['#FF6B6B', '#FF8E8E'],
    day2: ['#4ECDC4', '#6ED7D0'],
    day3: ['#45B7D1', '#6BC5D9'],
    day4: ['#96CEB4', '#AEDBC5'],
    day5: ['#DDA0DD', '#E6B8E6'],
    day6: ['#FF9A8B', '#FFB3A7'],
    day7: ['#A8E6CF', '#BFF0DB'],
    day8: ['#88D8B0', '#A3E4C4'],
    day9: ['#FFEAA7', '#FFF0C4'],
    day10: ['#74B9FF', '#96CAFF'],
    day11: ['#FD79A8', '#FE9ABD'],
    day12: ['#A29BFE', '#B8B3FE'],
    day13: ['#FDCB6E', '#FEDA8E'],
    day14: ['#6C5CE7', '#8B7FED'],
    day15: ['#00B894', '#33C9AC'],
    day16: ['#E17055', '#E88F7A'],
    day17: ['#0984E3', '#3D9FEB'],
    day18: ['#B2BEC3', '#C8D1D5'],
    day19: ['#636E72', '#7D868A'],
    day20: ['#2D3436', '#4A4E50'],
    day21: ['#FF7675', '#FF9594'],
    day22: ['#74B9FF', '#96CAFF'],
    day23: ['#55EFC4', '#7BF4D3'],
    day24: ['#FFEAA7', '#FFF0C4'],
    day25: ['#DFE6E9', '#EBF0F2'],
    day26: ['#FAB1A0', '#FBC4B8'],
    day27: ['#81ECEC', '#A1F1F1'],
    day28: ['#E84393', '#ED6AAB'],
    day29: ['#00CEC9', '#33D9D5'],
    day30: ['#F5B526', '#F8C856'], // Gold for the final day
  } as Record<string, [string, string]>,

  // Rank/leaderboard colors
  rankGold: '#FFD700',
  rankSilver: '#C0C0C0',
  rankBronze: '#CD7F32',

  // UI element colors
  border: '#E0E0E0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',

  // Button states
  buttonPrimary: '#F5B526',
  buttonPrimaryPressed: '#E0A520',
  buttonSecondary: '#FFFFFF',
  buttonDisabled: '#E0E0E0',
} as const;

export type ColorKey = keyof typeof Colors;
