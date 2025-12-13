/**
 * Rate Limiter for PIN verification
 * Prevents brute force attacks on child PINs
 */

import { StorageHelpers, StorageKeys } from '../store/storage';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

interface PinAttemptData {
  attempts: number;
  lastAttempt: number;
  lockedUntil: number | null;
}

const PIN_ATTEMPTS_KEY = 'pin_attempts';

/**
 * Get PIN attempt data for a child
 */
const getAttemptData = (childId: string): PinAttemptData => {
  const key = `${PIN_ATTEMPTS_KEY}_${childId}`;
  const data = StorageHelpers.getJSON<PinAttemptData>(key);
  return data || { attempts: 0, lastAttempt: 0, lockedUntil: null };
};

/**
 * Save PIN attempt data for a child
 */
const saveAttemptData = (childId: string, data: PinAttemptData): void => {
  const key = `${PIN_ATTEMPTS_KEY}_${childId}`;
  StorageHelpers.setJSON(key, data);
};

/**
 * Check if PIN verification is allowed (not locked out)
 */
export const canAttemptPin = (childId: string): { allowed: boolean; remainingSeconds?: number } => {
  const data = getAttemptData(childId);
  const now = Date.now();

  // Check if currently locked out
  if (data.lockedUntil && now < data.lockedUntil) {
    const remainingMs = data.lockedUntil - now;
    return {
      allowed: false,
      remainingSeconds: Math.ceil(remainingMs / 1000),
    };
  }

  // Lockout expired, reset
  if (data.lockedUntil && now >= data.lockedUntil) {
    saveAttemptData(childId, { attempts: 0, lastAttempt: 0, lockedUntil: null });
    return { allowed: true };
  }

  return { allowed: true };
};

/**
 * Record a PIN attempt
 * Returns remaining attempts or lockout status
 */
export const recordPinAttempt = (
  childId: string,
  success: boolean
): { locked: boolean; remainingAttempts: number; lockoutSeconds?: number } => {
  const now = Date.now();

  if (success) {
    // Reset on successful attempt
    saveAttemptData(childId, { attempts: 0, lastAttempt: now, lockedUntil: null });
    return { locked: false, remainingAttempts: MAX_ATTEMPTS };
  }

  // Failed attempt
  const data = getAttemptData(childId);
  const newAttempts = data.attempts + 1;

  if (newAttempts >= MAX_ATTEMPTS) {
    // Lock out the user
    const lockedUntil = now + LOCKOUT_DURATION_MS;
    saveAttemptData(childId, { attempts: newAttempts, lastAttempt: now, lockedUntil });
    return {
      locked: true,
      remainingAttempts: 0,
      lockoutSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
    };
  }

  // Record failed attempt
  saveAttemptData(childId, { attempts: newAttempts, lastAttempt: now, lockedUntil: null });
  return { locked: false, remainingAttempts: MAX_ATTEMPTS - newAttempts };
};

/**
 * Clear all PIN attempts for a child (call after successful parent override)
 */
export const clearPinAttempts = (childId: string): void => {
  saveAttemptData(childId, { attempts: 0, lastAttempt: 0, lockedUntil: null });
};
