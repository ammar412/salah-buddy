/**
 * App Config Settings Tests for Salah Buddy
 *
 * TDD: RED phase - These tests verify that app configuration
 * (enable/disable, maintenance message, min version) is loaded from Firestore.
 */

import { test, expect } from '@playwright/test';

test.describe('App Config Settings', () => {

  test('app loads appConfig settings from Firestore', async ({ page }) => {
    // Navigate to the main app
    await page.goto('/app/');
    await page.waitForLoadState('load');

    // Wait for Firebase to initialize
    await page.waitForTimeout(2000);

    // Check that appConfig exists in AppState
    const hasAppConfig = await page.evaluate(() => {
      // @ts-ignore - AppState is a global variable in the app
      return typeof window.AppState?.appConfig !== 'undefined';
    });

    expect(hasAppConfig).toBe(true);
  });

  test('appConfig contains expected fields', async ({ page }) => {
    await page.goto('/app/');
    await page.waitForLoadState('load');

    // Wait for Firebase to initialize and load settings
    await page.waitForTimeout(3000);

    // Check that appConfig has the expected fields
    const config = await page.evaluate(() => {
      // @ts-ignore - AppState is a global variable in the app
      return window.AppState?.appConfig;
    });

    expect(config).not.toBeNull();
    expect(config).toHaveProperty('isEnabled');
    expect(config).toHaveProperty('maintenanceMessage');
    expect(config).toHaveProperty('minAppVersion');
  });

  test('isEnabled defaults to true when not configured', async ({ page }) => {
    await page.goto('/app/');
    await page.waitForLoadState('load');

    // Wait for Firebase and settings to load
    await page.waitForTimeout(3000);

    // Check that isEnabled defaults to true
    const isEnabled = await page.evaluate(() => {
      // @ts-ignore - AppState is a global variable in the app
      return window.AppState?.appConfig?.isEnabled;
    });

    expect(isEnabled).toBe(true);
  });


});
