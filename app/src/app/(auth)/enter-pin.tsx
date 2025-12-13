/**
 * Enter PIN Screen
 * Child enters their 4-digit PIN to access their profile
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Typography } from '../../constants';
import { useAuthStore } from '../../store/useAuthStore';

const PIN_LENGTH = 4;

export default function EnterPinScreen() {
  const { childId, childName, childAvatar } = useLocalSearchParams<{
    childId: string;
    childName: string;
    childAvatar: string;
  }>();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const { verifyPin, selectChild, children } = useAuthStore();

  // Handle PIN verification when complete
  useEffect(() => {
    if (pin.length === PIN_LENGTH) {
      handleVerify();
    }
  }, [pin]);

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(false);

    try {
      const isValid = await verifyPin(childId!, pin);

      if (isValid) {
        // Find and select the child
        const child = children.find((c) => c.id === childId);
        if (child) {
          selectChild(child);
          router.replace('/(tabs)');
        }
      } else {
        // Wrong PIN
        setError(true);
        Vibration.vibrate(100);
        setPin('');
      }
    } catch (err) {
      setError(true);
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNumberPress = (num: string) => {
    if (pin.length < PIN_LENGTH && !isVerifying) {
      setError(false);
      setPin((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    if (!isVerifying) {
      setError(false);
      setPin((prev) => prev.slice(0, -1));
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Child Info */}
        <View style={styles.childInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{childAvatar}</Text>
          </View>
          <Text style={styles.childName}>Hi, {childName}!</Text>
          <Text style={styles.instruction}>Enter your PIN</Text>
        </View>

        {/* PIN Dots */}
        <View style={styles.pinDotsContainer}>
          {[...Array(PIN_LENGTH)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.pinDot,
                index < pin.length && styles.pinDotFilled,
                error && styles.pinDotError,
              ]}
            />
          ))}
        </View>

        {/* Error Message */}
        {error && (
          <Text style={styles.errorText}>Oops! Wrong PIN. Try again.</Text>
        )}

        {/* Number Pad */}
        <View style={styles.numberPad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map(
            (key, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.numberButton,
                  key === '' && styles.numberButtonEmpty,
                ]}
                onPress={() => {
                  if (key === 'del') {
                    handleDelete();
                  } else if (key !== '') {
                    handleNumberPress(key);
                  }
                }}
                disabled={key === '' || isVerifying}
              >
                {key === 'del' ? (
                  <Text style={styles.deleteText}>Delete</Text>
                ) : (
                  <Text style={styles.numberText}>{key}</Text>
                )}
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </SafeAreaView>
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
    paddingTop: Spacing.md,
  },
  backButton: {
    marginBottom: Spacing.lg,
  },
  backButtonText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.md,
    color: Colors.primary,
  },
  childInfo: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  childName: {
    fontFamily: Typography.fonts.bold,
    fontSize: 24,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  instruction: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
  },
  pinDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.cardBackground,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  pinDotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pinDotError: {
    backgroundColor: '#FF5252',
    borderColor: '#FF5252',
  },
  errorText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 300,
    alignSelf: 'center',
  },
  numberButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: Spacing.sm,
    backgroundColor: Colors.cardBackground,
    borderRadius: 40,
  },
  numberButtonEmpty: {
    backgroundColor: 'transparent',
  },
  numberText: {
    fontFamily: Typography.fonts.bold,
    fontSize: 32,
    color: Colors.text,
  },
  deleteText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
});
