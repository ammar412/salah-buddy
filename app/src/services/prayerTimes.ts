/**
 * Prayer Times Service
 * Uses adhan.js for offline prayer time calculations
 */

import {
  PrayerTimes,
  CalculationMethod,
  Coordinates,
  CalculationParameters,
} from 'adhan';
import type { PrayerName } from '../types';

export interface PrayerTimesResult {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface FormattedPrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Default to Riyadh coordinates
const DEFAULT_COORDINATES = {
  latitude: 24.7136,
  longitude: 46.6753,
};

/**
 * Calculate prayer times for a given date and location
 */
export function calculatePrayerTimes(
  date: Date = new Date(),
  latitude: number = DEFAULT_COORDINATES.latitude,
  longitude: number = DEFAULT_COORDINATES.longitude
): PrayerTimesResult {
  const coordinates = new Coordinates(latitude, longitude);

  // Use Umm Al-Qura calculation method (Saudi Arabia)
  const params: CalculationParameters = CalculationMethod.UmmAlQura();

  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return {
    fajr: prayerTimes.fajr,
    sunrise: prayerTimes.sunrise,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
  };
}

/**
 * Format prayer times to readable strings (12-hour format)
 */
export function formatPrayerTimes(times: PrayerTimesResult): FormattedPrayerTimes {
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return {
    fajr: formatTime(times.fajr),
    sunrise: formatTime(times.sunrise),
    dhuhr: formatTime(times.dhuhr),
    asr: formatTime(times.asr),
    maghrib: formatTime(times.maghrib),
    isha: formatTime(times.isha),
  };
}

/**
 * Get the current prayer based on the time
 */
export function getCurrentPrayer(
  latitude: number = DEFAULT_COORDINATES.latitude,
  longitude: number = DEFAULT_COORDINATES.longitude
): PrayerName | null {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.UmmAlQura();
  const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

  const currentPrayer = prayerTimes.currentPrayer();

  // Map adhan.js prayer names to our PrayerName type
  const prayerMap: Record<string, PrayerName> = {
    fajr: 'fajr',
    dhuhr: 'dhuhr',
    asr: 'asr',
    maghrib: 'maghrib',
    isha: 'isha',
  };

  return prayerMap[currentPrayer] || null;
}

/**
 * Get the next prayer time
 */
export function getNextPrayer(
  latitude: number = DEFAULT_COORDINATES.latitude,
  longitude: number = DEFAULT_COORDINATES.longitude
): { name: PrayerName; time: Date } | null {
  const coordinates = new Coordinates(latitude, longitude);
  const params = CalculationMethod.UmmAlQura();
  const prayerTimes = new PrayerTimes(coordinates, new Date(), params);

  const nextPrayer = prayerTimes.nextPrayer();

  const prayerMap: Record<string, PrayerName> = {
    fajr: 'fajr',
    dhuhr: 'dhuhr',
    asr: 'asr',
    maghrib: 'maghrib',
    isha: 'isha',
  };

  const name = prayerMap[nextPrayer];
  if (!name) return null;

  const timeMap: Record<PrayerName, Date> = {
    fajr: prayerTimes.fajr,
    dhuhr: prayerTimes.dhuhr,
    asr: prayerTimes.asr,
    maghrib: prayerTimes.maghrib,
    isha: prayerTimes.isha,
  };

  return { name, time: timeMap[name] };
}

/**
 * Get time remaining until next prayer
 */
export function getTimeUntilNextPrayer(
  latitude?: number,
  longitude?: number
): { hours: number; minutes: number; prayer: PrayerName } | null {
  const next = getNextPrayer(latitude, longitude);
  if (!next) return null;

  const now = new Date();
  const diff = next.time.getTime() - now.getTime();

  if (diff < 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, prayer: next.name };
}

// Prayer metadata
export const PRAYERS = [
  { id: 'fajr' as PrayerName, name: 'Fajr', arabicName: 'الفجر', icon: '🌅' },
  { id: 'dhuhr' as PrayerName, name: 'Dhuhr', arabicName: 'الظهر', icon: '☀️' },
  { id: 'asr' as PrayerName, name: 'Asr', arabicName: 'العصر', icon: '🌤️' },
  { id: 'maghrib' as PrayerName, name: 'Maghrib', arabicName: 'المغرب', icon: '🌅' },
  { id: 'isha' as PrayerName, name: 'Isha', arabicName: 'العشاء', icon: '🌙' },
];

export default {
  calculatePrayerTimes,
  formatPrayerTimes,
  getCurrentPrayer,
  getNextPrayer,
  getTimeUntilNextPrayer,
  PRAYERS,
};
