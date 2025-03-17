import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme'

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Set the Android navigation bar background and button style
      NavigationBar.setBackgroundColorAsync(Colors.background); // dark blue
      // NavigationBar.setButtonStyleAsync('light'); // light icons
    }
  }, []);

  return (
    <>
      {/* Configure the status bar */}
      <StatusBar style="light" backgroundColor={Colors.background} />

      {/* Configure the stack navigator with a dark header */}
      <Stack
        screenOptions={{
          // headerStyle: { backgroundColor: Colors.background },
          // headerTintColor: '#fff', // white text/icons in header
          // headerTitle: 'Connect',
          // Optionally, you can hide the header if you want a full-screen view:
          headerShown: false,
        }}
      />
    </>
  );
}
