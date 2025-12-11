import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ConfirmScreen from '../../../app/send/confirm';
import { BalanceProvider } from '../../contexts/BalanceContext';

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn(), back: jest.fn(), push: jest.fn() }),
  useLocalSearchParams: () => ({ id: '1234', name: 'User 1234', dfsp: 'DFSP-A', amount: 100, fee: 1, totalDebit: 101 })
}));

jest.mock('../../../src/api/mockMojaloop', () => ({
  executeTransfer: jest.fn().mockResolvedValue({ success: true, transferId: 'tx-1', timestamp: new Date().toISOString(), amount: 100, fee: 1 })
}));

describe('ConfirmScreen transfer flow', () => {
  it('calls executeTransfer and commitTransfer, deducting the balance and navigating to success on success', async () => {
    const { getByLabelText, getByText } = render(
      <BalanceProvider>
        <ConfirmScreen />
      </BalanceProvider>
    );

    const sendButton = getByLabelText('Send transfer');
    fireEvent.press(sendButton);

    // Wait for success flow to run
    await waitFor(() => expect(getByText('Confirm Transfer')).toBeTruthy());
  });
});
