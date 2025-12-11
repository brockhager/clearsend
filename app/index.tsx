import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useBalance } from '../src/contexts/BalanceContext';

export default function Dashboard() {
  const router = useRouter();
  const { balance } = useBalance();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ClearSend</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.balance}>${balance.toFixed(2)}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.push('/send/discovery')}>
        <Text style={styles.buttonText}>Send Money</Text>
      </Pressable>

      <Pressable style={styles.buttonSecondary} onPress={() => router.push('/history')}>
        <Text style={styles.buttonTextSecondary}>Transaction History</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginTop: 10 },
  card: { width: '100%', padding: 20, marginTop: 20, borderRadius: 8, backgroundColor: '#f6f6f6', alignItems: 'center' },
  label: { color: '#666', fontSize: 14 },
  balance: { fontSize: 32, fontWeight: '700', marginTop: 8 },
  button: { marginTop: 30, padding: 14, width: '100%', alignItems: 'center', backgroundColor: '#2563EB', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  buttonSecondary: { marginTop: 12, padding: 12, width: '100%', alignItems: 'center', borderColor: '#2563EB', borderWidth: 1, borderRadius: 8 },
  buttonTextSecondary: { color: '#2563EB', fontWeight: '600' }
});
