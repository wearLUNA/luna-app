import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme';
import { BLEProvider } from '@/context/BLEContext'; 

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync(Colors.background);
    }
  }, []);

  return (
    <BLEProvider> {}
      <StatusBar style="light" backgroundColor={Colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </BLEProvider>
  );
}
