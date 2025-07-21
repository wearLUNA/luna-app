// src/hooks/useNetworkSwitch.ts

import { useState, useEffect, useRef } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import * as Location from 'expo-location';
import { BleManager, Device, State, BleError } from 'react-native-ble-plx';
import useBLE from '@/hooks/useBLE';

import { Buffer } from 'buffer';
import * as ExpoDevice from 'expo-device';

const PERIPHERAL_IP = '192.168.4.1';

const SERVICE_UUID = "00000000-1111-1234-1234-111111111111";
const CREDENTIALS_CHAR_UUID = "87654321-4321-4321-4321-210987654321";
const CONTROL_UUID = "87654321-4321-4321-4321-210987654322";
const DATA_UUID = "87654321-4321-4321-4321-210987654323";

export default function useNetworkSwitch() {

  const managerRef = useRef(new BleManager());

  const [wifi1SSID, setWifi1SSID] = useState('');
  const [wifi1Password, setWifi1Password] = useState('');
  const [isFetchingSSID, setIsFetchingSSID] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [connectedToPeripheral, setConnectedToPeripheral] = useState(false);
  const [isTransferringFile, setIsTransferringFile] = useState(false);

  const { connectedDevice } = useBLE();


  // Permissions
  const requestAndroid31Permissions = async () => {
    const scan = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
    const connect = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
    const location = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    return scan === 'granted' && connect === 'granted' && location === 'granted';
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return await requestAndroid31Permissions();
      }
    }
    return true;
  };

  // Fetch SSID
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
      }
      setIsFetchingSSID(true);
      try {
        const ssid = await WifiManager.getCurrentWifiSSID();
        setWifi1SSID(ssid);
      } catch (err) {
        console.error('[useNetworkSwitch] SSID fetch failed:', err);
        Alert.alert('Error', 'Failed to fetch SSID.');
      } finally {
        setIsFetchingSSID(false);
      }
    })();
    return () => {
      managerRef.current.destroy();
    };
  }, []);

  // BLE listener
  useEffect(() => {
    if (!connectedDevice) return;
    const sub = connectedDevice.monitorCharacteristicForService(
      SERVICE_UUID,
      CREDENTIALS_CHAR_UUID,
      (error, char) => {
        if (error) {
          console.warn('[BLE Monitor] Error:', error);
          return;
        }
        if (char?.value) {
          const decoded = Buffer.from(char.value, 'base64').toString('utf8');
          Alert.alert('Device Response', decoded);
        }
      }
    );
    return () => sub.remove();
  }, [connectedDevice]);

  const sendCredentials = async () => {
    setIsSending(true);
    try {
      const payload = JSON.stringify({ type: 'networkconnect', ssid: wifi1SSID, pwd: wifi1Password });
      const base64 = Buffer.from(payload, 'utf8').toString('base64');

      if (connectedDevice) {
        await connectedDevice.writeCharacteristicWithResponseForService(SERVICE_UUID, CREDENTIALS_CHAR_UUID, base64);
        Alert.alert('Success', 'Credentials sent via BLE.');
      } else if (connectedToPeripheral) {
        const res = await fetch(`http://${PERIPHERAL_IP}/connect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        });
        if (!res.ok) throw new Error('HTTP send failed');
        Alert.alert('Success', 'Credentials sent via HTTP.');
      } else {
        throw new Error('Not connected');
      }
    } catch (err) {
      console.error('[sendCredentials] Failed:', err);
      Alert.alert('Error', 'Failed to send credentials.');
    } finally {
      setIsSending(false);
    }
  };

  const sendRandom100KFile = async () => {
    if (!connectedDevice) {
      Alert.alert('Error', 'No BLE device connected.');
      return;
    }
    const size = 100 * 1024;
    const file = new Uint8Array(size).map(() => Math.floor(Math.random() * 256));
    await sendFileOverBle(file);
  };

  const sendFileOverBle = async (fileBytes: Uint8Array) => {
    setIsTransferringFile(true);
    try {
      const control = {
        type: 'filetransfer',
        cmd: 'start',
        size: fileBytes.length,
      };
      const base64Control = Buffer.from(JSON.stringify(control), 'utf8').toString('base64');

      await connectedDevice!.writeCharacteristicWithResponseForService(SERVICE_UUID, CONTROL_UUID, base64Control);

      let offset = 0;
      const chunkSize = 180;
      while (offset < fileBytes.length) {
        const slice = fileBytes.slice(offset, offset + chunkSize);
        const base64Slice = Buffer.from(slice).toString('base64');
        await connectedDevice!.writeCharacteristicWithoutResponseForService(SERVICE_UUID, DATA_UUID, base64Slice);
        offset += chunkSize;
      }

      Alert.alert('Success', `Transferred ${fileBytes.length} bytes.`);
    } catch (err) {
      console.error('[FileTransfer] Error:', err);
      Alert.alert('Error', 'File transfer failed.');
    } finally {
      setIsTransferringFile(false);
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
    sendCredentials,
    isTransferringFile,
    sendRandom100KFile,
    sendFileOverBle,
  };
}
