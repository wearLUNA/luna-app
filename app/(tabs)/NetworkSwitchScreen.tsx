// src/screens/NetworkSwitchScreen.tsx

import React from 'react';
import { useEffect } from 'react'
import { View, SafeAreaView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import useNetworkSwitch from '@/hooks/useNetworkSwitch';
import useBLE from '@/hooks/useBLE';
import { Colors, Button, Spacing } from '@/constants/theme';

export default function NetworkSwitchScreen() {
  const {
    scanForPeripherals,
    requestPermissions,
    allDevices,
    connectToDevice,
    connectedDevice,
  } = useBLE();

  const {
  wifi1SSID,
  wifi1Password,
  setWifi1Password,
  isFetchingSSID,
  isSending,
  sendCredentials,
  isTransferringFile,
  sendRandom100KFile,
} = useNetworkSwitch();


  const scanForDevices = async () => {
    console.log("entering scan");
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      console.log("permissions enabled");
      scanForPeripherals();
    }
  };
  

  useEffect(() => {
    console.log(`[BLE] Discovered ${allDevices.length} device(s)`);
  }, [allDevices]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Connect LUNA to the Internet</Text>

      <View style={styles.backgroundcard}>
      <Text style={styles.label}>Detected WiFi Network:</Text>
      <Text style={styles.value}>
        {isFetchingSSID ? 'Fetching SSID...' : "Super_Good_Wifi_Network" || 'Unknown'}
      </Text>

      <Text style={styles.label}>Enter WiFi Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="WiFi Password"
        secureTextEntry
        placeholderTextColor="#ccc"
        value={wifi1Password}
        onChangeText={setWifi1Password}
        />

      {/* Commented out: switching to peripheral network is not needed now */}
      {/*
      <TouchableOpacity
      style={styles.button}
      onPress={scanForDevices}
      disabled={isSwitching}
      >
      <Text style={styles.buttonText}>
      {isSwitching ? 'Switching...' : 'Switch to Peripheral Network'}
      </Text>
      </TouchableOpacity>
      */}

      <TouchableOpacity
        style={styles.button}
        onPress={sendCredentials}
        disabled={isSending}
        >
        <Text style={styles.buttonText}>
          {isSending ? 'Sending...' : 'Send WiFi 1 Credentials'}
        </Text>
      </TouchableOpacity>
      </View>

      {/* <TouchableOpacity
        style={styles.button}
        onPress={sendRandom100KFile}
        disabled={isTransferringFile}
      >
        <Text style={styles.buttonText}>
          {isTransferringFile ? 'Sending File...' : 'Send 100 KB Test File'}
        </Text>
      </TouchableOpacity> */}

      {/* <View style={styles.container}>
        <Text style={styles.label}>Discovered Devices:</Text>
        {allDevices.length === 0 ? (
          <View style={styles.button}>
            <Text style={styles.buttonText}>No devices found.</Text>
          </View>
        ) : (
          allDevices.map((device) => (
            <View key={device.id} style={styles.button}>
              <Text style={styles.buttonText}>
                {device.name || 'Unnamed Device'} ({device.id})
              </Text>
            </View>
          ))
        )}
      </View> */}
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
    color: Colors.text,
    fontWeight: '500',
    marginVertical: 8,
  },
  value: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
    color: Colors.background,
    borderColor: 'black',
    borderWidth: 1,
  },
  backgroundcard: {
    backgroundColor: Colors.primary,
    padding: Spacing.large,
    borderRadius: 20,
    marginBottom: Spacing.medium,
  },
  button: {
    backgroundColor: Colors.background,
    paddingVertical: Button.sizes.medium.paddingVertical,
    paddingHorizontal: Button.sizes.medium.paddingHorizontal,
    borderRadius: Button.borderRadius,
    alignSelf: 'center',
    marginVertical: Spacing.medium,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: Button.sizes.medium.fontSize,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
