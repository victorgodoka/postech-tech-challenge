import { useEffect, useState } from 'react';
import { getDB } from '../lib/db';

export type Transaction = {
  id: string;
  accountId: string;
  type: string;
  value: number;
  date: string;
};

export const useTransactions = (accountId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const db = await getDB();
      const all = await db.getAll('transactions');
      const filtered = all.filter((tx: Transaction) => tx.accountId === accountId);
      setTransactions(filtered);
    };
    fetch();
  }, [accountId]);

  return transactions;
};
