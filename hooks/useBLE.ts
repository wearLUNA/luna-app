// src/hooks/useBLE.ts
import { useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, Characteristic, Device } from 'react-native-ble-plx';
import * as ExpoDevice from 'expo-device';
import base64 from 'react-native-base64';
import { useBLEContext } from '@/context/BLEContext';

const SERVICE_UUID = '00000000-1111-1234-1234-111111111111';
const DATA_UUID = '87654321-4321-4321-4321-210987654323';

function useBLE() {
  const { bleManager, connectedDevice, setConnectedDevice } = useBLEContext();
  const [allDevices, setAllDevices] = useState<Device[]>([]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const permissions = await Promise.all([
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN),
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT),
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION),
        ]);
        return permissions.every(p => p === PermissionsAndroid.RESULTS.GRANTED);
      }
    }
    return true;
  };

  const scanForPeripherals = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }
      if (device?.name?.includes('LUNA')) {
        setAllDevices(prev => {
          if (prev.find(d => d.id === device.id)) return prev;
          return [...prev, device];
        });
      }
    });
  };

  const connectToDevice = async (device: Device) => {
    try {
      const connection = await bleManager.connectToDevice(device.id);
      await connection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      setConnectedDevice(connection);
      startStreamingData(connection);
    } catch (err) {
      console.log('[BLE] Connect Error:', err);
    }
  };

  const startStreamingData = (device: Device) => {
    device.monitorCharacteristicForService(SERVICE_UUID, DATA_UUID, onData);
  };

  const onData = (error: BleError | null, char: Characteristic | null) => {
    if (error) {
      console.log('[BLE] Error in onData', error);
      return;
    }
    const decoded = base64.decode(char?.value || '');
    console.log('[BLE] Received:', decoded);
  };

  return {
    requestPermissions,
    scanForPeripherals,
    connectToDevice,
    allDevices,
    connectedDevice,
  };
} 

export default useBLE;
