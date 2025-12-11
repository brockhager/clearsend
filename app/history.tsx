import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useBalance } from '../src/contexts/BalanceContext';

export default function HistoryScreen() {
  const { transactions } = useBalance();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {transactions.length === 0 ? (
        <Text style={{ marginTop: 12 }}>No transactions yet.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(t) => t.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={{ fontWeight: '700' }}>{item.to} • {item.dfsp}</Text>
              <Text>Amount: ${item.amount.toFixed(2)} • Fee: ${item.fee.toFixed(2)} • Status: {item.status}</Text>
              <Text style={{ marginTop: 6, color: '#666', fontSize: 12 }}>{new Date(item.date).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: '700' },
  item: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 6, marginTop: 12 }
});
