import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBalance } from '../../src/contexts/BalanceContext';

export default function SuccessScreen() {
  const router = useRouter();
  const { transactions, balance } = useBalance();
  const params = useLocalSearchParams();
  const txId = String(params.txId ?? '');

  const tx = transactions.find((t) => t.id === txId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Complete</Text>
      {tx ? (
        <View style={styles.card}>
          <Text>To: <Text style={{ fontWeight: '700' }}>{tx.to}</Text></Text>
          <Text>DFSP: {tx.dfsp}</Text>
          <Text>Amount: ${tx.amount.toFixed(2)}</Text>
          <Text>Fee: ${tx.fee.toFixed(2)}</Text>
          <Text>Total Debit: ${tx.totalDebit.toFixed(2)}</Text>
          <Text>Status: {tx.status}</Text>
          <Text style={{ marginTop: 8, fontWeight: '700' }}>Remaining Balance: ${balance.toFixed(2)}</Text>
        </View>
      ) : (
        <Text>Transaction ID: {txId}</Text>
      )}

      <Pressable style={styles.button} onPress={() => router.push('/')}>
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  card: { marginTop: 12, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 6 },
  button: { marginTop: 22, padding: 12, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' }
});
