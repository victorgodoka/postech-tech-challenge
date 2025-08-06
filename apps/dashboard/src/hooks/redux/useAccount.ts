import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/index';
import { 
  fetchAccount, 
  fetchAllAccounts, 
  updateAccount,
  updateAccountBalance,
  toggleBalanceVisibility,
  clearError 
} from '@/store/slices/accountSlice';
import type { Account } from '@/store/slices/accountSlice';

export const useAccount = (accountId: string) => {
  const dispatch = useAppDispatch();
  const { accounts, loading, error } = useAppSelector((state: RootState) => state.accounts);
  
  const account = accounts[accountId] || null;

  // Logs detalhados do useAccount
  console.log('=== USEACCOUNT HOOK DEBUG ===');
  console.log('useAccount - accountId:', accountId);
  console.log('useAccount - accounts:', accounts);
  console.log('useAccount - account encontrada:', account);
  console.log('useAccount - loading:', loading);
  console.log('useAccount - error:', error);
  console.log('=== FIM USEACCOUNT HOOK ===');

  useEffect(() => {
    console.log('useAccount useEffect - accountId:', accountId);
    console.log('useAccount useEffect - accounts[accountId]:', accounts[accountId]);
    
    if (accountId && !accounts[accountId]) {
      console.log('Disparando fetchAccount para:', accountId);
      dispatch(fetchAccount(accountId));
    } else if (!accountId) {
      console.log('accountId está vazio ou null');
    } else {
      console.log('Account já existe no store');
    }
  }, [dispatch, accountId, accounts]);

  const updateAccountData = async (id: string, data: Partial<Account>) => {
    return dispatch(updateAccount({ id, data }));
  };

  const updateBalance = (id: string, balance: number) => {
    dispatch(updateAccountBalance({ id, balance }));
  };

  const toggleVisibility = (accountId: string) => {
    dispatch(toggleBalanceVisibility(accountId));
  };

  const clearAccountError = () => {
    dispatch(clearError());
  };

  const refetchAccount = () => {
    if (accountId) {
      dispatch(fetchAccount(accountId));
    }
  };

  return {
    account,
    loading,
    error,
    updateAccount: updateAccountData,
    updateBalance,
    toggleVisibility,
    clearError: clearAccountError,
    refetch: refetchAccount,
  };
};

export const useAccounts = () => {
  const dispatch = useAppDispatch();
  const { accounts, loading, error } = useAppSelector((state: RootState) => state.accounts);

  useEffect(() => {
    dispatch(fetchAllAccounts());
  }, [dispatch]);

  const accountsList = Object.values(accounts);

  return {
    accounts: accountsList,
    accountsMap: accounts,
    loading,
    error,
    refetch: () => dispatch(fetchAllAccounts()),
  };
};
