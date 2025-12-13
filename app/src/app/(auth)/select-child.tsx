/**
 * Select Child Screen
 * Choose which child profile to use
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants';
import { useAuthStore } from '../../store/useAuthStore';
import type { ChildProfile } from '../../services/auth';

export default function SelectChildScreen() {
  const { children, isParent, logout } = useAuthStore();

  const handleSelectChild = (child: ChildProfile) => {
    // Navigate to PIN entry
    router.push({
      pathname: '/(auth)/enter-pin',
      params: { childId: child.id, childName: child.name, childAvatar: child.avatar },
    });
  };

  const handleAddAnother = () => {
    router.push('/(auth)/add-child');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Who's Playing?</Text>
          <Text style={styles.subtitle}>Select your profile to continue</Text>
        </View>

        {/* Child Profiles */}
        <View style={styles.profileGrid}>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={styles.profileCard}
              onPress={() => handleSelectChild(child)}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>{child.avatar}</Text>
              </View>
              <Text style={styles.profileName}>{child.name}</Text>
            </TouchableOpacity>
          ))}

          {/* Add New Child */}
          {isParent && (
            <TouchableOpacity
              style={[styles.profileCard, styles.addCard]}
              onPress={handleAddAnother}
            >
              <View style={styles.addCircle}>
                <Text style={styles.addIcon}>+</Text>
              </View>
              <Text style={styles.addText}>Add Child</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl * 2,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl * 2,
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontSize: 32,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xl * 2,
  },
  profileCard: {
    width: 140,
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  profileName: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.sizes.md,
    color: Colors.text,
    textAlign: 'center',
  },
  addCard: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  addCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  addIcon: {
    fontSize: 36,
    color: Colors.textSecondary,
  },
  addText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  logoutText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});
