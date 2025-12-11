import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { discoverRecipient } from '../../src/api/mockMojaloop';
import { validateRecipientId } from '../../src/utils/validation';

export default function DiscoveryScreen() {
  const router = useRouter();
  const [recipientId, setRecipientId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState<{id: string; name: string; dfsp: string}|null>(null);

  const recipientValidation = validateRecipientId(recipientId);
  const handleLookup = async () => {
    const validation = recipientValidation;
    setError(validation);
    if (validation) return;
    setLoading(true);
    try {
      const r = await discoverRecipient(recipientId);
      setRecipient(r);
      setError(null);
    } catch (err) {
      console.warn(err);
      setError('Failed to discover recipient. Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Recipient ID</Text>
      <TextInput
        value={recipientId}
        onChangeText={setRecipientId}
        placeholder="Enter recipient ID (e.g., 12345)"
        style={styles.input}
        keyboardType="phone-pad"
        accessibilityLabel="Recipient ID input"
        autoCapitalize="none"
      />

      <Pressable
        style={[styles.button, recipientValidation !== null || loading ? styles.buttonDisabled : null]}
        onPress={handleLookup}
        disabled={recipientValidation !== null || loading}
        accessibilityLabel="Discover recipient"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Discover</Text>
        )}
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {recipient && (
        <View style={styles.discoveredCard}>
          <Text>Sending to <Text style={{ fontWeight: '700' }}>{recipient.name}</Text> at <Text style={{fontWeight: '700'}}>{recipient.dfsp}</Text></Text>

          <Pressable
            style={styles.buttonSmall}
            onPress={() => router.push({ pathname: '/send/quote', params: { id: recipient.id, name: recipient.name, dfsp: recipient.dfsp } })}
            accessibilityLabel="Proceed to quote"
          >
            <Text style={styles.buttonText}>Proceed</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { color: '#444', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, marginBottom: 12 },
  button: { backgroundColor: '#2563EB', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { opacity: 0.55 },
  buttonText: { color: '#fff', fontWeight: '600' },
  discoveredCard: { marginTop: 20, padding: 14, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', borderRadius: 8 },
  buttonSmall: { marginTop: 12, padding: 10, borderRadius: 6, backgroundColor: '#059669', alignItems: 'center' }
  ,error: { color: '#b91c1c', marginTop: 8 }
});
