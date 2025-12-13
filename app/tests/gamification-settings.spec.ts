/**
 * Gamification Settings Tests for Salah Buddy
 *
 * TDD: RED phase - These tests verify that gamification values
 * set in admin are correctly loaded and used by the app.
 */

import { test, expect } from '@playwright/test';

test.describe('Gamification Settings', () => {

  test('app loads gamification settings from Firestore', async ({ page }) => {
    // Navigate to the main app
    await page.goto('/app/');
    await page.waitForLoadState('load');

    // Wait for Firebase to initialize
    await page.waitForTimeout(2000);

    // Check that gamificationSettings exists in AppState
    const hasGamificationSettings = await page.evaluate(() => {
      // @ts-ignore - AppState is a global variable in the app
      return typeof window.AppState?.gamificationSettings !== 'undefined';
    });

    expect(hasGamificationSettings).toBe(true);
  });

  test('gamification settings contain expected fields', async ({ page }) => {
    await page.goto('/app/');
    await page.waitForLoadState('load');

    // Wait for Firebase to initialize and load settings
    await page.waitForTimeout(3000);

    // Check that gamificationSettings has the expected fields
    const settings = await page.evaluate(() => {
      // @ts-ignore - AppState is a global variable in the app
      return window.AppState?.gamificationSettings;
    });

    expect(settings).not.toBeNull();
    expect(settings).toHaveProperty('starsPerPrayer');
    expect(settings).toHaveProperty('streakBonus');
    expect(settings).toHaveProperty('storyBonus');
    expect(settings).toHaveProperty('maxDailyStars');
  });

  test('storyBonus value is loaded from Firestore', async ({ page }) => {
    await page.goto('/app/');
    await page.waitForLoadState('load');

    // Wait for Firebase and settings to load
    await page.waitForTimeout(3000);

    // Check that storyBonus is a positive number (default: 15)
    const storyBonus = await page.evaluate(() => {
      // @ts-ignore - AppState is a global variable in the app
      return window.AppState?.gamificationSettings?.storyBonus;
    });

    expect(typeof storyBonus).toBe('number');
    expect(storyBonus).toBeGreaterThan(0);
  });

  test('starsPerPrayer value is loaded from Firestore', async ({ page }) => {
    await page.goto('/app/');
    await page.waitForLoadState('load');

    // Wait for Firebase and settings to load
    await page.waitForTimeout(3000);

    // Check that starsPerPrayer is a positive number
    const starsPerPrayer = await page.evaluate(() => {
      // @ts-ignore - AppState is a global variable in the app
      return window.AppState?.gamificationSettings?.starsPerPrayer;
    });

    expect(typeof starsPerPrayer).toBe('number');
    expect(starsPerPrayer).toBeGreaterThan(0);
  });

});
