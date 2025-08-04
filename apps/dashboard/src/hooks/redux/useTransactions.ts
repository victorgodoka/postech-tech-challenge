import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store/index';
import { 
  fetchTransactions, 
  deleteTransaction, 
  updateTransaction, 
  addTransaction,
  clearError 
} from '@/store/slices/transactionSlice';
import type { Transaction } from '@/store/slices/transactionSlice';

export const useTransactions = (accountId: string) => {
  const dispatch = useAppDispatch();
  const { transactions, loading, error } = useAppSelector((state: RootState) => state.transactions);

  useEffect(() => {
    if (accountId) {
      dispatch(fetchTransactions(accountId));
    }
  }, [dispatch, accountId]);

  const deleteTransactionById = async (transactionId: string) => {
    return dispatch(deleteTransaction(transactionId));
  };

  const updateTransactionById = async (id: string, data: Partial<Transaction>) => {
    return dispatch(updateTransaction({ id, data }));
  };

  const createTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    return dispatch(addTransaction(transaction));
  };

  const clearTransactionError = () => {
    dispatch(clearError());
  };

  const refetchTransactions = () => {
    if (accountId) {
      dispatch(fetchTransactions(accountId));
    }
  };

  return {
    transactions,
    loading,
    error,
    deleteTransaction: deleteTransactionById,
    updateTransaction: updateTransactionById,
    addTransaction: createTransaction,
    clearError: clearTransactionError,
    refetch: refetchTransactions,
  };
};
