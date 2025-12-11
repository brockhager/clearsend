import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { executeTransfer } from '../../src/api/mockMojaloop';
import { useBalance } from '../../src/contexts/BalanceContext';
import { validateAmount } from '../../src/utils/validation';

export default function ConfirmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = String(params.id ?? '');
  const name = String(params.name ?? '');
  const dfsp = String(params.dfsp ?? '');
  const amount = Number(params.amount ?? 0);
  const fee = Number(params.fee ?? 0);
  const totalDebit = Number(params.totalDebit ?? 0);
  const { commitTransfer, balance } = useBalance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    // Validate again before sending
    setError(null);
    const v = validateAmount(String(amount));
    if (v) {
      setError(v);
      return;
    }
    // enforce overspend check one more time
    if (totalDebit > balance) {
      setError(`Insufficient funds — Available: $${balance.toFixed(2)}. Total: $${totalDebit.toFixed(2)}`);
      return;
    }
    setLoading(true);
    try {
      const response = await executeTransfer('me', id, amount, { amount, fee, totalDebit });
      if (response.success) {
        const tx = await commitTransfer({ id: response.transferId, date: response.timestamp ?? new Date().toISOString(), status: 'success', to: name, dfsp, amount, fee, totalDebit });
        // navigate to success with tx id
        router.replace({ pathname: '/send/success', params: { txId: tx.id } });
      } else {
        setError('Transfer failed. Please try again.');
      }
    } catch (err) {
      console.warn(err);
      setError('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Transfer</Text>
      <View style={styles.box}>
        <Text>To: <Text style={{ fontWeight: '700' }}>{name}</Text></Text>
        <Text>DFSP: {dfsp}</Text>
        <Text>Amount: ${amount.toFixed(2)}</Text>
        <Text>Fee: ${fee.toFixed(2)}</Text>
        <Text>Total Debit: ${totalDebit.toFixed(2)}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={handleSend} style={[styles.button, loading ? styles.buttonDisabled : null]} disabled={loading} accessibilityLabel="Send transfer">
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.back()} style={styles.cancel}>
        <Text style={{ color: '#2563EB' }}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  box: { marginTop: 14, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 6 },
  button: { marginTop: 24, padding: 12, backgroundColor: '#059669', borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  cancel: { marginTop: 12, alignItems: 'center' }
  ,error: { color: '#b91c1c', marginTop: 8 }
  ,buttonDisabled: { opacity: 0.55 }
});
