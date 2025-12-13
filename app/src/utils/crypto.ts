/**
 * Cryptographic utilities for secure data handling
 */

import * as Crypto from 'expo-crypto';

/**
 * Hash a PIN using SHA-256 with a salt
 * @param pin - The 4-digit PIN to hash
 * @param salt - A unique salt (e.g., child ID)
 * @returns The hashed PIN as a hex string
 */
export const hashPin = async (pin: string, salt: string): Promise<string> => {
  const saltedPin = `${salt}:${pin}:salah-buddy-2024`;
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    saltedPin
  );
  return hash;
};

/**
 * Verify a PIN against a stored hash
 * @param pin - The PIN to verify
 * @param salt - The salt used during hashing (e.g., child ID)
 * @param storedHash - The stored hash to compare against
 * @returns True if the PIN matches
 */
export const verifyPin = async (
  pin: string,
  salt: string,
  storedHash: string
): Promise<boolean> => {
  const hash = await hashPin(pin, salt);
  return hash === storedHash;
};

/**
 * Generate a random encryption key for MMKV
 * @returns A random 32-character hex string
 */
export const generateEncryptionKey = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
