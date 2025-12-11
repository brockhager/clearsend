import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Transaction = {
  id: string;
  date: string; // ISO
  to: string;
  dfsp: string;
  amount: number;
  fee: number;
  totalDebit: number;
  status: 'pending'|'success'|'failed';
};

type ContextType = {
  balance: number;
  transactions: Transaction[];
  sendMoney: (t: Omit<Transaction, 'id'|'date'|'status'>) => Promise<Transaction>;
  addTransaction: (t: Transaction) => void;
};

const BalanceContext = createContext<ContextType | undefined>(undefined);

export const useBalance = () => {
  const ctx = useContext(BalanceContext);
  if (!ctx) throw new Error('useBalance must be used within BalanceProvider');
  return ctx;
};

const initialBalance = 1000.0; // Hardcoded initial balance

export const BalanceProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addTransaction = (t: Transaction) => {
    setTransactions((prev) => [t, ...prev]);
  };

  const sendMoney = async (t: Omit<Transaction, 'id'|'date'|'status'>): Promise<Transaction> => {
    // For simulation, we create the transaction, deduct the balance and return
    const transaction: Transaction = {
      ...t,
      id: `${Date.now()}-${Math.floor(Math.random()*10000)}`,
      date: new Date().toISOString(),
      status: 'success'
    };

    // Deduct
    setBalance((b) => b - transaction.totalDebit);

    addTransaction(transaction);

    return transaction;
  };

  return (
    <BalanceContext.Provider value={{ balance, transactions, sendMoney, addTransaction }}>
      {children}
    </BalanceContext.Provider>
  );
};
