// src/screens/NetworkSwitchScreen.tsx
import React from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import useNetworkSwitch from '@/hooks/useNetworkSwitch';
import { Colors, Button, Spacing } from '@/constants/theme';

export default function NetworkSwitchScreen() {
  const {
    wifi1SSID,
    wifi1Password,
    setWifi1Password,
    isFetchingSSID,
    isSwitching,
    isSending,
    switchToPeripheralNetwork,
    sendCredentials,
  } = useNetworkSwitch();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Network Switch Flow</Text>
      <Text style={styles.label}>WiFi 1 (Original Network):</Text>
      <Text style={styles.value}>
        {isFetchingSSID ? 'Fetching SSID...' : wifi1SSID || 'Unknown'}
      </Text>
      <Text style={styles.label}>Enter WiFi 1 Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="WiFi 1 Password"
        secureTextEntry
        placeholderTextColor="#ccc"
        value={wifi1Password}
        onChangeText={setWifi1Password}
      />
      <TouchableOpacity style={styles.button} onPress={switchToPeripheralNetwork}>
        <Text style={styles.buttonText}>
          {isSwitching ? 'Switching...' : 'Switch to Peripheral Network'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={sendCredentials}>
        <Text style={styles.buttonText}>
          {isSending ? 'Sending...' : 'Send WiFi 1 Credentials'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  label: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 8,
  },
  value: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    color: Colors.background,
  },
  button: {
    backgroundColor: Button.background,
    paddingVertical: Button.sizes.medium.paddingVertical,
    paddingHorizontal: Button.sizes.medium.paddingHorizontal,
    borderRadius: Button.borderRadius,
    alignSelf: 'center',
    marginVertical: Spacing.medium,
  },
  buttonText: {
    color: Button.text,
    fontSize: Button.sizes.medium.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
