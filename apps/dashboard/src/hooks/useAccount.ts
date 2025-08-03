import { useEffect, useState } from 'react';
import { getDB } from '../lib/db';

export type Account = {
  id: string;
  name: string;
  balance: number;
  balanceVisible: boolean;
  type: string;
  updatedAt: string;
};

export const useAccount = (accountId: string) => {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const db = await getDB();
      const data = await db.get('accounts', accountId);
      setAccount(data);
    };
    fetch();
  }, [accountId]);

  return account;
};
