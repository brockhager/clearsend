import React from 'react';
import { Stack, Slot } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { BalanceProvider } from '../src/contexts/BalanceContext';

const Layout = () => {
  return (
    <BalanceProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="index" options={{ title: 'ClearSend' }} />
          <Stack.Screen name="send/discovery" options={{ title: 'Send Money' }} />
          <Stack.Screen name="send/quote" options={{ title: 'Quote' }} />
          <Stack.Screen name="send/confirm" options={{ title: 'Confirm' }} />
          <Stack.Screen name="send/success" options={{ title: 'Success' }} />
          <Stack.Screen name="history" options={{ title: 'Transaction History' }} />
        </Stack>
        <Slot />
      </SafeAreaView>
    </BalanceProvider>
  );
};

export default Layout;
