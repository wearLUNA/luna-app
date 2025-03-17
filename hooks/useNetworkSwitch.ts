// src/hooks/useNetworkSwitch.ts
import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import * as Location from 'expo-location';

const PERIPHERAL_SSID = 'LUNA-DEVICE';
const PERIPHERAL_PASSWORD = '123412341234';
const PERIPHERAL_IP = '192.168.4.1';

export default function useNetworkSwitch() {
  const [wifi1SSID, setWifi1SSID] = useState<string>('');
  const [wifi1Password, setWifi1Password] = useState<string>('');
  const [isFetchingSSID, setIsFetchingSSID] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [connectedToPeripheral, setConnectedToPeripheral] = useState<boolean>(false);

  useEffect(() => {
    async function requestPermissionAndFetchSSID() {
      if (Platform.OS === 'android') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Location permission is needed to fetch Wi-Fi SSID.'
          );
          return;
        }
      }
      setIsFetchingSSID(true);
      try {
        const currentSSID = await WifiManager.getCurrentWifiSSID();
        setWifi1SSID(currentSSID);
      } catch (error) {
        console.error('Error fetching WiFi SSID:', error);
        Alert.alert('Error', 'Could not fetch current Wi-Fi SSID.');
      } finally {
        setIsFetchingSSID(false);
      }
    }
    requestPermissionAndFetchSSID();
  }, []);

  const switchToPeripheralNetwork = async () => {
    if (Platform.OS === 'android') {
      setIsSwitching(true);
      try {
        await WifiManager.disconnect();
        await WifiManager.connectToProtectedSSID(PERIPHERAL_SSID, PERIPHERAL_PASSWORD, false, false);
        setConnectedToPeripheral(true);
        Alert.alert('Success', `Connected to peripheral network: ${PERIPHERAL_SSID}`);
      } catch (error) {
        console.error('Error switching networks:', error);
        Alert.alert('Error', 'Failed to switch to peripheral network.');
      } finally {
        setIsSwitching(false);
      }
    } else {
      Alert.alert('Info', 'Please manually connect to the peripheral network.');
    }
  };

  const sendCredentials = async () => {
    if (!wifi1SSID || !wifi1Password) {
      Alert.alert('Error', 'WiFi 1 credentials are missing.');
      return;
    }
    if (!connectedToPeripheral) {
      Alert.alert('Error', 'Not connected to the peripheral network.');
      return;
    }
    setIsSending(true);
    try {
      const response = await fetch(`http://${PERIPHERAL_IP}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssid: wifi1SSID, password: wifi1Password }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Credentials sent successfully.');
      } else {
        Alert.alert('Error', 'Failed to send credentials.');
      }
    } catch (error) {
      console.error('Error sending credentials:', error);
      Alert.alert('Error', 'An error occurred while sending credentials.');
    } finally {
      setIsSending(false);
    }
  };

  return {
    wifi1SSID,
    setWifi1SSID,
    wifi1Password,
    setWifi1Password,
    isFetchingSSID,
    isSwitching,
    isSending,
    connectedToPeripheral,
    switchToPeripheralNetwork,
    sendCredentials,
  };
}
