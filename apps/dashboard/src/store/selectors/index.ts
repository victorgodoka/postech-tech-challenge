import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

// Memoized selectors to prevent unnecessary re-renders
export const selectAuth = (state: RootState) => state.auth;
export const selectTransactions = (state: RootState) => state.transactions;
export const selectAccounts = (state: RootState) => state.accounts;

// Optimized selectors with createSelector
export const selectAuthSession = createSelector(
  [selectAuth],
  (auth) => auth.session
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

export const selectTransactionsByAccount = createSelector(
  [selectTransactions, (state: RootState, accountId: string) => accountId],
  (transactions, accountId) => 
    transactions.transactions.filter((tx) => tx.accountId === accountId)
);

export const selectSortedTransactions = createSelector(
  [selectTransactionsByAccount],
  (transactions) => 
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
);

export const selectAccountById = createSelector(
  [selectAccounts, (state: RootState, accountId: string) => accountId],
  (accounts, accountId) => accounts.accounts[accountId] || null
);

export const selectTransactionStats = createSelector(
  [selectSortedTransactions],
  (transactions) => ({
    total: transactions.length,
    income: transactions.filter(tx => tx.value > 0).reduce((sum, tx) => sum + tx.value, 0),
    expenses: transactions.filter(tx => tx.value < 0).reduce((sum, tx) => sum + Math.abs(tx.value), 0),
    lastTransaction: transactions[0] || null
  })
);
