/**
 * Root Layout
 * Handles fonts, splash screen, app initialization, and auth routing
 */

import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import { Colors } from '../constants';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  const { initialize, isAuthenticated, isLoading, currentChild, isDemoMode } =
    useAuthStore();
  const { loadAppSettings } = useStore();

  useEffect(() => {
    const setup = async () => {
      try {
        // Load app settings (Ramadan dates, gamification values) first
        await loadAppSettings();
        // Initialize auth state
        await initialize();
      } catch (error) {
        console.error('Failed to initialize:', error);
      }
    };

    setup();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && !isLoading) {
      setAppReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  if (!appReady) {
    return null;
  }

  // Determine initial route based on auth state
  const getInitialRoute = () => {
    if (isDemoMode) {
      return '(tabs)';
    }
    if (!isAuthenticated) {
      return '(auth)/welcome';
    }
    if (!currentChild) {
      return '(auth)/select-child';
    }
    return '(tabs)';
  };

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
