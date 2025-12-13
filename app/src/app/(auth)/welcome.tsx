/**
 * Welcome Screen
 * First screen users see, option to sign up, login, or try demo
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants';
import { useAuthStore } from '../../store/useAuthStore';
import { isFirebaseConfigured } from '../../services/firebase';

export default function WelcomeScreen() {
  const { enableDemoMode } = useAuthStore();

  const handleGetStarted = () => {
    router.push('/(auth)/signup');
  };

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleDemoMode = () => {
    enableDemoMode();
    router.replace('/(tabs)');
  };

  const firebaseReady = isFirebaseConfigured();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Mascot Area */}
        <View style={styles.logoSection}>
          <Text style={styles.emoji}>🌙</Text>
          <Text style={styles.title}>Salah Buddy</Text>
          <Text style={styles.subtitle}>
            Track your prayers during Ramadan{'\n'}and become a prayer champion!
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureRow icon="🕌" text="Track your 5 daily prayers" />
          <FeatureRow icon="📖" text="Watch daily Ramadan stories" />
          <FeatureRow icon="⭐" text="Earn stars and badges" />
          <FeatureRow icon="🏆" text="Compete with family & friends" />
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          {firebaseReady ? (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleGetStarted}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleLogin}
              >
                <Text style={styles.secondaryButtonText}>
                  Already have an account? Sign In
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleDemoMode}
              >
                <Text style={styles.primaryButtonText}>Try Demo Mode</Text>
              </TouchableOpacity>

              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Firebase not configured.{'\n'}
                  Add your config in firebase.ts to enable accounts.
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontSize: 36,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  featureIcon: {
    fontSize: 28,
    width: 40,
  },
  featureText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    flex: 1,
  },
  buttonSection: {
    gap: Spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.sizes.lg,
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  warningBox: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  warningText: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
