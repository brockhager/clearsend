import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { BalanceProvider, useBalance } from '../BalanceContext';

const TestConsumer = ({ onReady }:{ onReady: (ctx: any) => void }) => {
  const { balance, transactions, commitTransfer } = useBalance();
  React.useEffect(() => {
    onReady({ getBalance: () => balance, getTransactions: () => transactions, commitTransfer });
  }, [balance, transactions, commitTransfer, onReady]);
  return null;
};

describe('BalanceContext commitTransfer', () => {
  it('deducts balance on success and adds transaction', async () => {
    let ctx: any;
    render(
      <BalanceProvider>
        <TestConsumer onReady={(c) => (ctx = c)} />
      </BalanceProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    const initial = ctx.getBalance();
    const transfer = { id: 't1', date: new Date().toISOString(), to: 'recipient-1', dfsp: 'DFSP-A', amount: 100, fee: 1, totalDebit: 101, status: 'success' };

    await act(async () => {
      await ctx.commitTransfer(transfer);
    });

    const after = ctx.getBalance();
    expect(after).toBeCloseTo(initial - transfer.totalDebit, 2);
  });

  it('does not deduct balance on failed transfers but still records transaction', async () => {
    let ctx: any;
    render(
      <BalanceProvider>
        <TestConsumer onReady={(c) => (ctx = c)} />
      </BalanceProvider>
    );

    await waitFor(() => expect(ctx).toBeDefined());

    const initial = ctx.getBalance();
    const transfer = { id: 't2', date: new Date().toISOString(), to: 'recipient-2', dfsp: 'DFSP-B', amount: 50, fee: 0.5, totalDebit: 50.5, status: 'failed' };

    await act(async () => {
      await ctx.commitTransfer(transfer);
    });

    const after = ctx.getBalance();
    expect(after).toBeCloseTo(initial, 2);
  });
});
