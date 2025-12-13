/**
 * Admin Settings Tests for Salah Buddy
 *
 * Tests the admin panel Settings link visibility
 */

import { test, expect } from '@playwright/test';

test.describe('Admin Panel: Settings Navigation', () => {

  test('Settings link exists on admin index page', async ({ page }) => {
    // Go to admin panel
    await page.goto('/admin/');
    await page.waitForLoadState('load');

    // Wait for sidebar to render (Settings button)
    const settingsButton = page.getByRole('button', { name: /Settings/i });
    await expect(settingsButton).toBeVisible({ timeout: 15000 });
  });

  test('Settings link exists on Users page', async ({ page }) => {
    // Go directly to users page
    await page.goto('/admin/users');
    await page.waitForLoadState('load');

    // Wait for users page content to render
    await expect(page.getByText(/User Management/i)).toBeVisible({ timeout: 15000 });

    // Settings link should exist in sidebar
    const settingsLink = page.locator('a[href*="settings"]');
    await expect(settingsLink).toBeVisible({ timeout: 10000 });

    // Verify Settings link has correct href
    await expect(settingsLink).toHaveAttribute('href', /settings/);
  });

});
