/**
 * Auth Layout
 * Simple stack layout for authentication screens
 */

import { Stack } from 'expo-router';
import { Colors } from '../../constants';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="login" />
      <Stack.Screen name="add-child" />
      <Stack.Screen name="select-child" />
      <Stack.Screen name="enter-pin" />
    </Stack>
  );
}
