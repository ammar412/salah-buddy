/**
 * App Entry Point
 * Redirects to appropriate screen based on auth state
 */

import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants';
import { useAuthStore } from '../store/useAuthStore';

export default function Index() {
  const { isAuthenticated, currentChild, isDemoMode, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    // Route based on auth state
    if (isDemoMode || (isAuthenticated && currentChild)) {
      // User is ready to use the app
      router.replace('/(tabs)');
    } else if (isAuthenticated && !currentChild) {
      // Logged in but no child selected
      router.replace('/(auth)/select-child');
    } else {
      // Not authenticated
      router.replace('/(auth)/welcome');
    }
  }, [isAuthenticated, currentChild, isDemoMode, isLoading]);

  // Show loading while deciding route
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
