import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createQuote } from '../../src/api/mockMojaloop';
import { useBalance } from '../../src/contexts/BalanceContext';
import { parseCurrency, formatCurrency } from '../../src/utils/currency';
import { validateAmount } from '../../src/utils/validation';

export default function QuoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recipientId = String(params.id ?? '');
  const recipientName = String(params.name ?? '');
  const recipientDfsp = String(params.dfsp ?? '');

  const [amountText, setAmountText] = useState('');
  const [quote, setQuote] = useState<{ amount: number; fee: number; totalDebit: number }|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { balance } = useBalance();

  const amountValidation = validateAmount(amountText);
  const handleQuote = async () => {
    setError(amountValidation);
    if (amountValidation) return;
    const a = parseCurrency(amountText);
    setLoading(true);
    try {
      const q = await createQuote(a);
      setQuote(q);
      // Check for overspend
      if (q.totalDebit > balance) {
        setError(`Insufficient funds — Available balance: $${balance.toFixed(2)}. Total: $${q.totalDebit.toFixed(2)}`);
      } else {
        setError(null);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.recipientLabel}>Sending to <Text style={{ fontWeight: '700' }}>{recipientName}</Text> at <Text style={{ fontWeight: '700' }}>{recipientDfsp}</Text></Text>

      <Text style={{ marginTop: 18, marginBottom: 6 }}>Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        placeholder='Enter amount'
        value={amountText}
        onChangeText={setAmountText}
        accessibilityLabel="Amount input"
        onBlur={() => {
          const parsed = parseCurrency(amountText);
          if (!Number.isNaN(parsed)) {
            setAmountText(formatCurrency(parsed));
          }
        }}
      />

      <Pressable
        style={[styles.button, (loading || !!amountValidation) ? styles.buttonDisabled : null]}
        onPress={handleQuote}
        disabled={loading || !!amountValidation}
        accessibilityLabel="Get quote"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Get Quote</Text>
        )}
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {quote && (
        <View style={styles.quoteBox}>
          <Text>Amount: ${quote.amount.toFixed(2)}</Text>
          <Text>Fee: ${quote.fee.toFixed(2)}</Text>
          <Text>Total debit: ${quote.totalDebit.toFixed(2)}</Text>
          <Pressable
            style={[styles.buttonProceed, (quote.totalDebit > balance || !!error) ? styles.buttonDisabled : null]}
            onPress={() =>
              router.push({ pathname: '/send/confirm', params: { id: recipientId, name: recipientName, dfsp: recipientDfsp, amount: quote.amount, fee: quote.fee, totalDebit: quote.totalDebit } })
            }
            disabled={!!error || quote.totalDebit > balance}
            accessibilityLabel="Confirm transfer"
          >
            {quote.totalDebit > balance ? (
              <Text style={styles.buttonText}>Insufficient Funds</Text>
            ) : (
              <Text style={styles.buttonText}>Confirm</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  recipientLabel: { fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 6, marginTop: 8 },
  button: { marginTop: 12, padding: 12, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  quoteBox: { marginTop: 20, padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 6 },
  buttonProceed: { marginTop: 12, padding: 10, backgroundColor: '#059669', borderRadius: 6, alignItems: 'center' }
  ,error: { color: '#b91c1c', marginTop: 8 }
  ,buttonDisabled: { opacity: 0.55 }
});
