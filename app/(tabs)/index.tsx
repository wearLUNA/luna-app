import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LUNA</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/LunaDevicesTab')}
      >
        <Text style={styles.buttonText}>Connect to Device</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { fontSize: 24, marginBottom: 24, color: '#fff', fontWeight: 'bold' },
  button: { backgroundColor: 'white', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: 'black', fontWeight: 'bold' },
});
