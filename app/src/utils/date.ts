/**
 * Date utilities - centralized date helpers
 */

/**
 * Get today's date as YYYY-MM-DD string
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get the current Ramadan day (1-30)
 * TODO: Make this configurable via remote config
 */
export const getRamadanDay = (startDate?: Date): number => {
  // Default to 2025 Ramadan start (approximately March 1, 2025)
  const ramadanStart = startDate || new Date('2025-03-01');
  const today = new Date();
  const diffTime = today.getTime() - ramadanStart.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diffDays, 1), 30);
};

/**
 * Format a date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};
