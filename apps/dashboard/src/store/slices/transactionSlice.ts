import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDB } from '@/lib/db';
import { deleteTransactionById, updateTransactionById } from '@/lib/api';

export type Transaction = {
  id: string;
  accountId: string;
  type: string;
  value: number;
  date: string;
};

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (accountId: string) => {
    const db = await getDB();
    const all = await db.getAll('transactions');
    const filtered = all.filter((tx: Transaction) => tx.accountId === accountId);
    return filtered;
  }
);

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId: string) => {
    await deleteTransactionById(transactionId);
    return transactionId;
  }
);

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, data }: { id: string; data: Partial<Transaction> }) => {
    await updateTransactionById(id, data);
    return { id, ...data } as Transaction;
  }
);

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction: Omit<Transaction, 'id'>) => {
    const db = await getDB();
    const id = Date.now().toString();
    const newTransaction = { ...transaction, id };
    await db.add('transactions', newTransaction);
    return newTransaction;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch transactions
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      // Delete transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete transaction';
      })
      // Update transaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction.id === action.payload.id
        );
        if (index !== -1) {
          state.transactions[index] = { ...state.transactions[index], ...action.payload };
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update transaction';
      })
      // Add transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add transaction';
      });
  },
});

export const { clearError, setTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;
