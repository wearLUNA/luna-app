import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import useBLE from '@/hooks/useBLE';
import { Device } from 'react-native-ble-plx';
import React from 'react';
import { Colors, Button, Spacing } from '@/constants/theme';


export default function LunaDevicesTab() {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
  } = useBLE();

  const [isScanning, setIsScanning] = React.useState(false);
  const router = useRouter();

  const handleScan = async () => {
    const granted = await requestPermissions();
    if (granted) {
      setIsScanning(true);
      scanForPeripherals();
      setTimeout(() => setIsScanning(false), 10000);
    } else {
      alert('Permissions denied');
    }
  };

  const handleConnect = async (device: Device) => {
    await connectToDevice(device);
    router.push('/NetworkSwitchScreen'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>LUNA Devices</Text>
      <TouchableOpacity style={styles.button} onPress={handleScan}>
        <Text style={styles.buttonText}>Search for Devices</Text>
      </TouchableOpacity>

      {isScanning && <ActivityIndicator size="large" style={{ marginVertical: 20 }} />}

      {connectedDevice && (
        <Text style={styles.connectedText}>
          Connected to: {connectedDevice.name ?? connectedDevice.id}
        </Text>
      )}

      <FlatList
        data={allDevices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.deviceButton} onPress={() => handleConnect(item)}>
            <Text style={styles.deviceText}>{item.name ?? 'Unnamed'} ({item.id})</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() =>
          !isScanning ? (
            <Text style={{ marginTop: 20, color: '#888' }}>
              No LUNA devices found.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.background },
  heading: { fontSize: 24, fontWeight: '600', marginBottom: 16, color: Colors.primary, paddingVertical: 30},
  button: { backgroundColor: Button.background, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: Button.text, fontWeight: '500', fontSize: 16 },
  connectedText: { color: 'green', fontWeight: 'bold', marginBottom: 10 },
  deviceButton: { padding: 12, backgroundColor: Button.background, borderRadius: 8, marginBottom: 10 },
  deviceText: { fontSize: 16 },
});
